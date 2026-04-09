import { NavLink } from "react-router-dom";
import "./Footer.css";
import logo from "../../assets/images/logo/logo.png" // ← aplay logo path

const Footer = () => {
  return (
    <footer className="footer">
      {/* Diagonal lines overlay */}
      <div className="footer-lines" aria-hidden="true" />

      <div className="footer-inner">

        {/* ── TOP ROW ── */}
        <div className="footer-top">
          {/* Logo */}
          <div className="footer-logo">
            <img src={logo} alt="Urasa Arts" />
            <span className="footer-brand">URASA ARTS<sup>™</sup></span>
          </div>

          {/* Nav links */}
          <nav className="footer-nav" aria-label="Footer navigation">
            <NavLink to="/faq" className="footer-nav-link">Freqeuntly Asked Questions</NavLink>
            <span className="footer-nav-sep" aria-hidden="true" />
            <NavLink to="/terms" className="footer-nav-link">Terms &amp; Conditions</NavLink>
            <span className="footer-nav-sep" aria-hidden="true" />
            <NavLink to="/privacy" className="footer-nav-link">Privacy Policy</NavLink>
          </nav>
        </div>

        {/* ── DIVIDER ── */}
        <div className="footer-divider" />

        {/* ── MIDDLE ROW ── */}
        <div className="footer-mid">

          {/* Phone */}
          <div className="footer-mid-block footer-phones">
            <span className="footer-icon">
              {/* Phone icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12
                  19.79 19.79 0 0 1 1.64 3.36 2 2 0 0 1 3.62 1h3a2 2 0 0 1 2 1.72
                  12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.64a16 16 0 0 0
                  6.07 6.07l.95-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7
                  A2 2 0 0 1 22 16.92z"/>
              </svg>
            </span>
            <div className="footer-phone-list">
              <span>+91 354 3435 456744</span>
              <span>+91 354 3435 45674</span>
              <span>+91 354 3435 45674</span>
            </div>
          </div>

          <div className="footer-mid-sep" aria-hidden="true" />

          {/* Address */}
          <div className="footer-mid-block footer-address">
            <span className="footer-icon">
              {/* Location pin icon */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
            </span>
            <p>Easily create a pixel-perfect online<br />
               presentation for your prints and<br />
               elevate your business to the next……</p>
          </div>

          <div className="footer-mid-sep" aria-hidden="true" />

          {/* Instagram */}
          <div className="footer-mid-block footer-social">
            <span className="footer-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>
              </svg>
            </span>
            <span>@urasa.arts</span>
          </div>

          <div className="footer-mid-sep" aria-hidden="true" />

          {/* LinkedIn */}
          <div className="footer-mid-block footer-social">
            <span className="footer-icon footer-icon--linkedin">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2
                  2v7h-4v-7a6 6 0 0 1 6-6z"/>
                <rect x="2" y="9" width="4" height="12"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
            </span>
            <span>urasa.arts</span>
          </div>

          <div className="footer-mid-sep" aria-hidden="true" />

          {/* X / Twitter */}
          <div className="footer-mid-block footer-social">
            <span className="footer-icon">
              {/* X logo */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231
                  -5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244
                  2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/>
              </svg>
            </span>
            <span>urasa.arts</span>
          </div>

        </div>

        {/* ── DIVIDER ── */}
        <div className="footer-divider" />

        {/* ── BOTTOM ROW ── */}
        <div className="footer-bottom">
          <span className="footer-copy">Urasa Arts Private Limited</span>
          <span className="footer-collab">In collaboration with <strong>SHREE KRISHNA ENTERPRISES</strong></span>
        </div>

      </div>
    </footer>
  );
};

export default Footer;