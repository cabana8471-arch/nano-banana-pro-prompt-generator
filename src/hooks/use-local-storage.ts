"use client";

import { useState, useCallback, useRef, useEffect } from "react";

/**
 * Read a value from localStorage (SSR-safe).
 * Returns undefined if not available (server-side or parse error).
 */
function readFromStorage<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    const item = localStorage.getItem(key);
    if (item !== null) {
      return JSON.parse(item) as T;
    }
  } catch {
    // Ignore parse errors
  }
  return undefined;
}

/**
 * Hook to persist state in localStorage with debounced writes.
 * Returns [storedValue, setValue, clearValue] where:
 * - storedValue: value from localStorage (or undefined during SSR)
 * - setValue: updates both state and localStorage (debounced)
 * - clearValue: removes the key from localStorage and resets to initialValue
 */
export function useLocalStorage<T>(
  key: string,
  _initialValue: T,
  debounceMs = 1000
): [T | undefined, (value: T) => void, () => void] {
  // Use lazy initializer to read from localStorage on first render (client only).
  // During SSR, returns undefined.
  const [storedValue, setStoredValue] = useState<T | undefined>(() => {
    const stored = readFromStorage<T>(key);
    return stored !== undefined ? stored : undefined;
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Debounced save to localStorage
  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(() => {
        try {
          localStorage.setItem(key, JSON.stringify(value));
        } catch {
          // Ignore quota errors
        }
      }, debounceMs);
    },
    [key, debounceMs]
  );

  // Clear from localStorage
  const clearValue = useCallback(() => {
    setStoredValue(undefined);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    try {
      localStorage.removeItem(key);
    } catch {
      // Ignore errors
    }
  }, [key]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  return [storedValue, setValue, clearValue];
}
