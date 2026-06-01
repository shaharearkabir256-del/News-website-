import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ArticleCard from "@/components/ArticleCard";
import { articlesApi } from "@/api";
import { SiteSEO } from "@/components/SEO";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const q = params.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    setQuery(q);
    if (!q) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    articlesApi
      .list({ search: q, limit: 100 })
      .then(setResults)
      .catch(() => setResults([]))
      .finally(() => setLoading(false));
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const term = query.trim();
    if (!term) return;
    setParams({ q: term });
  };

  return (
    <>
      <SiteSEO title={q ? `Search: ${q}` : "Search"} noindex />
      <section className="search-hero">
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div
              style={{
                fontFamily: "var(--font-family-ui)",
                fontSize: "var(--text-xs)",
                letterSpacing: "var(--letter-spacing-section-label)",
                textTransform: "uppercase",
                color: "var(--color-accent-primary)",
                fontWeight: 600,
                marginBottom: 12,
              }}
            >
              Search
            </div>
            <h1
              style={{
                fontFamily: "var(--font-family-display)",
                fontSize: "var(--text-3xl)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: 24,
              }}
            >
              Find a story in The Chronicle
            </h1>
          </div>
          <form className="search-form" onSubmit={handleSubmit}>
            <input
              className="search-form__input"
              placeholder="Search headlines, authors, topics…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
              data-testid="search-input"
            />
            <button type="submit" className="btn btn-primary" data-testid="search-submit">
              Search
            </button>
          </form>
        </div>
      </section>

      <div className="container search-results">
        {searched && (
          <>
            <h2 className="search-results__heading">
              {loading ? "Searching…" : `Results for "${q}"`}
            </h2>
            <div className="search-results__count">
              {loading ? "" : `${results.length} ${results.length === 1 ? "story" : "stories"} found`}
            </div>
            {results.length === 0 && !loading ? (
              <div className="empty-state">No matching stories. Try a different keyword.</div>
            ) : (
              <div className="article-grid" data-testid="search-results">
                {results.map((a) => (
                  <ArticleCard key={a.id} article={a} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
