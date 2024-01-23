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
import { useClerk } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";

export default function Challenge({
  params,
}: {
  params: { challenge: string; framework: string };
}) {
  const [code, setCode] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const deviceSize = useWindowResize();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clerk = useClerk();

  useEffect(() => {
    fetch(`/challenges-map.json/`)
      .then((res) => res.json())
      .then((json) => {
        const challenge = json[params.challenge][params.framework];
        setCode(challenge.code);
        setInstructions(challenge.instructions);
      });
  }, [params.challenge, params.framework]);

  async function saveAndRun() {
    let transpiledCode = `<html><body><h2 style="color: #FFFFFF;">Client Transpilation Error</h2></body></html>`;

    try {
      transpiledCode = await api.transpileReact(code);
    } catch (error) {
      transpiledCode = `<html><body><h2 style="color: #FFFFFF;">Server Transpilation Error</h2></body></html>`;
    }

    if (iframeRef.current) {
      const blob = new Blob([transpiledCode], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      iframeRef.current.src = url;
      URL.revokeObjectURL(url);
    }
  }

  return (
    <main className="flex max-h-screen min-h-screen w-screen flex-col items-center justify-center gap-2 bg-teal-1000">
      <ResizablePanelGroup
        direction={deviceSize === "MOBILE" ? "vertical" : "horizontal"}
        className="w-full flex-grow"
      >
        <ResizablePanel
          defaultSize={25}
          minSize={10}
          className="m-2 mt-14 flex flex-col rounded-md border-2 border-teal-950 p-2"
        >
          <Navigation />

          <div className="flex-grow overflow-x-hidden overflow-y-scroll">
            <h1>Instruction Panel</h1>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
            <p className="text-sm">{instructions}</p>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle className="w-0" />

        <ResizablePanel
          defaultSize={50}
          minSize={10}
          className="m-2 flex flex-col gap-2 rounded-md border-2 border-teal-950 p-2"
        >
          {/*only checking if clerk is loaded because something is broken with monaco+clerk. There was a supposed fix pushed to clerk q4 2023, but still throws error*/}
          {clerk.loaded && (
            <Editor
              className="h-editor-custom border-2"
              defaultLanguage="javascript"
              theme="vs-dark"
              value={code}
              onChange={(e) => setCode(e ? e : "")}
            />
          )}

          <button
            className="h-10 min-h-10 w-24 rounded-md border-2"
            onClick={saveAndRun}
          >
            Save & Run
          </button>
        </ResizablePanel>

        <ResizableHandle withHandle className="w-0" />

        <ResizablePanel className="m-2" defaultSize={25} minSize={10}>
          <iframe
            sandbox="allow-scripts"
            ref={iframeRef}
            className="h-full w-full rounded-md border-2 border-teal-950 bg-teal-1000 text-white"
          />
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
