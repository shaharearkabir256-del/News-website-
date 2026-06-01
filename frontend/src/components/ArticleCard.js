import React from "react";
import { Link } from "react-router-dom";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { timeAgo } from "@/lib/utils";
import { IconClock } from "@/components/Icons";

export default function ArticleCard({ article }) {
  if (!article) return null;
  return (
    <Link to={`/article/${article.slug}`} className="article-card" data-testid={`article-card-${article.slug}`}>
      <div className="article-card__image">
        <img src={article.image_url} alt={article.title} loading="lazy" />
      </div>
      <div className="article-card__body">
        <div className="article-card__badges">
          <CategoryBadge category={article.category} />
          {(article.tags || []).slice(0, 2).map((t) => (
            <TagBadge key={t} tag={t} />
          ))}
        </div>
        <h3 className="article-card__title">{article.title}</h3>
        <p className="article-card__summary">{article.summary}</p>
        <div className="article-card__footer">
          {article.author_avatar ? (
            <img className="article-card__avatar" src={article.author_avatar} alt={article.author_name} />
          ) : (
            <div className="article-card__avatar" />
          )}
          <span className="article-card__author">{article.author_name}</span>
          <span className="article-card__dot" />
          <span><IconClock /> {article.read_minutes} min</span>
          <span className="article-card__dot" />
          <span>{timeAgo(article.published_at)}</span>
        </div>
      </div>
    </Link>
  );
}
