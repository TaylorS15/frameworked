"use client";
import { Editor } from "@monaco-editor/react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useEffect, useRef, useState } from "react";
import * as api from "@/app/api";
import { useClerk } from "@clerk/nextjs";
import Navigation from "@/components/Navigation";
import { Framework } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/challenge/[challenge]/[framework]/loading";
import { Loader2, PlayIcon } from "lucide-react";
import InstructionPanel from "@/components/InstructionPanel";
import { useWindowResize } from "@/app/hooks";

export default function Challenge({
  params,
}: {
  params: { challenge: string; framework: Framework };
}) {
  const [code, setCode] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const deviceSize = useWindowResize();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const clerk = useClerk();

  const { data, isSuccess } = useQuery({
    queryKey: ["challengeData", params.challenge],
    queryFn: async () => await api.fetchChallengeData(params.challenge),
  });

  useEffect(() => {
    if (isSuccess) {
      setInstructions(data.frameworks[params.framework].instructions);
      setCode(data.frameworks[params.framework].code);
    }
  }, [isSuccess, data, params.framework]);

  async function saveAndRun() {
    setIsFetching(true);

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

    setIsFetching(false);
  }

  //Created to make passing props to InstructionPanel easier
  function resetCode() {
    if (isSuccess) setCode(data.frameworks[params.framework].code);
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
            className="m-2 mt-14 flex flex-col justify-between rounded-md border border-zinc-600 bg-zinc-925 p-2 lg:mt-2"
          >
            <InstructionPanel
              resetCode={resetCode}
              instructions={instructions}
              isRunning={isRunning}
              setIsRunning={setIsRunning}
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          <ResizablePanel
            defaultSize={50}
            minSize={10}
            className="m-2 flex flex-col gap-2 rounded-md border border-zinc-600 bg-zinc-925 p-2"
          >
            {/*only checking if clerk is loaded because something is broken with monaco+clerk. There was a supposed fix pushed to clerk q4 2023, but still throws error*/}
            {clerk.loaded && (
              <div className="relative h-editor-custom w-full">
                <div
                  className={`${
                    isRunning ? "hidden" : ""
                  } absolute z-20 h-full w-full rounded-md bg-zinc-700/30 backdrop-blur-sm`}
                />
                <Editor
                  className="h-editor-custom rounded-md"
                  defaultLanguage="javascript"
                  theme="vs-dark"
                  value={code}
                  onChange={(e) => setCode(e ? e : "")}
                />
              </div>
            )}

            <button
              className="my-auto flex h-10 w-20 items-center justify-center rounded-md transition-all hover:border hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={saveAndRun}
              disabled={isFetching || !isRunning}
            >
              {!isFetching ? (
                <>
                  <PlayIcon className="w-5" />
                  <p className="ml-2 text-sm">Run</p>
                </>
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </button>
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          <ResizablePanel
            className="m-2 rounded-md bg-zinc-925"
            defaultSize={25}
            minSize={10}
          >
            <iframe
              sandbox="allow-scripts"
              ref={iframeRef}
              className="h-full w-full rounded-md border border-zinc-600 bg-zinc-925 text-white"
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </Suspense>
    </main>
  );
}
