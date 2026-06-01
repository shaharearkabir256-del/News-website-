import React from "react";
import "@/App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import HomePage from "@/pages/HomePage";
import CategoryPage from "@/pages/CategoryPage";
import ArticlePage from "@/pages/ArticlePage";
import SearchPage from "@/pages/SearchPage";
import AdminPage from "@/pages/AdminPage";
import AdminCommentsPage from "@/pages/AdminCommentsPage";
import ProfilePage from "@/pages/ProfilePage";
import BookmarksPage from "@/pages/BookmarksPage";
import AuthCallback from "@/pages/AuthCallback";
import SiteLayout from "@/components/SiteLayout";
import RequireAuth from "@/components/RequireAuth";

function AppRoutes() {
  const location = useLocation();
  // Per the Emergent Auth playbook — detect session_id during render (NOT useEffect)
  // so we process the new session before any /me check runs.
  if (location.hash?.includes("session_id=")) {
    return <AuthCallback />;
  }
  return (
    <Routes>
      <Route element={<SiteLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/article/:slug" element={<ArticlePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/bookmarks" element={<RequireAuth><BookmarksPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth admin><AdminPage /></RequireAuth>} />
        <Route path="/admin/comments" element={<RequireAuth admin><AdminCommentsPage /></RequireAuth>} />
      </Route>
    </Routes>
  );
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <AuthProvider>
          <div className="App">
            <a href="#main" className="skip-link">Skip to main content</a>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
