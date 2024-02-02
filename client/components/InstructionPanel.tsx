import { useDateTimer } from "@/app/hooks";
import React, { useState } from "react";

export default function InstructionPanel({
  instructions,
  isRunning,
  setIsRunning,
  resetCode,
}: {
  instructions: string;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  resetCode: () => void;
}) {
  const [isResetting, setIsResetting] = useState<boolean>(false);
  const { seconds, minutes, hours } = useDateTimer(isRunning);

  return (
    <>
      <div className="flex-grow overflow-x-hidden overflow-y-scroll">
        <div className="flex justify-between">
          <h1 className="font-bold">Instructions:</h1>
          {isRunning && (
            <p>
              {hours}h:{minutes}m:{seconds}s
            </p>
          )}
        </div>
        <p className="text-sm">{instructions}</p>
      </div>
      <div className="flex w-full">
        {!isRunning ? (
          <button
            className="my-auto flex h-8 w-14 items-center justify-center rounded-md border text-sm transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => setIsRunning(true)}
          >
            Start
          </button>
        ) : (
          <div className="flex w-full items-end justify-between gap-2">
            {!isResetting ? (
              <button
                className="my-auto flex h-8 w-14 min-w-14 items-center justify-center rounded-md border text-sm transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-red-900/50 hover:to-red-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => {
                  setIsResetting(true);
                }}
              >
                Reset
              </button>
            ) : (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <button
                    className="my-auto flex h-8 w-20 min-w-20 items-center justify-center rounded-md border text-sm transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                    onClick={() => {
                      setIsResetting(false);
                      setIsRunning(false);
                      resetCode();
                    }}
                  >
                    Confirm?
                  </button>
                  <p className="ml-2 min-w-56 text-xs text-zinc-400">
                    You will lose your coding progress.
                  </p>
                </div>
                <button
                  className="my-auto flex h-8 w-14 items-center justify-center rounded-md border text-sm transition-all hover:border-zinc-600 hover:bg-gradient-to-br hover:from-blue-900/50 hover:to-blue-900/20 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => {
                    setIsResetting(false);
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
