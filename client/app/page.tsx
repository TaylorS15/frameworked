'use client';
import { Editor, OnChange } from '@monaco-editor/react';
import { useRef, useState } from 'react';

const placeholderCode =
	'function App() {\n' +
	'\treturn (\n' +
	'\t\t<div>\n' +
	'\t\t\t<h1>Hello World</h1>\n' +
	'\t\t</div>\n' +
	'\t);\n' +
	'}';

export default function Home() {
	const [code, setCode] = useState<string>(placeholderCode);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	const handleEditorChange: OnChange = (value: string | undefined) => {
		if (value !== undefined) {
			setCode(value);
		}
	};

	function runCode() {
		if (iframeRef.current) {
			const htmlContent = `
            <html>
            <head>
                <script src="https://unpkg.com/react/umd/react.development.js"></script>
                <script src="https://unpkg.com/react-dom/umd/react-dom.development.js"></script>
                <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
            </head>
            <body>
                <div id="root"></div>
                <script type="text/babel">
                    ${code}
                    ReactDOM.render(<App />, document.getElementById('root'));
                </script>
            </body>
            </html>
        `;

			try {
				const blob = new Blob([htmlContent], { type: 'text/html' });
				const url = URL.createObjectURL(blob);
				iframeRef.current.src = url;
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Error running code:', error);
			}
		}
	}

	return (
		<main className="flex min-h-screen flex-col gap-12 items-center">
			<div className="flex w-full">
				<Editor
					className="w-max h-[500px] rounded-md border-2 border-blue-500"
					defaultLanguage="javascript"
					defaultValue={placeholderCode}
					onChange={handleEditorChange}
				/>
				<button
					className="w-24 h-16 rounded-md border-2 border-green-500"
					onClick={runCode}>
					Save & Run
				</button>
			</div>

			<iframe
				sandbox="allow-scripts"
				ref={iframeRef}
				className="h-[500px] w-full rounded-md border-2 border-red-500 bg-white"
			/>
		</main>
	);
}
