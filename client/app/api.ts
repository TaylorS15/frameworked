export async function transpileReact(code: string) {
	const response = await fetch('http://localhost:4000/transpileReact', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ code: code }),
	}).then((res) => res.json());

	return response.transpiledReact;
}
