'use client';
import { Editor } from '@monaco-editor/react';
import { useRef, useState } from 'react';

const placeholderCode =
	'function App() {\n' +
	'  const [state, setState] = React.useState("");\n' +
	'  return (\n' +
	'    <div>\n' +
	'      <h1>Hello World</h1>\n' +
	'      <button onClick={() => setState("clicked")}>Click Me</button>\n' +
	'      <p>{state}</p>\n' +
	'    </div>\n' +
	'  );\n' +
	'}';

export default function Home() {
	const [code, setCode] = useState<string>(placeholderCode);
	const iframeRef = useRef<HTMLIFrameElement>(null);

	async function runCode() {
		try {
			const response = await fetch('http://localhost:4000/transpile', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ code: code }),
			}).then((res) => res.json());

			if (iframeRef.current) {
				const blob = new Blob([response.transpiledReact], { type: 'text/html' });
				const url = URL.createObjectURL(blob);
				iframeRef.current.src = url;
				URL.revokeObjectURL(url);
			}
		} catch (error) {
			console.error('Error running code:', error);
		}
	}

	return (
		<main className="flex min-h-screen flex-col gap-12 items-center">
			<div className="flex w-full">
				<Editor
					className="w-max h-[500px] rounded-md border-2 border-blue-500"
					defaultLanguage="javascript"
					theme="vs-dark"
					value={code}
					defaultValue={placeholderCode}
					onChange={(e) => {
						if (e) setCode(e);
					}}
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
