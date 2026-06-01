import React from "react";
import { ALL_CATEGORIES } from "@/lib/utils";

export default function CategoryTabs({ active = "all", onChange }) {
  return (
    <div className="category-tabs-wrap" data-testid="category-tabs">
      <div className="container">
        <div className="category-tabs">
          {ALL_CATEGORIES.map((c) => (
            <button
              key={c.slug}
              type="button"
              className={`category-tab ${active === c.slug ? "category-tab--active" : ""}`}
              onClick={() => onChange && onChange(c.slug)}
              data-testid={`category-tab-${c.slug}`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
