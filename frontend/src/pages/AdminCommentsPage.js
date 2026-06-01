import React, { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/api";
import { SiteSEO } from "@/components/SEO";
import { Link } from "react-router-dom";
import { IconCheck, IconEyeOff, IconTrash } from "@/components/Icons";
import { timeAgo } from "@/lib/utils";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "visible", label: "Visible" },
  { value: "hidden", label: "Hidden" },
];

export default function AdminCommentsPage() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(new Set());
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const refresh = () => {
    setLoading(true);
    const param = filter === "all" ? null : filter;
    adminApi
      .listAllComments(param)
      .then((d) => {
        setComments(d);
        setSelected(new Set());
      })
      .catch(() => setError("Could not load comments."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const filteredCount = comments.length;
  const allSelected = useMemo(
    () => filteredCount > 0 && selected.size === filteredCount,
    [selected.size, filteredCount]
  );

  const toggleSelect = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set(comments.map((c) => c.id)));
  };

  const runBulk = async (action) => {
    if (selected.size === 0) return;
    if (action === "delete" && !window.confirm(`Delete ${selected.size} comments? This cannot be undone.`)) return;
    try {
      const res = await adminApi.bulkComments(Array.from(selected), action);
      setInfo(`${action}: affected ${res.affected || 0}`);
      refresh();
    } catch {
      setError("Bulk action failed.");
    }
  };

  const handleHide = async (id) => {
    await adminApi.hideComment(id);
    refresh();
  };
  const handleUnhide = async (id) => {
    await adminApi.unhideComment(id);
    refresh();
  };
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this comment? This cannot be undone.")) return;
    await adminApi.deleteComment(id);
    refresh();
  };

  return (
    <>
      <SiteSEO title="Moderate Comments" noindex />
      <div className="container admin-page" data-testid="admin-comments-page">
        <div className="admin-header">
          <div>
            <h1 className="admin-header__title">Moderate Comments</h1>
            <div className="admin-header__subtitle">Hide, unhide, or delete reader comments.</div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
            <div className="mod-filter">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  className={`mod-filter__btn ${filter === f.value ? "is-active" : ""}`}
                  onClick={() => setFilter(f.value)}
                  data-testid={`mod-filter-${f.value}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
            <Link to="/admin" className="btn btn-secondary">← Articles</Link>
          </div>
        </div>

        {error && <div className="admin-flash admin-flash--error">{error}</div>}
        {info && <div className="admin-flash admin-flash--info">{info}</div>}

        <div className="mod-toolbar">
          <label className="admin-form__check">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={selectAll}
              data-testid="mod-select-all"
            />
            {selected.size > 0 ? `${selected.size} selected` : "Select all"}
          </label>
          <div style={{ display: "flex", gap: 8, marginLeft: "auto" }}>
            <button className="btn btn-secondary" disabled={selected.size === 0} onClick={() => runBulk("hide")} data-testid="mod-bulk-hide">
              Hide
            </button>
            <button className="btn btn-secondary" disabled={selected.size === 0} onClick={() => runBulk("unhide")} data-testid="mod-bulk-unhide">
              Unhide
            </button>
            <button className="btn btn-danger" disabled={selected.size === 0} onClick={() => runBulk("delete")} data-testid="mod-bulk-delete">
              Delete
            </button>
          </div>
        </div>

        {loading ? (
          <div className="loader">Loading comments…</div>
        ) : comments.length === 0 ? (
          <div className="admin-empty">No comments in this filter.</div>
        ) : (
          <div className="mod-list">
            {comments.map((c) => (
              <div className={`mod-comment ${c.is_hidden ? "mod-comment--hidden" : ""}`} key={c.id} data-testid={`mod-comment-${c.id}`}>
                <label className="mod-comment__select">
                  <input
                    type="checkbox"
                    checked={selected.has(c.id)}
                    onChange={() => toggleSelect(c.id)}
                  />
                </label>
                <div className="mod-comment__body">
                  <div className="mod-comment__meta">
                    <span className="mod-comment__author">{c.author_name}</span>
                    <span className="article-card__dot" />
                    <span>{timeAgo(c.created_at)}</span>
                    <span className="article-card__dot" />
                    <Link to={`/article/${c.article_slug}`} className="mod-comment__article">
                      /{c.article_slug}
                    </Link>
                    {c.is_hidden && <span className="mod-comment__pill">Hidden</span>}
                  </div>
                  <p className="mod-comment__text">{c.body}</p>
                </div>
                <div className="mod-comment__actions">
                  {c.is_hidden ? (
                    <button className="btn btn-secondary" onClick={() => handleUnhide(c.id)} data-testid={`mod-unhide-${c.id}`}>
                      <IconCheck /> Unhide
                    </button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => handleHide(c.id)} data-testid={`mod-hide-${c.id}`}>
                      <IconEyeOff /> Hide
                    </button>
                  )}
                  <button className="btn btn-danger" onClick={() => handleDelete(c.id)} data-testid={`mod-delete-${c.id}`}>
                    <IconTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
