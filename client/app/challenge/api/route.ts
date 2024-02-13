import { transformAsync } from "@babel/core";

//UNUSED - Currently broken, babel doesn't seem to work (easily) in serverless env, possibly able to fix with further config?
export async function POST(req: Request) {
  const body = await req.json();
  const code = body.code;
  const css = body.css;
  try {
    const fullCode = `${code} ReactDOM.createRoot(document.getElementById('root')).render(<App />);`;
    const transpiledCode = await transformAsync(fullCode, {
      presets: ["@babel/preset-env", "@babel/preset-react"],
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

    return Response.json({ transpiledReact: htmlContent });
  } catch (error) {
    console.log(error);
    return Response.error();
  }
}
