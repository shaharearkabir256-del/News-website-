import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Hero from "@/components/Hero";
import CategoryTabs from "@/components/CategoryTabs";
import ArticleCard from "@/components/ArticleCard";
import TrendingSidebar from "@/components/TrendingSidebar";
import OpinionSection from "@/components/OpinionSection";
import VideoSection from "@/components/VideoSection";
import NewsletterSignup from "@/components/NewsletterSignup";
import { articlesApi } from "@/api";

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [opinion, setOpinion] = useState([]);
  const [videos, setVideos] = useState([]);
  const [all, setAll] = useState([]);
  const [active, setActive] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      articlesApi.featured(),
      articlesApi.trending(),
      articlesApi.opinion(),
      articlesApi.videos(),
      articlesApi.list({ limit: 50 }),
    ])
      .then(([f, t, o, v, list]) => {
        if (cancelled) return;
        setFeatured(f || []);
        setTrending(t || []);
        setOpinion(o || []);
        setVideos(v || []);
        setAll(list || []);
      })
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  const handleCategoryChange = (slug) => {
    if (slug === "all") {
      setActive("all");
      return;
    }
    navigate(`/category/${slug}`);
  };

  const gridArticles = useMemo(() => {
    // Exclude opinion + video + the very top featured story to avoid duplicating the hero.
    const heroIds = new Set((featured[0] ? [featured[0].id] : []));
    return all.filter(
      (a) => !a.is_opinion && !a.is_video && !heroIds.has(a.id)
    );
  }, [all, featured]);

  return (
    <>
      <Hero articles={featured} />
      <CategoryTabs active={active} onChange={handleCategoryChange} />

      <section className="main-layout container" data-testid="homepage-main">
        <div>
          <div className="section-heading">
            <h2 className="section-heading__title">Latest Stories</h2>
            <span className="section-heading__link">All articles</span>
          </div>

          {loading && gridArticles.length === 0 ? (
            <div className="article-grid" aria-busy="true">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="article-card">
                  <div className="skeleton" style={{ paddingTop: "60%" }} />
                  <div className="article-card__body">
                    <div className="skeleton" style={{ height: 18, width: "40%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 22, marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 22, width: "80%", marginBottom: 12 }} />
                    <div className="skeleton" style={{ height: 14 }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="article-grid" data-testid="home-article-grid">
              {gridArticles.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>

        <TrendingSidebar articles={trending} />
      </section>

      <OpinionSection articles={opinion} />
      <VideoSection articles={videos} />
      <NewsletterSignup />
    </>
  );
}
