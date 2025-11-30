import { useState, useEffect } from "react";

export const useIsDesktop = () => {
  const query = window.matchMedia("(min-width: 1024px)");
  const [isDesktop, setIsDesktop] = useState(query.matches);

  useEffect(() => {
    const listener = (e) => setIsDesktop(e.matches);
    query.addEventListener("change", listener);
    return () => query.removeEventListener("change", listener);
  }, []);

  return isDesktop;
};
