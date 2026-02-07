"use client";

import { useState, useCallback } from "react";
import type { GenerationType } from "@/lib/types/generation";

const MAX_HISTORY = 20;
const STORAGE_KEY = "nano-banana:prompt-history";

export interface PromptHistoryEntry {
  prompt: string;
  generationType: GenerationType;
  timestamp: number;
}

interface UsePromptHistoryReturn {
  history: PromptHistoryEntry[];
  addEntry: (prompt: string, generationType: GenerationType) => void;
  removeEntry: (timestamp: number) => void;
  clearHistory: () => void;
}

export function usePromptHistory(): UsePromptHistoryReturn {
  const [history, setHistory] = useState<PromptHistoryEntry[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? (JSON.parse(stored) as PromptHistoryEntry[]) : [];
    } catch {
      return [];
    }
  });

  const persist = useCallback((entries: PromptHistoryEntry[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const addEntry = useCallback(
    (prompt: string, generationType: GenerationType) => {
      if (!prompt.trim()) return;

      setHistory((prev) => {
        // Remove duplicate (same prompt text)
        const filtered = prev.filter((e) => e.prompt !== prompt);
        const newEntry: PromptHistoryEntry = {
          prompt,
          generationType,
          timestamp: Date.now(),
        };
        // Prepend and limit to MAX_HISTORY
        const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const removeEntry = useCallback(
    (timestamp: number) => {
      setHistory((prev) => {
        const updated = prev.filter((e) => e.timestamp !== timestamp);
        persist(updated);
        return updated;
      });
    },
    [persist]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }, []);

  return { history, addEntry, removeEntry, clearHistory };
}
