import { useEffect, useState } from "react";

export const useWindowResize = () => {
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
};

export const useClickOutside = (
  ref: React.RefObject<HTMLElement>,
  setNavState: (string: "OPEN" | "CLOSED") => void,
  ignoredElements: React.RefObject<HTMLElement>[],
) => {
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
};
