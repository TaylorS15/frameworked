import { useEffect, useRef, useState } from "react";

export function useWindowResize() {
  const [windowSize, setWindowSize] = useState<"MOBILE" | "DESKTOP">("DESKTOP");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && windowSize !== "MOBILE") {
        setWindowSize("MOBILE");
      }
      if (window.innerWidth > 1025 && windowSize !== "DESKTOP") {
        setWindowSize("DESKTOP");
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [windowSize]);

  return windowSize ?? "DESKTOP";
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement>,
  setNavState: (string: "OPEN" | "CLOSED") => void,
  ignoredElements: React.RefObject<HTMLElement>[],
) {
  const handleClickOutside = (event: MouseEvent) => {
    if (
      ref.current &&
      !ref.current.contains(event.target as Node) &&
      ignoredElements.every(
        (dep) => !dep.current?.contains(event.target as Node),
      )
    ) {
      setNavState("CLOSED");
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
}

export function useDateTimer(trigger: boolean): {
  seconds: number;
  minutes: number;
  hours: number;
} {
  const startingTime = useRef<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);

  useEffect(() => {
    if (!trigger) {
      setSeconds(0);
      setMinutes(0);
      setHours(0);
      return;
    }

    startingTime.current = new Date().getTime();

    const interval = setInterval(() => {
      const currentTime = new Date().getTime();
      const timeDifference = currentTime - startingTime.current;

      setSeconds(Math.floor((timeDifference / 1000) % 60));
      setMinutes(Math.floor((timeDifference / 1000 / 60) % 60));
      setHours(Math.floor((timeDifference / (1000 * 60 * 60)) % 24));
    }, 1000);

    return () => clearInterval(interval);
  }, [trigger]);

  return {
    seconds,
    minutes,
    hours,
  };
}
