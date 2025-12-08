"use client";

import { useState, useCallback } from "react";
import type { LogoBuilderState } from "@/lib/types/logo";

interface HistoryEntry {
  state: LogoBuilderState;
  timestamp: number;
  action: string; // Description of what changed
}

interface UseLogoHistoryReturn {
  // History state
  canUndo: boolean;
  canRedo: boolean;
  historyLength: number;
  currentIndex: number;

  // Actions
  pushState: (state: LogoBuilderState, action: string) => void;
  undo: () => LogoBuilderState | null;
  redo: () => LogoBuilderState | null;
  clearHistory: () => void;

  // Get history for display
  getRecentHistory: (count?: number) => { action: string; timestamp: number }[];
}

const MAX_HISTORY_SIZE = 50;

export function useLogoHistory(initialState: LogoBuilderState): UseLogoHistoryReturn {
  // Store history as state to trigger re-renders when needed
  const [history, setHistory] = useState<HistoryEntry[]>(() => [
    {
      state: initialState,
      timestamp: Date.now(),
      action: "Initial state",
    },
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const pushState = useCallback(
    (state: LogoBuilderState, action: string) => {
      setHistory((prevHistory) => {
        // If we're not at the end of history, truncate future states
        const truncatedHistory =
          currentIndex < prevHistory.length - 1
            ? prevHistory.slice(0, currentIndex + 1)
            : prevHistory;

        // Add new state
        const newHistory = [
          ...truncatedHistory,
          {
            state: JSON.parse(JSON.stringify(state)), // Deep clone
            timestamp: Date.now(),
            action,
          },
        ];

        // Trim history if too long
        if (newHistory.length > MAX_HISTORY_SIZE) {
          return newHistory.slice(-MAX_HISTORY_SIZE);
        }

        return newHistory;
      });

      setCurrentIndex((prev) => {
        // Calculate new index based on truncated history
        return Math.min(prev + 1, MAX_HISTORY_SIZE - 1);
      });
    },
    [currentIndex]
  );

  const undo = useCallback((): LogoBuilderState | null => {
    if (currentIndex <= 0) return null;

    const newIndex = currentIndex - 1;
    setCurrentIndex(newIndex);

    const entry = history[newIndex];
    return entry ? JSON.parse(JSON.stringify(entry.state)) : null;
  }, [currentIndex, history]);

  const redo = useCallback((): LogoBuilderState | null => {
    if (currentIndex >= history.length - 1) return null;

    const newIndex = currentIndex + 1;
    setCurrentIndex(newIndex);

    const entry = history[newIndex];
    return entry ? JSON.parse(JSON.stringify(entry.state)) : null;
  }, [currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory((prevHistory) => {
      const currentEntry = prevHistory[currentIndex];
      return currentEntry ? [currentEntry] : [];
    });
    setCurrentIndex(0);
  }, [currentIndex]);

  const getRecentHistory = useCallback(
    (count = 10): { action: string; timestamp: number }[] => {
      const start = Math.max(0, history.length - count);
      return history.slice(start).map((entry) => ({
        action: entry.action,
        timestamp: entry.timestamp,
      }));
    },
    [history]
  );

  return {
    canUndo: currentIndex > 0,
    canRedo: currentIndex < history.length - 1,
    historyLength: history.length,
    currentIndex,
    pushState,
    undo,
    redo,
    clearHistory,
    getRecentHistory,
  };
}
