import { useStore } from "@/app/store";
import { useClerk } from "@clerk/nextjs";
import { Editor } from "@monaco-editor/react";
import { useState } from "react";
import * as api from "@/app/api";
import { Loader2, PlayIcon } from "lucide-react";

export default function EditorPanel({
  iframeRef,
}: {
  iframeRef: React.RefObject<HTMLIFrameElement>;
}) {
  const { isTimerRunning, currentCode, setCurrentCode } = useStore();
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const clerk = useClerk();

  async function saveAndRun() {
    setIsFetching(true);

    let transpiledCode = `<html><body><h2 style="color: #FFFFFF;">Client Transpilation Error</h2></body></html>`;

    try {
      transpiledCode = await api.transpileReact(currentCode);
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

  return (
    <>
      {/*only checking if clerk is loaded because something is broken with monaco+clerk. There was a supposed fix pushed to clerk q4 2023, but still throws error. https://github.com/clerk/javascript/issues/1643*/}
      {clerk.loaded && (
        <div className="relative h-editor-custom w-full">
          <div
            className={`${
              isTimerRunning ? "hidden" : ""
            } absolute z-20 h-full w-full rounded-md bg-zinc-700/30 backdrop-blur-sm`}
          />
          <Editor
            className="h-editor-custom rounded-md"
            defaultLanguage="javascript"
            theme="vs-dark"
            value={currentCode}
            options={{
              minimap: { enabled: false },
            }}
            onChange={(e) => setCurrentCode(e ? e : "")}
          />
        </div>
      )}

      <button
        className="my-auto flex h-10 w-20 items-center justify-center rounded-md border transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50"
        onClick={saveAndRun}
        disabled={isFetching || !isTimerRunning}
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
    </>
  );
}
