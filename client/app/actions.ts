'use server';
import * as babel from '@babel/core';

//Babel cannot find the correctly installed modules
export async function transpileReact(code: string) {
	const transpiledCode = babel.transformSync(code, {
		presets: ['@babel/preset-react', '@babel/preset-env'],
	});

	const htmlContent = `
			<html>
				<head>
					<script src="https://unpkg.com/react/umd/react.development.js"></script>
					<script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
				</head>
				<body>
					<div id="root"></div>
					<script type="text/javascript">
						${transpiledCode?.code}
        		ReactDOM.render(React.createElement(App), document.getElementById('root'));
					</script>
				</body>
			</html>
		`;

	return htmlContent;
}
