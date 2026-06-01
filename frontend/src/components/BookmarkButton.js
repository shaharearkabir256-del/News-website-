import React from "react";
import { useAuth } from "@/context/AuthContext";
import { IconBookmark, IconBookmarkFilled } from "@/components/Icons";

export default function BookmarkButton({ slug, size = 20, variant = "icon", onChange }) {
  const { user, bookmarkSlugs, toggleBookmark, login } = useAuth();
  const isSaved = bookmarkSlugs.has(slug);

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      login();
      return;
    }
    const newState = await toggleBookmark(slug);
    if (onChange) onChange(newState);
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        className={`btn btn-secondary ${isSaved ? "btn-saved" : ""}`}
        style={{
          gap: 8,
          color: isSaved ? "var(--color-accent-primary)" : "var(--color-text-primary)",
          borderColor: isSaved ? "var(--color-accent-primary)" : "var(--color-border-default)",
        }}
        data-testid={`bookmark-btn-${slug}`}
        aria-pressed={isSaved}
        title={isSaved ? "Remove from bookmarks" : "Save to bookmarks"}
      >
        {isSaved ? <IconBookmarkFilled size={16} /> : <IconBookmark size={16} />}
        {isSaved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="bookmark-icon-btn"
      data-testid={`bookmark-btn-${slug}`}
      aria-label={isSaved ? "Remove from bookmarks" : "Save to bookmarks"}
      aria-pressed={isSaved}
      title={isSaved ? "Remove from bookmarks" : "Save"}
    >
      {isSaved ? <IconBookmarkFilled size={size} /> : <IconBookmark size={size} />}
    </button>
  );
}
