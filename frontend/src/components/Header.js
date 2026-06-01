import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { IconSearch, IconMenu, IconClose, IconUser } from "@/components/Icons";
import { useAuth } from "@/context/AuthContext";
import UserMenu from "@/components/UserMenu";

const NAV_LINKS = [
  { to: "/category/world", label: "World" },
  { to: "/category/politics", label: "Politics" },
  { to: "/category/business", label: "Business" },
  { to: "/category/technology", label: "Tech" },
  { to: "/category/science", label: "Science" },
  { to: "/category/culture", label: "Culture" },
  { to: "/category/sports", label: "Sports" },
];

export default function Header() {
  const [shrunk, setShrunk] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const { user, login } = useAuth();
  const menuRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setShrunk(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setDrawer(false);
    setSearchOpen(false);
    setMenuOpen(false);
  }, [location.pathname]);

  // Click-outside to close dropdown
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q.length === 0) return;
    navigate(`/search?q=${encodeURIComponent(q)}`);
    setSearchOpen(false);
  };

  const initials = user
    ? (user.name || user.email)
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase())
        .join("")
    : "";

  return (
    <>
      <header className={`header ${shrunk ? "header--shrunk" : ""}`} data-testid="site-header">
        <div className="container header__inner">
          <Link to="/" className="header__logo" data-testid="site-logo">
            <span className="header__logo-mark">C</span>
            <span>THE CHRONICLE</span>
          </Link>

          <nav className="header__nav" aria-label="Primary">
            {NAV_LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  `header__nav-link ${isActive ? "header__nav-link--active" : ""}`
                }
                data-testid={`nav-${l.label.toLowerCase()}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="header__actions">
            <button
              className="header__icon-btn"
              onClick={() => setSearchOpen((s) => !s)}
              aria-label="Toggle search"
              data-testid="open-search-btn"
            >
              <IconSearch />
            </button>

            {user ? (
              <div className="header__user-wrap" ref={menuRef}>
                <button
                  className="header__avatar-btn"
                  onClick={() => setMenuOpen((m) => !m)}
                  aria-haspopup="menu"
                  aria-expanded={menuOpen}
                  data-testid="user-avatar-btn"
                  title={user.name}
                >
                  {user.picture ? (
                    <img src={user.picture} alt="" />
                  ) : (
                    <span className="header__avatar-initials">{initials || "?"}</span>
                  )}
                </button>
                {menuOpen && <UserMenu onClose={() => setMenuOpen(false)} />}
              </div>
            ) : (
              <button
                className="header__signin"
                onClick={login}
                data-testid="signin-btn"
              >
                <IconUser size={14} /> Sign in
              </button>
            )}

            <a href="#subscribe" className="header__subscribe-pill" data-testid="subscribe-pill">Subscribe</a>
            <button
              className="hamburger-menu"
              onClick={() => setDrawer(true)}
              aria-label="Open menu"
              data-testid="open-drawer-btn"
            >
              <IconMenu />
            </button>
          </div>
        </div>

        {searchOpen && (
          <div
            style={{
              borderTop: "1px solid var(--color-border-default)",
              backgroundColor: "var(--color-bg-surface)",
              padding: "var(--space-4) 0",
            }}
          >
            <div className="container">
              <form className="search-form" onSubmit={handleSearchSubmit}>
                <input
                  className="search-form__input"
                  placeholder="Search The Chronicle…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  data-testid="header-search-input"
                />
                <button type="submit" className="btn btn-primary" data-testid="header-search-submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        )}
      </header>

      <div
        className={`mobile-drawer__backdrop ${drawer ? "mobile-drawer__backdrop--open" : ""}`}
        onClick={() => setDrawer(false)}
      />
      <aside className={`mobile-drawer ${drawer ? "mobile-drawer--open" : ""}`} aria-hidden={!drawer}>
        <button
          className="mobile-drawer__close"
          onClick={() => setDrawer(false)}
          aria-label="Close menu"
          data-testid="close-drawer-btn"
        >
          <IconClose />
        </button>
        <div className="mobile-drawer__title">THE CHRONICLE</div>
        <nav className="mobile-drawer__nav">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="mobile-drawer__link"
              onClick={() => setDrawer(false)}
              data-testid={`drawer-nav-${l.label.toLowerCase()}`}
            >
              {l.label}
            </Link>
          ))}
          <Link to="/search" className="mobile-drawer__link" onClick={() => setDrawer(false)}>
            Search
          </Link>
          {user && (
            <>
              <Link to="/profile" className="mobile-drawer__link" onClick={() => setDrawer(false)}>
                Profile
              </Link>
              <Link to="/bookmarks" className="mobile-drawer__link" onClick={() => setDrawer(false)}>
                Bookmarks
              </Link>
            </>
          )}
          {user?.is_admin && (
            <>
              <Link to="/admin" className="mobile-drawer__link" onClick={() => setDrawer(false)}>
                Admin Console
              </Link>
              <Link to="/admin/comments" className="mobile-drawer__link" onClick={() => setDrawer(false)}>
                Moderate Comments
              </Link>
            </>
          )}
          {!user && (
            <button
              className="mobile-drawer__link"
              style={{ textAlign: "left", background: "none", border: "none", borderBottom: "1px solid var(--color-border-default)", padding: "12px 0", cursor: "pointer", fontFamily: "inherit", fontSize: "inherit", textTransform: "uppercase", letterSpacing: "var(--letter-spacing-badge)" }}
              onClick={() => { setDrawer(false); login(); }}
            >
              Sign in
            </button>
          )}
        </nav>
      </aside>
    </>
  );
}
