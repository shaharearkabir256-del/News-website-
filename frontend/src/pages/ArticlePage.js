import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { articlesApi, commentsApi } from "@/api";
import { formatDate, timeAgo } from "@/lib/utils";
import { IconClock, IconEye } from "@/components/Icons";

export default function ArticlePage() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [author, setAuthor] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setArticle(null);
    setError("");
    articlesApi
      .bySlug(slug)
      .then((a) => setArticle(a))
      .catch(() => setError("Article not found."))
      .finally(() => setLoading(false));
    commentsApi
      .list(slug)
      .then(setComments)
      .catch(() => setComments([]));
  }, [slug]);

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
    if (!author.trim() || !body.trim()) return;
    setSubmitting(true);
    try {
      const newC = await commentsApi.create(slug, { author_name: author.trim(), body: body.trim() });
      setComments((prev) => [newC, ...prev]);
      setAuthor("");
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

  return (
    <>
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
                <img className="article-page__meta-avatar" src={article.author_avatar} alt={article.author_name} />
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
            </div>

            <img
              className="article-page__hero-image"
              src={article.image_url}
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

        <section className="comments-section" data-testid="comments-section">
          <h2 className="comments-section__title">
            Comments ({comments.length})
          </h2>

          <form className="comment-form" onSubmit={handleSubmit}>
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
                <div className="comment" key={c.id} data-testid="comment-item">
                  <div className="comment__head">
                    <div className="comment__avatar">
                      {String(c.author_name || "?").charAt(0).toUpperCase()}
                    </div>
                    <div className="comment__author">{c.author_name}</div>
                    <div className="comment__date">{timeAgo(c.created_at)}</div>
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
