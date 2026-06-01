// Centralized SEO helper using react-helmet-async. Renders <title>, OG, Twitter, JSON-LD.
import React from "react";
import { Helmet } from "react-helmet-async";

const SITE_NAME = "The Chronicle";
const SITE_TAGLINE = "Truth. Clarity. Impact.";
const DEFAULT_DESC =
  "The Chronicle is an independent newsroom committed to original reporting and careful analysis. World, politics, business, technology, science, culture, and sports.";

export function SiteSEO({
  title,
  description = DEFAULT_DESC,
  image,
  url,
  type = "website",
  noindex = false,
}) {
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const canonical = url || (typeof window !== "undefined" ? window.location.href : "");
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex,nofollow" />}
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {canonical && <meta property="og:url" content={canonical} />}
      {image && <meta property="og:image" content={image} />}

      {/* Twitter */}
      <meta name="twitter:card" content={image ? "summary_large_image" : "summary"} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
    </Helmet>
  );
}

export function ArticleJsonLd({ article, url, image }) {
  if (!article) return null;
  const data = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.summary,
    image: image ? [image] : undefined,
    datePublished: article.published_at,
    dateModified: article.published_at,
    author: [
      {
        "@type": "Person",
        name: article.author_name,
      },
    ],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      logo: {
        "@type": "ImageObject",
        url: typeof window !== "undefined" ? `${window.location.origin}/favicon.ico` : "",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url || (typeof window !== "undefined" ? window.location.href : ""),
    },
    articleSection: article.category,
    keywords: (article.tags || []).join(", "),
    wordCount: (article.body || "").split(/\s+/).length,
  };
  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Helmet>
  );
}
