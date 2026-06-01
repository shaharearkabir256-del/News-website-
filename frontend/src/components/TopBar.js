import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { formatLongDate } from "@/lib/utils";
import { IconSun, IconMoon, IconTwitter, IconFacebook, IconInstagram, IconLinkedin } from "@/components/Icons";

export default function TopBar() {
  const { theme, toggleTheme } = useTheme();
  const [date, setDate] = useState(formatLongDate());

  useEffect(() => {
    const t = setInterval(() => setDate(formatLongDate()), 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="top-bar" data-testid="top-bar">
      <div className="container top-bar__inner">
        <div className="top-bar__left">
          <span className="top-bar__date">{date}</span>
        </div>
        <div className="top-bar__right">
          <div className="top-bar__social" aria-label="Follow The Chronicle on social media">
            <a href="#" aria-label="Twitter"><IconTwitter /></a>
            <a href="#" aria-label="Facebook"><IconFacebook /></a>
            <a href="#" aria-label="Instagram"><IconInstagram /></a>
            <a href="#" aria-label="LinkedIn"><IconLinkedin /></a>
          </div>
          <a href="#subscribe" className="top-bar__subscribe" data-testid="top-subscribe-link">Subscribe</a>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            data-testid="theme-toggle"
          >
            {theme === "light" ? <IconMoon /> : <IconSun />}
          </button>
        </div>
      </div>
    </div>
  );
}
