import React from "react";
import { Link } from "react-router-dom";
import { IconArrow } from "@/components/Icons";

export default function OpinionSection({ articles = [] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="opinion-section" data-testid="opinion-section">
      <div className="container">
        <div className="opinion-section__header">
          <div className="opinion-section__label">Opinion &amp; Analysis</div>
          <h2 className="opinion-section__title">The Editorial Voice</h2>
        </div>

        <div className="opinion-grid">
          {articles.map((a) => (
            <Link
              key={a.id}
              to={`/article/${a.slug}`}
              className={`opinion-card opinion-card--${(a.category || "").toLowerCase()}`}
              data-testid={`opinion-card-${a.slug}`}
            >
              <div className="opinion-card__quote-mark">“</div>
              <p className="opinion-card__quote">
                {a.opinion_quote || a.summary}
              </p>
              <div className="opinion-card__author">
                {a.author_avatar ? (
                  <img className="opinion-card__author-avatar" src={a.author_avatar} alt={a.author_name} />
                ) : (
                  <div className="opinion-card__author-avatar" />
                )}
                <div>
                  <div className="opinion-card__author-name">{a.author_name}</div>
                  <div className="opinion-card__author-title">{a.author_title}</div>
                </div>
              </div>
              <div className="opinion-card__read">
                Read Column <IconArrow size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
