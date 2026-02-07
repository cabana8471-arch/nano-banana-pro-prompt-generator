"use client";

import { useEffect, useRef } from "react";

/**
 * Hook that adds Ctrl/Cmd+Enter keyboard shortcut to trigger generation.
 * Uses a ref to avoid stale closure issues with the callback.
 */
export function useGenerateShortcut(onGenerate: () => void) {
  const callbackRef = useRef(onGenerate);

  useEffect(() => {
    callbackRef.current = onGenerate;
  });

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && !isInput) {
        e.preventDefault();
        callbackRef.current();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
