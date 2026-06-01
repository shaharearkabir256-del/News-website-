import React, { useEffect, useState } from "react";
import { tickerApi } from "@/api";

export default function BreakingTicker() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    tickerApi.list().then(setItems).catch(() => setItems([]));
  }, []);

  if (!items || items.length === 0) return null;

  // duplicate items for seamless loop
  const doubled = [...items, ...items];

  return (
    <div className="breaking-ticker" data-testid="breaking-ticker">
      <div className="breaking-ticker__label">
        <span className="breaking-ticker__pulse" />
        BREAKING
      </div>
      <div className="breaking-ticker__track">
        {doubled.map((item, idx) => (
          <span className="breaking-ticker__item" key={`${item.id || idx}-${idx}`}>
            {item.text}
          </span>
        ))}
      </div>
    </div>
  );
}
