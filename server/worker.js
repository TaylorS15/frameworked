const webpack = require('webpack');
const fs = require('fs');
const path = require('path');
const ufs = require('unionfs').ufs;
const { createFsFromVolume, Volume } = require('memfs');
const workerpool = require('workerpool');

function transpile(code, css) {
	return new Promise(async (resolve, reject) => {
		const date = Date.now();
		const uniqueFilename = `${date}_${Math.floor(date * Math.random())}`;
		const tempFilename = `/temp_${uniqueFilename}.js`;
		const bundleFilename = `/bundle_${uniqueFilename}.js`;

		const memfsVol = createFsFromVolume(new Volume());
		//Mirror the current dir in the memfs volume so that webpack can resolve node_modules
		memfsVol.mkdirSync(__dirname, { recursive: true });
		memfsVol.writeFileSync(path.join(__dirname, tempFilename), code);

		ufs.use(fs).use(memfsVol);

		const compiler = webpack({
			mode: 'production',
			entry: tempFilename,
			output: {
				path: __dirname,
				filename: bundleFilename.replace(/^\//, ''),
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

		//Must use ufs as inputFileSystem insead of memfs because webpack must be able to resolve babel-loader/its presets from node_modules
		compiler.inputFileSystem = ufs;
		compiler.outputFileSystem = memfsVol;

		compiler.run((err, stats) => {
			if (err) {
				console.log(err);
				reject();
				return;
			}

			const bundledCode = memfsVol.readFileSync(
				path.join(__dirname, bundleFilename),
				'utf-8'
			);

			memfsVol.unlinkSync(path.join(__dirname, tempFilename));
			memfsVol.unlinkSync(path.join(__dirname, bundleFilename));
			memfsVol.unlinkSync(path.join(__dirname, `${bundleFilename}.LICENSE.txt`));

			const htmlContent = `<html>\n\t<head>\n\t\t<style>${css}</style>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script type="text/javascript">\n\t\t\t${bundledCode}\n\t\t</script>\n\t</body>\n</html>`;
			resolve(htmlContent);
		});
	});
}

workerpool.worker({
	transpile,
});
