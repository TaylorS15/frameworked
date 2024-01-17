"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";
import * as api from "@/app/api";
import { useWindowResize } from "@/app/hooks";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const { width, height } = useWindowResize();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/question-data/1-Counter/react/code.txt")
      .then((res) => res.text())
      .then((text) => setCode(text))
      .catch((err) => console.error(err));

    fetch("/question-data/1-Counter/react/instructions.txt")
      .then((res) => res.text())
      .then((text) => setInstructions(text))
      .catch((err) => console.error(err));
  }, []);

  async function saveAndRun() {
    let transpiledCode;

    try {
      transpiledCode = await api.transpileReact(code);
    } catch (error) {
      transpiledCode = "<html><body><h1>Transpilation Error</h1></body></html>";
    }

    if (iframeRef.current && transpiledCode) {
      const blob = new Blob([transpiledCode], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      URL.revokeObjectURL(url);
    }
  }

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <ResizablePanelGroup
        direction={width < 1024 ? "vertical" : "horizontal"}
        style={{ height: "90vh" }}
        className="w-full border-2 border-orange-500"
      >
        <ResizablePanel
          defaultSize={25}
          minSize={10}
          className="rounded-md border-2 border-purple-500"
        >
          <h1>Instruction Panel</h1>
          <p className="text-sm">{instructions}</p>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={50}
          minSize={10}
          className="flex flex-col gap-2"
        >
          <Editor
            className="h-auto rounded-md border-2 border-blue-500"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(e) => setCode(e ? e : "")}
          />
          <button
            className="h-10 w-24 rounded-md border-2 border-green-500"
            onClick={saveAndRun}
          >
            Save & Run
          </button>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={25} minSize={10}>
          <iframe
            sandbox="allow-scripts"
            ref={iframeRef}
            className="h-full w-full rounded-md border-2 border-red-500 bg-white"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
