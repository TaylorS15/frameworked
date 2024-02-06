"use client";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Suspense, useEffect, useRef, useState } from "react";
import * as api from "@/app/api";
import Navigation from "@/components/Navigation";
import { Framework } from "@/app/types";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/challenge/[challenge]/[framework]/loading";
import InstructionPanel from "@/components/InstructionPanel";
import { useWindowResize } from "@/app/hooks";
import { useStore } from "@/app/store";
import EditorPanel from "@/components/EditorPanel";

export default function Challenge({
  params,
}: {
  params: { challenge: string; framework: Framework };
}) {
  const [instructions, setInstructions] = useState<string>("");
  const { setCurrentCode, setCodeFiles } = useStore();
  const deviceSize = useWindowResize();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const { data, isSuccess } = useQuery({
    queryKey: ["challengeData", params.challenge],
    queryFn: async () => await api.fetchChallengeData(params.challenge),
  });

  useEffect(() => {
    if (isSuccess) {
      setInstructions(data.frameworks[params.framework].instructions);
      setCodeFiles(data.frameworks[params.framework].code);
      setCurrentCode(
        Object.keys(data.frameworks[params.framework].code)[0],
        Object.values(data.frameworks[params.framework].code)[0],
      );
    }
  }, [isSuccess, data, params.framework]);

  //Created to make passing props to InstructionPanel easier
  function resetCode() {
    if (isSuccess)
      setCurrentCode(
        Object.keys(data.frameworks[params.framework].code)[0],
        Object.values(data.frameworks[params.framework].code)[0],
      );
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
            />
          </ResizablePanel>

          <ResizableHandle withHandle className="w-0" />

          <ResizablePanel
            defaultSize={50}
            minSize={10}
            className="m-2 flex flex-col rounded-md border border-zinc-600 bg-zinc-925 p-2"
          >
            <EditorPanel iframeRef={iframeRef} />
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
