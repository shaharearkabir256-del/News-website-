import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function RequireAuth({ children, admin = false }) {
  const { user, loading, login } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "var(--font-family-ui)",
          color: "var(--color-text-muted)",
          letterSpacing: "var(--letter-spacing-section-label)",
          textTransform: "uppercase",
          fontSize: "var(--text-xs)",
        }}
      >
        Checking session…
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: "96px 24px", textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-family-ui)",
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "var(--letter-spacing-section-label)",
            color: "var(--color-accent-primary)",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          Sign in required
        </div>
        <h1
          style={{
            fontFamily: "var(--font-family-display)",
            fontSize: "var(--text-3xl)",
            fontWeight: 800,
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}
        >
          Continue with Google
        </h1>
        <p style={{ marginBottom: 24, color: "var(--color-text-secondary)" }}>
          {admin
            ? "This area is restricted to The Chronicle editorial team."
            : "Sign in to bookmark stories and join the conversation."}
        </p>
        <button className="btn btn-primary" onClick={login} data-testid="signin-google-btn">
          Sign in with Google
        </button>
      </div>
    );
  }

  if (admin && !user.is_admin) {
    return (
      <div className="container" style={{ padding: "96px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--text-3xl)", fontWeight: 800, marginBottom: 12 }}>
          Editorial access only
        </h1>
        <p style={{ color: "var(--color-text-secondary)", marginBottom: 24 }}>
          You're signed in as {user.email}, but this area is reserved for The Chronicle's editorial team.
        </p>
        <Navigate to="/" replace state={{ from: location }} />
      </div>
    );
  }

  return children;
}
