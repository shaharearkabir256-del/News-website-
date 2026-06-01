import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { IconUser, IconBookmark, IconLogOut, IconShield } from "@/components/Icons";

export default function UserMenu({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    if (onClose) onClose();
    navigate("/");
  };

  const initials = (user.name || user.email || "?")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <div className="user-menu" data-testid="user-menu">
      <div className="user-menu__head">
        {user.picture ? (
          <img className="user-menu__avatar" src={user.picture} alt="" />
        ) : (
          <div className="user-menu__avatar user-menu__avatar--initials">{initials || "?"}</div>
        )}
        <div className="user-menu__identity">
          <div className="user-menu__name">{user.name}</div>
          <div className="user-menu__email">{user.email}</div>
          {user.is_admin && (
            <span className="user-menu__admin-badge">
              <IconShield size={11} /> Admin
            </span>
          )}
        </div>
      </div>
      <div className="user-menu__divider" />
      <Link to="/profile" className="user-menu__item" onClick={onClose}>
        <IconUser size={16} /> Profile
      </Link>
      <Link to="/bookmarks" className="user-menu__item" onClick={onClose}>
        <IconBookmark size={16} /> Bookmarks
      </Link>
      {user.is_admin && (
        <>
          <div className="user-menu__divider" />
          <Link to="/admin" className="user-menu__item" onClick={onClose}>
            <IconShield size={16} /> Editorial Console
          </Link>
          <Link to="/admin/comments" className="user-menu__item" onClick={onClose}>
            <IconShield size={16} /> Moderate Comments
          </Link>
        </>
      )}
      <div className="user-menu__divider" />
      <button className="user-menu__item user-menu__item--danger" onClick={handleLogout} data-testid="logout-btn">
        <IconLogOut size={16} /> Sign out
      </button>
    </div>
  );
}
