import React from "react";
import { Link } from "react-router-dom";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { timeAgo, formatViews } from "@/lib/utils";
import { IconFlame, IconEye } from "@/components/Icons";

export default function TrendingSidebar({ articles = [] }) {
  return (
    <aside className="sidebar" data-testid="trending-sidebar">
      <div className="trending-block">
        <div className="trending-block__title">
          <IconFlame /> Trending Now
        </div>

        {articles.length === 0 && (
          <>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="trending-item">
                <div className="trending-item__number">{String(i).padStart(2, "0")}</div>
                <div className="trending-item__content">
                  <div className="skeleton" style={{ height: 14, width: "95%", marginBottom: 6 }} />
                  <div className="skeleton" style={{ height: 12, width: "60%" }} />
                </div>
              </div>
            ))}
          </>
        )}

        {articles.map((a, idx) => (
          <Link to={`/article/${a.slug}`} key={a.id} className="trending-item" data-testid={`trending-${idx + 1}`}>
            <div className="trending-item__number">{String(idx + 1).padStart(2, "0")}</div>
            <div className="trending-item__content">
              <div className="trending-item__badges">
                <CategoryBadge category={a.category} />
                {(a.tags || []).slice(0, 1).map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
              <h4 className="trending-item__title">{a.title}</h4>
              <div className="trending-item__meta">
                <span>{timeAgo(a.published_at)}</span>
                {a.views ? <> &middot; <IconEye /> {formatViews(a.views)}</> : null}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="ad-placeholder">Advertisement &middot; 300 × 250</div>

      <div className="trending-block">
        <div className="trending-block__title">Editor's Picks</div>
        {articles.slice(0, 3).map((a) => (
          <Link to={`/article/${a.slug}`} key={`editor-${a.id}`} className="trending-item" style={{ paddingTop: 16 }}>
            <div className="trending-item__content">
              <div className="trending-item__badges">
                <CategoryBadge category={a.category} />
              </div>
              <h4 className="trending-item__title">{a.title}</h4>
            </div>
          </Link>
        ))}
      </div>
    </aside>
  );
}
