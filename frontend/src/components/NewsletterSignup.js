import React, { useState } from "react";
import { newsletterApi } from "@/api";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState({ status: "idle", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setState({ status: "error", message: "Please enter a valid email." });
      return;
    }
    setState({ status: "loading", message: "" });
    try {
      const res = await newsletterApi.subscribe(email);
      if (res.already_subscribed) {
        setState({ status: "success", message: "You're already subscribed. Thank you." });
      } else {
        setState({ status: "success", message: "Thank you. Look for our next briefing in your inbox." });
      }
      setEmail("");
    } catch (err) {
      setState({ status: "error", message: "Could not subscribe. Please try again." });
    }
  };

  return (
    <section className="newsletter" id="subscribe" data-testid="newsletter-section">
      <div className="container">
        <div className="newsletter__inner">
          <div className="newsletter__label">The Morning Briefing</div>
          <h2 className="newsletter__title">
            The day's most important stories, written by editors you trust.
          </h2>
          <p className="newsletter__subtitle">
            Join 1.4 million readers who start their day with The Chronicle. No noise. No clickbait. Just journalism.
          </p>
          {state.status === "success" ? (
            <div className="newsletter__success" data-testid="newsletter-success">
              {state.message}
            </div>
          ) : (
            <form className="newsletter__form" onSubmit={handleSubmit}>
              <input
                type="email"
                className="newsletter__input"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email address"
                required
                data-testid="newsletter-email"
              />
              <button
                type="submit"
                className="newsletter__submit"
                disabled={state.status === "loading"}
                data-testid="newsletter-submit"
              >
                {state.status === "loading" ? "Subscribing…" : "Subscribe"}
              </button>
            </form>
          )}
          {state.status === "error" && (
            <div
              style={{
                marginTop: 12,
                color: "#FCA5A5",
                fontFamily: "var(--font-family-ui)",
                fontSize: "var(--text-sm)",
              }}
            >
              {state.message}
            </div>
          )}
          <div className="newsletter__privacy">
            We respect your privacy. Unsubscribe at any time. By signing up you agree to our terms.
          </div>
        </div>
      </div>
    </section>
  );
}
