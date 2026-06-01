import React, { useEffect, useState } from "react";
import { bookmarksApi } from "@/api";
import ArticleCard from "@/components/ArticleCard";
import { SiteSEO } from "@/components/SEO";

export default function BookmarksPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookmarksApi.list().then(setItems).catch(() => setItems([])).finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SiteSEO title="Bookmarks" noindex />
      <div className="category-page-header">
        <div className="container">
          <div className="category-page-header__label">Your Library</div>
          <h1 className="category-page-header__title">Bookmarks</h1>
          <div className="category-page-header__count">
            {loading ? "Loading…" : `${items.length} ${items.length === 1 ? "story" : "stories"} saved`}
          </div>
        </div>
      </div>
      <div className="container" style={{ padding: "24px 24px 80px" }} data-testid="bookmarks-page">
        {!loading && items.length === 0 ? (
          <div className="empty-state">
            No bookmarks yet. Tap the bookmark icon on any article card to save it for later.
          </div>
        ) : (
          <div className="article-grid" data-testid="bookmarks-grid">
            {items.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
