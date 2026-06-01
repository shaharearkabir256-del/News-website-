import React from "react";
import { Link } from "react-router-dom";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { timeAgo, formatViews } from "@/lib/utils";
import { IconClock, IconEye } from "@/components/Icons";

export default function Hero({ articles = [] }) {
  if (!articles || articles.length === 0) {
    return (
      <section className="hero" aria-label="Top stories">
        <div className="container">
          <div className="hero__grid">
            <div className="hero__featured skeleton" style={{ minHeight: 540 }} />
            <div className="hero__secondary">
              {[0, 1, 2].map((i) => (
                <div key={i} className="hero__secondary-item">
                  <div className="skeleton" style={{ width: 140, height: 100, borderRadius: 4 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 14, width: "40%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 18, width: "100%", marginBottom: 6 }} />
                    <div className="skeleton" style={{ height: 18, width: "80%" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  const featured = articles[0];
  const secondary = articles.slice(1, 4);

  return (
    <section className="hero" aria-label="Top stories">
      <div className="container">
        <div className="hero__grid">
          <Link to={`/article/${featured.slug}`} className="hero__featured" data-testid="hero-featured">
            <img
              src={featured.image_url}
              alt={featured.title}
              className="hero__featured-image"
              loading="eager"
            />
            <div className="hero__featured-overlay" />
            <div className="hero__featured-content">
              <div className="hero__featured-badges">
                <CategoryBadge category={featured.category} />
                {(featured.tags || []).slice(0, 2).map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
              <h1 className="hero__featured-title">{featured.title}</h1>
              <p className="hero__featured-subtitle">{featured.subtitle || featured.summary}</p>
              <div className="hero__featured-meta">
                <span className="hero__featured-meta-author">{featured.author_name}</span>
                <span className="hero__featured-meta-dot" />
                <span><IconClock size={12} /> {featured.read_minutes} min read</span>
                <span className="hero__featured-meta-dot" />
                <span>{timeAgo(featured.published_at)}</span>
                {featured.views ? (
                  <>
                    <span className="hero__featured-meta-dot" />
                    <span><IconEye size={12} /> {formatViews(featured.views)}</span>
                  </>
                ) : null}
              </div>
            </div>
          </Link>

          <div className="hero__secondary">
            {secondary.map((a) => (
              <Link to={`/article/${a.slug}`} className="hero__secondary-item" key={a.id} data-testid={`hero-secondary-${a.slug}`}>
                <div className="hero__secondary-image">
                  <img src={a.image_url} alt={a.title} loading="lazy" />
                </div>
                <div className="hero__secondary-content">
                  <div className="hero__secondary-badges">
                    <CategoryBadge category={a.category} />
                    {(a.tags || []).slice(0, 1).map((t) => (
                      <TagBadge key={t} tag={t} />
                    ))}
                  </div>
                  <h3 className="hero__secondary-title">{a.title}</h3>
                  <div className="hero__secondary-meta">
                    <span>{a.author_name}</span>
                    <span className="hero__featured-meta-dot" />
                    <span>{timeAgo(a.published_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
