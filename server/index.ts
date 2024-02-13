import express from 'express';
import cors from 'cors';
import { transformAsync } from '@babel/core';

const app = express();
const port = 4000;

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

app.post('/transpileReact', async (req, res) => {
	const code = req.body.code;
	const css = req.body.css;
	try {
		const fullCode = `${code} ReactDOM.createRoot(document.getElementById('root')).render(<App />);`;
		const transpiledCode = await transformAsync(fullCode, {
			presets: ['@babel/preset-env', '@babel/preset-react'],
		});

		const htmlContent = `
			<html>
				<head>
					<script src="https://unpkg.com/react/umd/react.development.js"></script>
					<script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
					<style>
						${css}
					</style>
				</head>
				<body>
					<div id="root"></div>
					<script type="text/javascript">
						${transpiledCode?.code}
					</script>
				</body>
			</html>
		`;

		res.json({ transpiledReact: htmlContent });
	} catch (error) {
		console.log(error);
		res.status(500).send(error);
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
