"use client";

import { useState, useCallback } from "react";

/**
 * Hook for browser notifications.
 * Only sends notifications when the tab is not visible.
 */
export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      return Notification.permission;
    }
    return "default";
  });

  const requestPermission = useCallback(async () => {
    if (!("Notification" in window)) return "denied" as NotificationPermission;
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const notify = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== "granted") return;
      if (!document.hidden) return;
      try {
        new Notification(title, options);
      } catch {
        // Ignore errors (e.g., in unsupported contexts)
      }
    },
    [permission]
  );

  const isSupported = typeof window !== "undefined" && "Notification" in window;

  return { permission, requestPermission, notify, isSupported };
}
