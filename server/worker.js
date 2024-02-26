const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ufs = require('unionfs').ufs;
const { createFsFromVolume, Volume } = require('memfs');
const workerpool = require('workerpool');

function transpile(code, css) {
	return new Promise(async (resolve, reject) => {
		const date = Date.now();
		const uniqueFilename = `/temp_${date}_${Math.floor(date * Math.random())}.js`;

		const memfsVol = createFsFromVolume(new Volume());
		memfsVol.mkdirSync(__dirname, { recursive: true });
		memfsVol.writeFileSync(path.join(__dirname, uniqueFilename), code);

		ufs.use(fs).use(memfsVol);

		const compiler = webpack({
			mode: 'production',
			entry: uniqueFilename,
			output: {
				path: __dirname,
				filename: 'bundle.js',
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						use: {
							loader: 'babel-loader',
							options: {
								presets: ['@babel/preset-env', '@babel/preset-react'],
							},
						},
					},
				],
			},
		});

		compiler.inputFileSystem = ufs;
		compiler.outputFileSystem = memfsVol;

		compiler.run((err, stats) => {
			if (err) {
				console.log(err);
				reject();
				return;
			}

			const bundledCode = memfsVol.readFileSync(path.join(__dirname, 'bundle.js'), 'utf-8');

			ufs.unlinkSync(path.join(__dirname, uniqueFilename));
			ufs.unlinkSync(path.join(__dirname, 'bundle.js'));
			ufs.unlinkSync(path.join(__dirname, 'bundle.js.LICENSE.txt'));

			const htmlContent = `<html>\n\t<head>\n\t\t<style>${css}</style>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script type="text/javascript">\n\t\t\t${bundledCode}\n\t\t</script>\n\t</body>\n</html>`;
			resolve(htmlContent);
		});
	});
}

workerpool.worker({
	transpile,
});
