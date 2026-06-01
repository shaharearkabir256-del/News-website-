import React from "react";
import { Link } from "react-router-dom";
import { IconVideo, IconPlay } from "@/components/Icons";
import { timeAgo, formatViews } from "@/lib/utils";
import { resolveImageUrl } from "@/api";

export default function VideoSection({ articles = [] }) {
  if (!articles || articles.length === 0) return null;
  return (
    <section className="video-section" data-testid="video-section">
      <div className="container">
        <div className="video-section__title">
          <IconVideo /> Video Stories
        </div>

        <div className="video-grid">
          {articles.slice(0, 2).map((a) => (
            <Link to={`/article/${a.slug}`} key={a.id} className="video-card" data-testid={`video-card-${a.slug}`}>
              <div className="video-card__thumb">
                <img src={resolveImageUrl(a.image_url)} alt={a.title} loading="lazy" />
                <div className="video-card__play" aria-hidden="true">
                  <IconPlay />
                </div>
                {a.video_duration ? (
                  <span className="video-card__duration">{a.video_duration}</span>
                ) : null}
              </div>
              <div className="video-card__body">
                <div className="video-card__title">{a.title}</div>
                <div className="video-card__meta">
                  {a.author_name} · {timeAgo(a.published_at)} {a.views ? `· ${formatViews(a.views)} views` : ""}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
