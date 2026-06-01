import React, { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return;
    // No backend storage by design; client-side only success message
    setDone(true);
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
          {done ? (
            <div className="newsletter__success" data-testid="newsletter-success">
              Thank you. Look for our next briefing in your inbox.
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
              <button type="submit" className="newsletter__submit" data-testid="newsletter-submit">
                Subscribe
              </button>
            </form>
          )}
          <div className="newsletter__privacy">
            We respect your privacy. Unsubscribe at any time. By signing up you agree to our terms.
          </div>
        </div>
      </div>
    </section>
  );
}
