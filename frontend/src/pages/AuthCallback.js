import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "@/api";
import { useAuth } from "@/context/AuthContext";

/**
 * AuthCallback — picks up #session_id=... from the URL hash, exchanges it for a session_token,
 * then redirects to /profile.
 *
 * Rendered synchronously (during render, not useEffect) by AppRouter when hash contains session_id.
 */
export default function AuthCallback() {
  const hasProcessed = useRef(false);
  const navigate = useNavigate();
  const { refresh, refreshBookmarks } = useAuth();
  const [error, setError] = useState("");

  useEffect(() => {
    // Use useRef (not useState) to prevent re-entry under StrictMode.
    if (hasProcessed.current) return;
    hasProcessed.current = true;

    (async () => {
      try {
        const hash = window.location.hash || "";
        const params = new URLSearchParams(hash.replace(/^#/, ""));
        const session_id = params.get("session_id");
        if (!session_id) {
          setError("Missing session_id in URL.");
          return;
        }
        await authApi.exchangeSession(session_id);
        await refresh();
        await refreshBookmarks();

        // Clear the hash so a refresh doesn't re-process
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate("/profile", { replace: true });
      } catch (e) {
        setError("Could not sign you in. Please try again.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bg-base)",
        flexDirection: "column",
        gap: 12,
        fontFamily: "var(--font-family-ui)",
        color: "var(--color-text-secondary)",
      }}
    >
      <div
        style={{
          fontSize: "var(--text-xs)",
          textTransform: "uppercase",
          letterSpacing: "var(--letter-spacing-section-label)",
          color: "var(--color-accent-primary)",
          fontWeight: 600,
        }}
      >
        The Chronicle
      </div>
      <div style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--text-xl)", color: "var(--color-text-primary)" }}>
        {error || "Signing you in…"}
      </div>
    </div>
  );
}
