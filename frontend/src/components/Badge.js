import React from "react";
import { CATEGORY_NAMES } from "@/lib/utils";

export function CategoryBadge({ category }) {
  if (!category) return null;
  const cat = String(category).toLowerCase();
  return (
    <span className={`badge category-badge category-badge--${cat}`}>
      {CATEGORY_NAMES[cat] || cat}
    </span>
  );
}

export function TagBadge({ tag }) {
  if (!tag) return null;
  const t = String(tag).toLowerCase();
  const known = ["breaking", "live", "sponsored", "opinion", "exclusive", "analysis"];
  const cls = known.includes(t) ? `tag-badge--${t}` : "";
  return <span className={`badge tag-badge ${cls}`}>{t}</span>;
}
