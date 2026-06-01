import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, bookmarksApi } from "@/api";

const AuthContext = createContext({
  user: null,
  loading: true,
  bookmarkSlugs: new Set(),
  login: () => {},
  logout: () => {},
  refresh: () => {},
  refreshBookmarks: () => {},
  toggleBookmark: async (_slug) => false,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookmarkSlugs, setBookmarkSlugs] = useState(new Set());

  const refresh = useCallback(async () => {
    try {
      const me = await authApi.me();
      setUser(me);
      return me;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const refreshBookmarks = useCallback(async () => {
    try {
      const slugs = await bookmarksApi.slugs();
      setBookmarkSlugs(new Set(slugs));
    } catch {
      setBookmarkSlugs(new Set());
    }
  }, []);

  useEffect(() => {
    // CRITICAL: If returning from Emergent OAuth callback, skip the /me check.
    // AuthCallback will exchange the session_id and establish the session first.
    if (typeof window !== "undefined" && window.location.hash?.includes("session_id=")) {
      setLoading(false);
      return;
    }
    (async () => {
      const me = await refresh();
      if (me) await refreshBookmarks();
      setLoading(false);
    })();
  }, [refresh, refreshBookmarks]);

  // Refresh bookmarks whenever user changes
  useEffect(() => {
    if (user) refreshBookmarks();
    else setBookmarkSlugs(new Set());
  }, [user, refreshBookmarks]);

  const login = useCallback(() => {
    // REMINDER: DO NOT HARDCODE THE URL, OR ADD ANY FALLBACKS OR REDIRECT URLS, THIS BREAKS THE AUTH
    const redirectUrl = window.location.origin + "/profile";
    window.location.href = `https://auth.emergentagent.com/?redirect=${encodeURIComponent(redirectUrl)}`;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    }
    setUser(null);
    setBookmarkSlugs(new Set());
  }, []);

  const toggleBookmark = useCallback(
    async (slug) => {
      if (!user) {
        login();
        return false;
      }
      try {
        const res = await bookmarksApi.toggle(slug);
        setBookmarkSlugs((prev) => {
          const next = new Set(prev);
          if (res.bookmarked) next.add(slug);
          else next.delete(slug);
          return next;
        });
        return res.bookmarked;
      } catch {
        return false;
      }
    },
    [user, login]
  );

  const value = {
    user,
    loading,
    bookmarkSlugs,
    login,
    logout,
    refresh,
    refreshBookmarks,
    toggleBookmark,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
