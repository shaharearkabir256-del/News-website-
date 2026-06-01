import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { bookmarksApi } from "@/api";
import ArticleCard from "@/components/ArticleCard";
import { SiteSEO } from "@/components/SEO";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookmarksApi.list().then(setBookmarks).catch(() => setBookmarks([])).finally(() => setLoading(false));
  }, []);

  if (!user) return null;

  const initials = (user.name || user.email)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <>
      <SiteSEO title="Profile" noindex />
      <div className="container" style={{ padding: "40px 24px 80px" }} data-testid="profile-page">
        <div className="profile-hero">
          {user.picture ? (
            <img className="profile-hero__avatar" src={user.picture} alt={user.name} />
          ) : (
            <div className="profile-hero__avatar profile-hero__avatar--initials">{initials || "?"}</div>
          )}
          <div>
            <div style={{ fontFamily: "var(--font-family-ui)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "var(--letter-spacing-section-label)", color: "var(--color-accent-primary)", fontWeight: 600 }}>
              {user.is_admin ? "Editorial Team — Admin" : "Reader"}
            </div>
            <h1 style={{ fontFamily: "var(--font-family-display)", fontSize: "var(--text-3xl)", fontWeight: 800, letterSpacing: "-0.02em", marginTop: 6 }}>
              {user.name}
            </h1>
            <div style={{ color: "var(--color-text-muted)", fontFamily: "var(--font-family-ui)" }}>{user.email}</div>
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
            <Link to="/bookmarks" className="btn btn-secondary">View bookmarks</Link>
            <button className="btn btn-primary" onClick={logout} data-testid="profile-logout">Sign out</button>
          </div>
        </div>

        <div className="section-heading" style={{ marginTop: 48 }}>
          <h2 className="section-heading__title">Recent bookmarks</h2>
          <Link to="/bookmarks" className="section-heading__link">See all</Link>
        </div>

        {loading ? (
          <div className="loader">Loading…</div>
        ) : bookmarks.length === 0 ? (
          <div className="empty-state">
            You haven't bookmarked any stories yet. Click the bookmark icon on any article to save it for later.
          </div>
        ) : (
          <div className="article-grid" style={{ marginTop: 24 }}>
            {bookmarks.slice(0, 6).map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
