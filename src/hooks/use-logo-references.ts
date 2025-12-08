"use client";

import { useState, useCallback, useEffect } from "react";
import type {
  LogoReference,
  CreateLogoReferenceInput,
  UpdateLogoReferenceInput,
} from "@/lib/types/logo";

interface UseLogoReferencesReturn {
  logoReferences: LogoReference[];
  isLoading: boolean;
  error: string | null;
  fetchLogoReferences: () => Promise<void>;
  createLogoReference: (
    input: CreateLogoReferenceInput,
    image: File
  ) => Promise<LogoReference | null>;
  updateLogoReference: (
    id: string,
    input: UpdateLogoReferenceInput
  ) => Promise<LogoReference | null>;
  deleteLogoReference: (id: string) => Promise<boolean>;
  getLogoReferenceById: (id: string) => LogoReference | undefined;
}

export function useLogoReferences(): UseLogoReferencesReturn {
  const [logoReferences, setLogoReferences] = useState<LogoReference[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLogoReferences = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/logo-references");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch logo references");
      }

      setLogoReferences(data.logoReferences);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch logo references";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createLogoReference = useCallback(
    async (input: CreateLogoReferenceInput, image: File): Promise<LogoReference | null> => {
      try {
        setError(null);

        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("referenceType", input.referenceType);
        formData.append("image", image);
        if (input.description) {
          formData.append("description", input.description);
        }

        const response = await fetch("/api/logo-references", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to create logo reference");
        }

        // Add the new logo reference to the list
        setLogoReferences((prev) => [data.logoReference, ...prev]);
        return data.logoReference;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to create logo reference";
        setError(message);
        return null;
      }
    },
    []
  );

  const updateLogoReference = useCallback(
    async (id: string, input: UpdateLogoReferenceInput): Promise<LogoReference | null> => {
      try {
        setError(null);

        const response = await fetch(`/api/logo-references/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to update logo reference");
        }

        // Update the logo reference in the list
        setLogoReferences((prev) =>
          prev.map((ref) => (ref.id === id ? data.logoReference : ref))
        );
        return data.logoReference;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to update logo reference";
        setError(message);
        return null;
      }
    },
    []
  );

  const deleteLogoReference = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null);

      const response = await fetch(`/api/logo-references/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete logo reference");
      }

      // Remove the logo reference from the list
      setLogoReferences((prev) => prev.filter((ref) => ref.id !== id));
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete logo reference";
      setError(message);
      return false;
    }
  }, []);

  const getLogoReferenceById = useCallback(
    (id: string): LogoReference | undefined => {
      return logoReferences.find((ref) => ref.id === id);
    },
    [logoReferences]
  );

  // Fetch logo references on mount
  useEffect(() => {
    fetchLogoReferences();
  }, [fetchLogoReferences]);

  return {
    logoReferences,
    isLoading,
    error,
    fetchLogoReferences,
    createLogoReference,
    updateLogoReference,
    deleteLogoReference,
    getLogoReferenceById,
  };
}
