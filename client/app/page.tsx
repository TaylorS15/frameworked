"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { useEffect, useRef, useState } from "react";
import * as api from "@/app/api";

export default function Home() {
  const [code, setCode] = useState<string>("");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    fetch("/placeholder-code/react/1-Button-Click.txt")
      .then((res) => res.text())
      .then((text) => setCode(text))
      .catch((err) => console.error(err));
  }, []);

  async function saveAndRun() {
    try {
      const transpiledCode = await api.transpileReact(code);

      if (iframeRef.current) {
        const blob = new Blob([transpiledCode], { type: "text/html" });
        const url = URL.createObjectURL(blob);
        iframeRef.current.src = url;
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Error running code:", error);
    }
  }

  console.log("changing");

  return (
    <main className="flex min-h-screen w-screen flex-col items-center justify-center">
      <ResizablePanelGroup direction="horizontal" className="h-[90vh] w-full">
        <ResizablePanel
          defaultSize={200}
          className="max-h-[90vh] rounded-md border-2 border-purple-500"
        >
          <h1>Instruction Panel</h1>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={200}
          className="flex max-h-[90vh] flex-col gap-2"
        >
          <Editor
            className="rounded-md border-2 border-blue-500"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={code}
            onChange={(e) => setCode(e ? e : "")}
          />

          <button
            className="w-24 rounded-md border-2 border-green-500"
            onClick={saveAndRun}
          >
            Save & Run
          </button>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={200} className="max-h-[90vh] w-max">
          <iframe
            sandbox="allow-scripts"
            ref={iframeRef}
            className="h-full rounded-md border-2 border-red-500 bg-white"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
