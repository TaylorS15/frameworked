import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { webpack } from 'webpack';

const app = express();
const port = 4000;

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

app.post('/transpileReact', async (req, res) => {
	try {
		const code =
			"import React from 'react';\nimport ReactDOM from 'react-dom';\n" +
			req.body.code +
			"\n\nReactDOM.createRoot(document.getElementById('root')).render(<App/>);";
		const css = req.body.css;

		fs.writeFileSync('./temp.js', code);

		webpack(
			{
				entry: './temp.js',
				output: {
					filename: 'bundle.js',
					path: __dirname,
				},
				mode: 'production',
				module: {
					rules: [
						{
							test: /\.(js|jsx)$/,
							use: {
								loader: 'babel-loader',
								options: {
									presets: ['@babel/preset-react', '@babel/preset-env'],
								},
							},
						},
					],
				},
			},
			(err, stats) => {
				if (err || stats?.hasErrors()) {
					console.error('Compiler error:', err, stats?.toString());
					res.status(500).send('Error transpiling code');
					return;
				}

				const bundledCode = fs.readFileSync('./bundle.js', 'utf-8');

				fs.unlinkSync('./temp.js');
				fs.unlinkSync('./bundle.js');
				fs.unlinkSync('./bundle.js.LICENSE.txt');

				const htmlContent = `
					<html>
						<head>
							<style>${css}</style>
						</head>
						<body>
							<div id="root"></div>
							<script type="text/javascript">
								${bundledCode}
							</script>
						</body>
					</html>
    		`;

				res.json({ transpiledReact: htmlContent });
			}
		);
	} catch (err) {
		console.error(err);
		res.status(500).send('Error transpiling code');
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
