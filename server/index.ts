import express from 'express';
import cors from 'cors';
import path from 'path';
import webpack from 'webpack';
import fs from 'fs';
import { createFsFromVolume, Volume } from 'memfs';
import ufs, { IFS } from 'unionfs';

const app = express();
const port = 3001;

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

app.post('/transpile-react', async (req, res) => {
	const code =
		"import React from 'react';\nimport ReactDOM from 'react-dom';\n" +
		req.body.code +
		"\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);";
	const css = req.body.css;

	try {
		//Creating unique filenames, not necessarily needed running locally.
		const date = Date.now();
		const uniqueFilename = `${date}_${Math.floor(date * Math.random())}`;
		const tempFilename = `/temp_${uniqueFilename}.js`;
		const bundleFilename = `/bundle_${uniqueFilename}.js`;

		const memfs = createFsFromVolume(new Volume());
		//Mirror the current dir in the memfs volume so that webpack can resolve node_modules
		memfs.mkdirSync(__dirname, { recursive: true });
		memfs.writeFileSync(path.join(__dirname, tempFilename), code);

		/**
		 * @TODO - Fix typing
		 */
		ufs.use(fs).use(memfs as unknown as IFS);

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
		compiler.outputFileSystem = memfs;

		compiler.run((err, stats) => {
			if (err) {
				/**
				 * @TODO - Handle errors
				 */
				console.log(err);
				return;
			}

			const bundledCode = memfs.readFileSync(
				path.join(__dirname, bundleFilename),
				'utf-8'
			);

			memfs.unlinkSync(path.join(__dirname, tempFilename));
			memfs.unlinkSync(path.join(__dirname, bundleFilename));
			memfs.unlinkSync(path.join(__dirname, `${bundleFilename}.LICENSE.txt`));

			const htmlContent = `<html>\n\t<head>\n\t\t<style>${css}</style>\n\t</head>\n\t<body>\n\t\t<div id="root"></div>\n\t\t<script type="text/javascript">\n\t\t\t${bundledCode}\n\t\t</script>\n\t</body>\n</html>`;
			res.json({ transpiledReact: htmlContent });
		});
	} catch (err) {
		/**
		 * @TODO - Handle errors
		 */
		console.error(err);
		res.status(500).send('Error transpiling code');
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
