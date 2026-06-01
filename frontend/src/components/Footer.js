import React from "react";
import { Link } from "react-router-dom";
import { IconTwitter, IconFacebook, IconInstagram, IconLinkedin, IconYoutube } from "@/components/Icons";

export default function Footer() {
  return (
    <footer className="footer" data-testid="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <div className="footer__logo">
              <span className="header__logo-mark" style={{ width: 28, height: 28 }}>C</span>
              <span>THE CHRONICLE</span>
            </div>
            <div className="footer__tagline">Truth. Clarity. Impact.</div>
            <p className="footer__description">
              The Chronicle is an independent, reader-supported newsroom committed to original
              reporting, careful analysis, and the public interest. Since 1894.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Twitter"><IconTwitter /></a>
              <a href="#" aria-label="Facebook"><IconFacebook /></a>
              <a href="#" aria-label="Instagram"><IconInstagram /></a>
              <a href="#" aria-label="LinkedIn"><IconLinkedin /></a>
              <a href="#" aria-label="YouTube"><IconYoutube /></a>
            </div>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Sections</div>
            <ul>
              <li><Link to="/category/world">World</Link></li>
              <li><Link to="/category/politics">Politics</Link></li>
              <li><Link to="/category/business">Business</Link></li>
              <li><Link to="/category/technology">Technology</Link></li>
              <li><Link to="/category/science">Science</Link></li>
              <li><Link to="/category/culture">Culture</Link></li>
              <li><Link to="/category/sports">Sports</Link></li>
            </ul>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">The Chronicle</div>
            <ul>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Editorial Standards</a></li>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Press Room</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">Account</div>
            <ul>
              <li><a href="#subscribe">Subscribe</a></li>
              <li><a href="#">Sign In</a></li>
              <li><a href="#">Gift Subscription</a></li>
              <li><a href="#">Corporate</a></li>
              <li><a href="#">Newsletters</a></li>
              <li><Link to="/admin">Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <div>&copy; {new Date().getFullYear()} The Chronicle Media. All rights reserved.</div>
          <div className="footer__bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
            <a href="#">Accessibility</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
