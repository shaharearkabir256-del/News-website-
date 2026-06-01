// Reusable utility helpers

export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatLongDate(date = new Date()) {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function timeAgo(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const seconds = Math.floor((new Date() - d) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(iso);
}

export function formatViews(n) {
  if (n == null) return "";
  if (n < 1000) return `${n}`;
  if (n < 1_000_000) return `${(n / 1000).toFixed(1).replace(/\.0$/, "")}k`;
  return `${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
}

export const CATEGORY_NAMES = {
  world: "World",
  politics: "Politics",
  business: "Business",
  technology: "Technology",
  science: "Science",
  culture: "Culture",
  sports: "Sports",
};

export const ALL_CATEGORIES = [
  { slug: "all", name: "All" },
  { slug: "world", name: "World" },
  { slug: "politics", name: "Politics" },
  { slug: "business", name: "Business" },
  { slug: "technology", name: "Technology" },
  { slug: "science", name: "Science" },
  { slug: "culture", name: "Culture" },
  { slug: "sports", name: "Sports" },
];
