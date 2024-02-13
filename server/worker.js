const fs = require('fs');
const webpack = require('webpack');
const workerpool = require('workerpool');

function transpile(code, css) {
	return new Promise((resolve, reject) => {
		const uniqueFilename = `./temp_${Date.now()}_${Math.random()}.js`;
		fs.writeFileSync(uniqueFilename, code);

		webpack(
			{
				entry: uniqueFilename,
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
					reject('Error transpiling code');
					return;
				}

				const bundledCode = fs.readFileSync('./bundle.js', 'utf-8');

				fs.unlinkSync(uniqueFilename);
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

				resolve(htmlContent);
			}
		);
	});
}

workerpool.worker({
	transpile,
});
