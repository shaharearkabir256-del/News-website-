import React from "react";
import { Link } from "react-router-dom";
import { CategoryBadge } from "@/components/Badge";
import { resolveImageUrl } from "@/api";
import { IconClock } from "@/components/Icons";

function safeTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function RelatedStories({ articles = [] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="related-section" data-testid="related-section">
      <div className="container" style={{ maxWidth: 1100 }}>
        <div className="section-heading">
          <h2 className="section-heading__title">More from this section</h2>
        </div>
        <div className="related-grid">
          {articles.map((a) => (
            <Link to={`/article/${a.slug}`} key={a.id} className="related-card" data-testid={`related-${a.slug}`}>
              <div className="related-card__image">
                <img src={resolveImageUrl(a.image_url)} alt={a.title} loading="lazy" />
              </div>
              <div className="related-card__body">
                <CategoryBadge category={a.category} />
                <h3 className="related-card__title">{a.title}</h3>
                <div className="related-card__meta">
                  <span>{a.author_name}</span>
                  <span className="article-card__dot" />
                  <IconClock />
                  <span>{a.read_minutes} min</span>
                  <span className="article-card__dot" />
                  <span>{safeTime(a.published_at)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
