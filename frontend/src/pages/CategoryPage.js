import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CategoryTabs from "@/components/CategoryTabs";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import { articlesApi } from "@/api";
import { CATEGORY_NAMES } from "@/lib/utils";
import { SiteSEO } from "@/components/SEO";

export default function CategoryPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      articlesApi.list({ category: slug, limit: 100 }),
      articlesApi.trending(),
    ])
      .then(([list, t]) => {
        setArticles(list || []);
        setTrending(t || []);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleCategoryChange = (newSlug) => {
    if (newSlug === "all") navigate("/");
    else navigate(`/category/${newSlug}`);
  };

  const name = CATEGORY_NAMES[slug] || slug;

  return (
    <>
      <SiteSEO
        title={name}
        description={`The latest ${name} stories from The Chronicle.`}
      />
      <div className="category-page-header" data-testid="category-page-header">
        <div className="container">
          <div className="category-page-header__label">Section</div>
          <h1 className="category-page-header__title">{name}</h1>
          <div className="category-page-header__count">
            {loading ? "Loading…" : `${articles.length} ${articles.length === 1 ? "story" : "stories"}`}
          </div>
        </div>
      </div>

      <CategoryTabs active={slug} onChange={handleCategoryChange} />

      <section className="main-layout container">
        <div>
          {articles.length === 0 && !loading ? (
            <div className="empty-state">No stories yet in this section.</div>
          ) : (
            <div className="article-grid" data-testid="category-article-grid">
              {articles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
        <TrendingSidebar articles={trending} />
      </section>
    </>
  );
}
