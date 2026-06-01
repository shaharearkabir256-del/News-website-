import React, { useEffect, useState } from "react";
import { articlesApi, resolveImageUrl } from "@/api";
import { CategoryBadge, TagBadge } from "@/components/Badge";
import { formatDate } from "@/lib/utils";
import { SiteSEO } from "@/components/SEO";
import ImageUploader from "@/components/ImageUploader";
import { Link } from "react-router-dom";

const CATEGORIES = ["world", "politics", "business", "technology", "science", "culture", "sports"];
const TAGS = ["breaking", "live", "exclusive", "analysis", "opinion", "sponsored"];

const emptyArticle = {
  title: "",
  subtitle: "",
  summary: "",
  body: "",
  category: "world",
  tags: [],
  image_url: "",
  image_caption: "",
  author_name: "",
  author_avatar: "",
  author_title: "",
  is_featured: false,
  hero_rank: null,
  is_trending: false,
  trending_rank: null,
  is_opinion: false,
  opinion_quote: "",
  is_video: false,
  video_duration: "",
  read_minutes: 5,
};

export default function AdminPage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [draft, setDraft] = useState(emptyArticle);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const refresh = () => {
    setLoading(true);
    articlesApi
      .list({ limit: 200 })
      .then(setArticles)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleEdit = (a) => {
    setEditing(a);
    setDraft({
      ...emptyArticle,
      ...a,
      tags: a.tags || [],
    });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleNew = () => {
    setEditing(null);
    setDraft({ ...emptyArticle });
    setShowForm(true);
    setError("");
    setSuccess("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    setDraft(emptyArticle);
  };

  const updateField = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTag = (tag) => {
    setDraft((prev) => {
      const has = (prev.tags || []).includes(tag);
      return {
        ...prev,
        tags: has ? prev.tags.filter((t) => t !== tag) : [...(prev.tags || []), tag],
      };
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!draft.title.trim() || !draft.body.trim() || !draft.summary.trim() || !draft.author_name.trim() || !draft.image_url.trim()) {
      setError("Title, summary, body, author and image URL are required.");
      return;
    }

    setSaving(true);
    try {
      // Clean payload
      const payload = { ...draft };
      // Coerce numeric fields
      payload.read_minutes = parseInt(payload.read_minutes, 10) || 5;
      payload.hero_rank = payload.hero_rank === "" || payload.hero_rank == null ? null : parseInt(payload.hero_rank, 10);
      payload.trending_rank = payload.trending_rank === "" || payload.trending_rank == null ? null : parseInt(payload.trending_rank, 10);

      if (editing) {
        // For update, only include fields user actually edited — send all known editable fields.
        const updateFields = {
          title: payload.title,
          subtitle: payload.subtitle,
          summary: payload.summary,
          body: payload.body,
          category: payload.category,
          tags: payload.tags,
          image_url: payload.image_url,
          image_caption: payload.image_caption,
          author_name: payload.author_name,
          author_avatar: payload.author_avatar,
          author_title: payload.author_title,
          is_featured: payload.is_featured,
          hero_rank: payload.hero_rank,
          is_trending: payload.is_trending,
          trending_rank: payload.trending_rank,
          is_opinion: payload.is_opinion,
          opinion_quote: payload.opinion_quote,
          is_video: payload.is_video,
          video_duration: payload.video_duration,
          read_minutes: payload.read_minutes,
        };
        await articlesApi.update(editing.id, updateFields);
        setSuccess("Article updated.");
      } else {
        await articlesApi.create(payload);
        setSuccess("Article created.");
      }
      handleCancel();
      refresh();
    } catch (err) {
      setError("Could not save article. Please check inputs and try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (a) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm(`Delete "${a.title}"? This cannot be undone.`)) return;
    try {
      await articlesApi.remove(a.id);
      setSuccess("Article deleted.");
      refresh();
    } catch {
      setError("Could not delete article.");
    }
  };

  const handleReseed = async () => {
    // eslint-disable-next-line no-alert
    if (!window.confirm("Reseed will replace all current articles with the canonical 9. Continue?")) return;
    try {
      await articlesApi.reseed();
      setSuccess("Database reseeded.");
      refresh();
    } catch {
      setError("Reseed failed.");
    }
  };

  return (
    <div className="container admin-page" data-testid="admin-page">
      <SiteSEO title="Editorial Console" noindex />
      <div className="admin-header">
        <div>
          <h1 className="admin-header__title">Editorial Console</h1>
          <div className="admin-header__subtitle">Manage The Chronicle's published stories.</div>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link to="/admin/comments" className="btn btn-secondary" data-testid="link-admin-comments">
            Moderate Comments
          </Link>
          <button className="btn btn-secondary" onClick={handleReseed} data-testid="admin-reseed">
            Reseed Demo Data
          </button>
          <button className="btn btn-primary" onClick={handleNew} data-testid="admin-new-btn">
            + New Article
          </button>
        </div>
      </div>

      {error && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "var(--color-accent-subtle)",
            color: "var(--color-accent-primary)",
            borderRadius: 4,
            marginBottom: 16,
            fontFamily: "var(--font-family-ui)",
          }}
          data-testid="admin-error"
        >
          {error}
        </div>
      )}
      {success && (
        <div
          style={{
            padding: "12px 16px",
            backgroundColor: "#E6F4EA",
            color: "#1E4D2B",
            borderRadius: 4,
            marginBottom: 16,
            fontFamily: "var(--font-family-ui)",
          }}
          data-testid="admin-success"
        >
          {success}
        </div>
      )}

      {showForm && (
        <form className="admin-form" onSubmit={handleSave} data-testid="admin-form">
          <h2 style={{ marginBottom: 24, fontFamily: "var(--font-family-display)", fontSize: "var(--text-2xl)" }}>
            {editing ? "Edit Article" : "New Article"}
          </h2>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Title *</label>
              <input
                className="admin-form__input"
                value={draft.title}
                onChange={(e) => updateField("title", e.target.value)}
                data-testid="admin-title"
                required
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Subtitle (deck)</label>
              <input
                className="admin-form__input"
                value={draft.subtitle || ""}
                onChange={(e) => updateField("subtitle", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Summary *</label>
              <textarea
                className="admin-form__textarea"
                value={draft.summary}
                onChange={(e) => updateField("summary", e.target.value)}
                rows={3}
                style={{ minHeight: 80 }}
                data-testid="admin-summary"
                required
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Body *</label>
              <textarea
                className="admin-form__textarea"
                value={draft.body}
                onChange={(e) => updateField("body", e.target.value)}
                style={{ minHeight: 240 }}
                data-testid="admin-body"
                required
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Category *</label>
              <select
                className="admin-form__select"
                value={draft.category}
                onChange={(e) => updateField("category", e.target.value)}
                data-testid="admin-category"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Read minutes</label>
              <input
                type="number"
                className="admin-form__input"
                value={draft.read_minutes}
                onChange={(e) => updateField("read_minutes", e.target.value)}
                min="1"
                max="60"
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Tags</label>
              <div className="admin-form__checks">
                {TAGS.map((t) => (
                  <label className="admin-form__check" key={t}>
                    <input
                      type="checkbox"
                      checked={(draft.tags || []).includes(t)}
                      onChange={() => toggleTag(t)}
                    />
                    <span style={{ textTransform: "capitalize" }}>{t}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Image *</label>
              <ImageUploader
                value={draft.image_url}
                onChange={(url) => updateField("image_url", url)}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Image caption</label>
              <input
                className="admin-form__input"
                value={draft.image_caption || ""}
                onChange={(e) => updateField("image_caption", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field">
              <label className="admin-form__label">Author name *</label>
              <input
                className="admin-form__input"
                value={draft.author_name}
                onChange={(e) => updateField("author_name", e.target.value)}
                data-testid="admin-author-name"
                required
              />
            </div>
            <div className="admin-form__field">
              <label className="admin-form__label">Author title</label>
              <input
                className="admin-form__input"
                value={draft.author_title || ""}
                onChange={(e) => updateField("author_title", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Author avatar URL</label>
              <input
                className="admin-form__input"
                value={draft.author_avatar || ""}
                onChange={(e) => updateField("author_avatar", e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form__row">
            <div className="admin-form__field admin-form__field--full">
              <label className="admin-form__label">Section flags</label>
              <div className="admin-form__checks">
                <label className="admin-form__check">
                  <input
                    type="checkbox"
                    checked={!!draft.is_featured}
                    onChange={(e) => updateField("is_featured", e.target.checked)}
                  />
                  Featured (hero)
                </label>
                <label className="admin-form__check">
                  <input
                    type="checkbox"
                    checked={!!draft.is_trending}
                    onChange={(e) => updateField("is_trending", e.target.checked)}
                  />
                  Trending
                </label>
                <label className="admin-form__check">
                  <input
                    type="checkbox"
                    checked={!!draft.is_opinion}
                    onChange={(e) => updateField("is_opinion", e.target.checked)}
                  />
                  Opinion
                </label>
                <label className="admin-form__check">
                  <input
                    type="checkbox"
                    checked={!!draft.is_video}
                    onChange={(e) => updateField("is_video", e.target.checked)}
                  />
                  Video story
                </label>
              </div>
            </div>
          </div>

          {draft.is_featured && (
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-form__label">Hero rank (0 = main, 1–3 = secondary)</label>
                <input
                  type="number"
                  className="admin-form__input"
                  value={draft.hero_rank ?? ""}
                  onChange={(e) => updateField("hero_rank", e.target.value)}
                />
              </div>
              <div className="admin-form__field">
                <label className="admin-form__label">Trending rank (1–5)</label>
                <input
                  type="number"
                  className="admin-form__input"
                  value={draft.trending_rank ?? ""}
                  onChange={(e) => updateField("trending_rank", e.target.value)}
                />
              </div>
            </div>
          )}

          {draft.is_opinion && (
            <div className="admin-form__row">
              <div className="admin-form__field admin-form__field--full">
                <label className="admin-form__label">Opinion pull-quote</label>
                <textarea
                  className="admin-form__textarea"
                  value={draft.opinion_quote || ""}
                  onChange={(e) => updateField("opinion_quote", e.target.value)}
                  style={{ minHeight: 90 }}
                />
              </div>
            </div>
          )}

          {draft.is_video && (
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label className="admin-form__label">Video duration (MM:SS)</label>
                <input
                  className="admin-form__input"
                  value={draft.video_duration || ""}
                  onChange={(e) => updateField("video_duration", e.target.value)}
                  placeholder="08:24"
                />
              </div>
            </div>
          )}

          <div className="admin-form__actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={saving} data-testid="admin-save">
              {saving ? "Saving…" : editing ? "Update Article" : "Publish Article"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="loader">Loading articles…</div>
      ) : articles.length === 0 ? (
        <div className="admin-empty">No articles yet. Click “New Article” to create one.</div>
      ) : (
        <table className="admin-table" data-testid="admin-table">
          <thead>
            <tr>
              <th>Article</th>
              <th>Category</th>
              <th>Flags</th>
              <th>Published</th>
              <th style={{ textAlign: "right" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} data-testid={`admin-row-${a.slug}`}>
                <td>
                  <div className="admin-table__title">{a.title}</div>
                  <div className="admin-table__slug">/{a.slug}</div>
                </td>
                <td>
                  <CategoryBadge category={a.category} />
                </td>
                <td>
                  <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {a.is_featured && <TagBadge tag="breaking" />}
                    {a.is_trending && <TagBadge tag="analysis" />}
                    {a.is_opinion && <TagBadge tag="opinion" />}
                    {a.is_video && <TagBadge tag="exclusive" />}
                  </div>
                </td>
                <td>{formatDate(a.published_at)}</td>
                <td>
                  <div className="admin-table__actions">
                    <button
                      className="btn btn-secondary"
                      onClick={() => handleEdit(a)}
                      data-testid={`admin-edit-${a.slug}`}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(a)}
                      data-testid={`admin-delete-${a.slug}`}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
