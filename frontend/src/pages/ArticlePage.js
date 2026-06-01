import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { articlesApi, commentsApi, resolveImageUrl } from "@/api";
import { formatDate, timeAgo, CATEGORY_NAMES } from "@/lib/utils";
import { IconClock, IconEye } from "@/components/Icons";
import { SiteSEO, ArticleJsonLd } from "@/components/SEO";
import BookmarkButton from "@/components/BookmarkButton";
import RelatedStories from "@/components/RelatedStories";
import { useAuth } from "@/context/AuthContext";

const COMMENTS_POLL_MS = 7000;

export default function ArticlePage() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const pollRef = useRef(null);

  // Load article + comments + related when slug changes
  useEffect(() => {
    setLoading(true);
    setArticle(null);
    setError("");
    articlesApi
      .bySlug(slug)
      .then((a) => setArticle(a))
      .catch(() => setError("Article not found."))
      .finally(() => setLoading(false));
    commentsApi.list(slug).then(setComments).catch(() => setComments([]));
    articlesApi.related(slug, 3).then(setRelated).catch(() => setRelated([]));
  }, [slug]);

  // Pre-fill author name when signed in
  useEffect(() => {
    if (user && !author) setAuthor(user.name || "");
  }, [user, author]);

  // Poll comments every 7s
  useEffect(() => {
    if (!slug) return;
    pollRef.current = setInterval(() => {
      commentsApi
        .list(slug)
        .then((list) => {
          // Only update if different length to minimize re-renders
          setComments((prev) => (prev.length === list.length && prev[0]?.id === list[0]?.id ? prev : list));
        })
        .catch(() => {});
    }, COMMENTS_POLL_MS);
    return () => clearInterval(pollRef.current);
  }, [slug]);

  // Read progress bar
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const total = el.scrollHeight - el.clientHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
      setProgress(pct);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [article]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!body.trim()) return;
    const authorName = user ? user.name : author.trim();
    if (!authorName) return;
    setSubmitting(true);
    try {
      const newC = await commentsApi.create(slug, { author_name: authorName, body: body.trim() });
      setComments((prev) => [newC, ...prev]);
      setBody("");
    } catch (err) {
      setError("Could not post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <article className="article-page">
        <div className="container">
          <div className="article-page__inner">
            <div className="skeleton" style={{ height: 14, width: 100, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 56, marginBottom: 16 }} />
            <div className="skeleton" style={{ height: 28, width: "80%", marginBottom: 32 }} />
            <div className="skeleton" style={{ height: 440, marginBottom: 24 }} />
            <div className="skeleton" style={{ height: 18, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 18, marginBottom: 8 }} />
            <div className="skeleton" style={{ height: 18, width: "95%", marginBottom: 8 }} />
          </div>
        </div>
      </article>
    );
  }

  if (error || !article) {
    return (
      <article className="article-page">
        <SiteSEO title="Article not found" noindex />
        <div className="container">
          <div className="article-page__inner">
            <h1 className="article-page__title">Article not found</h1>
            <p className="article-page__subtitle">
              The story you're looking for may have been moved or removed.
            </p>
            <Link to="/" className="btn btn-primary">Return to The Chronicle</Link>
          </div>
        </div>
      </article>
    );
  }

  const heroImageUrl = resolveImageUrl(article.image_url);

  return (
    <>
      <SiteSEO
        title={article.title}
        description={article.summary}
        image={heroImageUrl}
        type="article"
      />
      <ArticleJsonLd article={article} image={heroImageUrl} />
      <div className="read-progress" style={{ width: `${progress}%` }} />
      <article className="article-page" data-testid="article-page">
        <div className="container">
          <div className="article-page__inner">
            <div className="article-page__category-badge-wrap">
              <CategoryBadge category={article.category} />
              {(article.tags || []).map((t) => (
                <span key={t} style={{ marginLeft: 8 }}>
                  <TagBadge tag={t} />
                </span>
              ))}
            </div>

            <h1 className="article-page__title" data-testid="article-title">{article.title}</h1>
            {article.subtitle && (
              <p className="article-page__subtitle">{article.subtitle}</p>
            )}

            <div className="article-page__meta">
              {article.author_avatar ? (
                <img className="article-page__meta-avatar" src={resolveImageUrl(article.author_avatar)} alt={article.author_name} />
              ) : (
                <div className="article-page__meta-avatar" />
              )}
              <div>
                <span className="article-page__meta-author">{article.author_name}</span>
                <span className="article-page__meta-author-title">{article.author_title}</span>
              </div>
              <span className="article-page__meta-dot" />
              <span>{formatDate(article.published_at)}</span>
              <span className="article-page__meta-dot" />
              <span><IconClock /> {article.read_minutes} min read</span>
              {article.views ? (
                <>
                  <span className="article-page__meta-dot" />
                  <span><IconEye /> {article.views.toLocaleString()} views</span>
                </>
              ) : null}
              <div style={{ marginLeft: "auto" }}>
                <BookmarkButton slug={article.slug} variant="pill" />
              </div>
            </div>

            <img
              className="article-page__hero-image"
              src={heroImageUrl}
              alt={article.title}
            />
            {article.image_caption && (
              <div className="article-page__image-caption">{article.image_caption}</div>
            )}

            <div className="article-page__body" data-testid="article-body">
              {String(article.body || "")
                .split(/\n\n+/)
                .map((para, idx) => (
                  <p key={idx}>{para}</p>
                ))}
            </div>

            {(article.tags || []).length > 0 && (
              <div className="article-page__tags">
                {article.tags.map((t) => (
                  <TagBadge tag={t} key={t} />
                ))}
              </div>
            )}
          </div>
        </div>

        <RelatedStories articles={related} />

        <section className="comments-section" data-testid="comments-section">
          <h2 className="comments-section__title">
            Comments ({comments.length})
          </h2>

          <form className="comment-form" onSubmit={handleSubmit}>
            {!user && (
              <div className="comment-form__row">
                <label className="comment-form__label" htmlFor="c-author">Your name</label>
                <input
                  id="c-author"
                  className="comment-form__input"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={60}
                  required
                  data-testid="comment-author"
                />
              </div>
            )}
            {user && (
              <div className="comment-form__row" style={{ display: "flex", alignItems: "center", gap: 10 }}>
                {user.picture ? (
                  <img src={user.picture} alt="" style={{ width: 28, height: 28, borderRadius: "50%" }} />
                ) : null}
                <span style={{ fontFamily: "var(--font-family-ui)", fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
                  Commenting as <strong style={{ color: "var(--color-text-primary)" }}>{user.name}</strong>
                </span>
              </div>
            )}
            <div className="comment-form__row">
              <label className="comment-form__label" htmlFor="c-body">Your comment</label>
              <textarea
                id="c-body"
                className="comment-form__textarea"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                maxLength={1200}
                required
                data-testid="comment-body"
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
              data-testid="comment-submit"
            >
              {submitting ? "Posting…" : "Post Comment"}
            </button>
          </form>

          {comments.length === 0 ? (
            <div className="empty-state">No comments yet. Be the first.</div>
          ) : (
            <div className="comment-list">
              {comments.map((c) => (
                <div className={`comment ${c.is_hidden ? "comment--hidden" : ""}`} key={c.id} data-testid="comment-item">
                  <div className="comment__head">
                    {c.user_picture ? (
                      <img className="comment__avatar comment__avatar--img" src={c.user_picture} alt="" />
                    ) : (
                      <div className="comment__avatar">
                        {String(c.author_name || "?").charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="comment__author">{c.author_name}</div>
                    <div className="comment__date">{timeAgo(c.created_at)}</div>
                    {c.is_hidden && (
                      <span style={{ marginLeft: 8, fontSize: "var(--text-xs)", color: "var(--color-text-muted)" }}>
                        (hidden by moderator)
                      </span>
                    )}
                  </div>
                  <div className="comment__body">{c.body}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </article>
    </>
  );
}
