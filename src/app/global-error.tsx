"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error("Global error:", error);

  return (
    <html>
      <body>
        <div style={{ padding: "2rem", textAlign: "center", fontFamily: "system-ui, sans-serif" }}>
          <h2 style={{ marginBottom: "1rem" }}>Something went wrong</h2>
          <p style={{ marginBottom: "1.5rem", color: "#666" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={() => reset()}
            style={{
              padding: "0.5rem 1rem",
              borderRadius: "0.375rem",
              border: "1px solid #ccc",
              cursor: "pointer",
              backgroundColor: "#fff",
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
