import express from 'express';
import cors from 'cors';
import path from 'path';
import workerpool from 'workerpool';
import { performance } from 'perf_hooks';

const app = express();
const port = 4000;

app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000',
	})
);

const pool = workerpool.pool(path.resolve(__dirname, './worker.js'));

app.post('/transpileReact', async (req, res) => {
	try {
		const t0 = performance.now();
		const initialMemoryUsage = process.memoryUsage().heapUsed / 1024 / 1024;

		const code =
			"import React from 'react';\nimport ReactDOM from 'react-dom';\n" +
			req.body.code +
			"\n\nReactDOM.createRoot(document.getElementById('root')).render(<App />);";
		const css = req.body.css;

		pool.exec('transpile', [code, css])
			.then((result) => {
				const t1 = performance.now();
				const finalHeapUsed = process.memoryUsage().heapUsed / 1024 / 1024;
				console.log('Transpilation took', (t1 - t0).toFixed(2), 'milliseconds');
				console.log('Memory usage:', (finalHeapUsed - initialMemoryUsage).toFixed(2), 'MB');

				res.json({ transpiledReact: result });
			})
			.catch((err) => {
				const t1 = performance.now();
				const finalHeapUsed = process.memoryUsage().heapUsed / 1024 / 1024;
				console.log('Transpilation took', t1 - t0, 'milliseconds');
				console.log('Memory usage:', (finalHeapUsed - initialMemoryUsage).toFixed(2), 'MB');

				console.error(err);
				res.status(500).send('Error transpiling code');
			});
	} catch (err) {
		console.error(err);
		res.status(500).send('Error transpiling code');
	}
});

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
