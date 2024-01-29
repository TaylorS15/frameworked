"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useEffect, useRef, useState } from "react";
import * as api from "@/app/api";
import { useWindowResize } from "@/app/hooks";
import { useClerk } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import { Framework } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/challenge/[challenge]/[framework]/loading";

export default function Challenge({
  params,
}: {
  params: { challenge: string; framework: Framework };
}) {
  const [code, setCode] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const deviceSize = useWindowResize();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clerk = useClerk();

  // const { data, isSuccess } = useQuery({
  //   queryKey: ["challengeData", params.challenge],
  //   queryFn: async () => await api.fetchChallengeData(params.challenge),
  // });

  // useEffect(() => {
  //   if (isSuccess) {
  //     setInstructions(data.frameworks[params.framework].instructions);
  //     setCode(data.frameworks[params.framework].code);
  //   }
  // }, [isSuccess, data, params.framework]);

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
    <main className="flex max-h-screen min-h-screen w-screen flex-col items-center justify-center gap-2 bg-zinc-950">
      <Suspense fallback={<Loading />}>
        <Navigation />
        <ResizablePanelGroup
          direction={deviceSize === "MOBILE" ? "vertical" : "horizontal"}
          className="w-full flex-grow"
        >
          <ResizablePanel
            defaultSize={25}
            minSize={10}
            className="bg-zinc-925 m-2 mt-14 flex flex-col rounded-md border border-zinc-600 p-2 lg:mt-2"
          >
            <div className="flex-grow overflow-x-hidden overflow-y-scroll">
              <h1>Instruction Panel</h1>
              <p className="text-sm">{instructions}</p>
            </div>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          <ResizablePanel
            defaultSize={50}
            minSize={10}
            className="g rounded-mdap-2 bg-zinc-925 m-2 flex flex-col rounded-md border border-zinc-600 p-2"
          >
            {/*only checking if clerk is loaded because something is broken with monaco+clerk. There was a supposed fix pushed to clerk q4 2023, but still throws error*/}
            {clerk.loaded && (
              <Editor
                className="h-editor-custom border"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={(e) => setCode(e ? e : "")}
              />
            )}

            <button
              className="h-10 min-h-10 w-24 rounded-md border"
              onClick={saveAndRun}
            >
              Save & Run
            </button>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          <ResizablePanel
            className="bg-zinc-925 m-2 rounded-md"
            defaultSize={25}
            minSize={10}
          >
            <iframe
              sandbox="allow-scripts"
              ref={iframeRef}
              className="bg-zinc-925 h-full w-full rounded-md border border-zinc-600 text-white"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Suspense>
    </main>
  );
}
