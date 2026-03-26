import { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";
import "./Navbar.css";
import logo from "../../assets/images/logo/logo.png";
import navbarBg from "../../assets/images/nav/bg.jpg";

/* ─────────────────────────────────────────────────────────────
   DATA — All services with proper paths
───────────────────────────────────────────────────────────── */
export const SERVICE_CATEGORIES = [
  {
    col: 0,
    groups: [
      {
        label: "Publish & Editorial",
        slug: "publish-editorial",
        path: "/services/publish-editorial",
        items: [
          { icon: "📗", label: "Saddle Booklet",          path: "/services/publish-editorial/saddle-booklet" },
          { icon: "📘", label: "Coffee Table Book",        path: "/services/publish-editorial/coffee-table-book" },
          { icon: "📙", label: "Perfect Bound Booklet",    path: "/services/publish-editorial/perfect-bound-booklet" },
          { icon: "🌀", label: "Spiral / Comb Coil Booklet", path: "/services/publish-editorial/spiral-comb-coil-booklet" },
          { icon: "📒", label: "Hard Cover Booklet",       path: "/services/publish-editorial/hard-cover-booklet" },
        ],
      },
      {
        label: "Academic & Educational",
        slug: "academic-educational",
        path: "/services/academic-educational",
        items: [
          { icon: "📚", label: "Textbook",          path: "/services/academic-educational/textbook" },
          { icon: "📓", label: "Notebook",           path: "/services/academic-educational/notebook" },
          { icon: "🎨", label: "Artbook / Drawing",  path: "/services/academic-educational/artbook-drawing" },
          { icon: "🗒️", label: "Ledger Register",   path: "/services/premium-packaging/ledger-register" },

        ],
      },
    ],
  },
  {
    col: 1,
    groups: [
      {
        label: "Premium Packaging",
        slug: "premium-packaging",
        path: "/services/premium-packaging",
        items: [
          { icon: "📦", label: "Offset Packaging",  path: "/services/premium-packaging/offset-packaging" },
        ],
      },
      {
        label: "Corporate Identities",
        slug: "corporate-identities",
        path: "/services/corporate-identities",
        items: [
          { icon: "🃏", label: "Business Cards",          path: "/services/corporate-identities/business-cards" },
          { icon: "✨", label: "Premium Business Cards",  path: "/services/corporate-identities/premium-business-cards" },
          { icon: "📁", label: "Files & Folders",         path: "/services/corporate-identities/files-folders" },
          { icon: "📔", label: "Diaries",                 path: "/services/corporate-identities/diaries" },
          { icon: "📅", label: "Calendar",                path: "/services/corporate-identities/calendar" },
          { icon: "📄", label: "Letterheads",             path: "/services/corporate-identities/letterheads" },
          { icon: "✉️", label: "Envelopes",               path: "/services/corporate-identities/envelopes" },
        ],
      },
    ],
  },
  {
    col: 2,
    groups: [
      {
        label: "Specialty Cards & Invites",
        slug: "specialty-cards",
        path: "/services/specialty-cards",
        items: [
          { icon: "🖼️", label: "Postcards",                  path: "/services/specialty-cards/postcards" },
          { icon: "💌", label: "Greeting Cards",              path: "/services/specialty-cards/greeting-cards" },
          { icon: "💍", label: "Invitation / Wedding Cards",  path: "/services/specialty-cards/invitation-wedding-cards" },
        ],
      },
      {
        label: "Marketing Collateral",
        slug: "marketing-collateral",
        path: "/services/marketing-collateral",
        items: [
          { icon: "📰", label: "Magazines",      path: "/services/marketing-collateral/magazines" },
          { icon: "📋", label: "Brochures",      path: "/services/marketing-collateral/brochures" },
          { icon: "📇", label: "Catalogues",     path: "/services/marketing-collateral/catalogues" },
          { icon: "📃", label: "Pamphlets",      path: "/services/marketing-collateral/pamphlets" },
          { icon: "🛍️", label: "Shopping Bags",  path: "/services/marketing-collateral/shopping-bags" },
        ],
      },
    ],
  },
];

/* Flat list of every service item for search */
const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((col) =>
  col.groups.flatMap((group) =>
    group.items.map((item) => ({
      ...item,
      category: group.label,
      categorySlug: group.slug,
      categoryPath: group.path,
    }))
  )
);

/* All category labels for search */
const ALL_CATEGORIES = SERVICE_CATEGORIES.flatMap((col) =>
  col.groups.map((group) => ({
    label: group.label,
    slug: group.slug,
    path: group.path,
    icon: "🗂️",
    isCategory: true,
  }))
);

const NAV_LINKS = [
  { label: "Home",     to: "/" },
  { label: "Services", to: "/services", hasDropdown: true },
  { label: "About",    to: "/about" },
  { label: "Blog",     to: "/blog" },
  { label: "Contact",  to: "/contact" },
];

/* ─────────────────────────────────────────────────────────────
   ICONS
───────────────────────────────────────────────────────────── */
const ChevronIcon = ({ rotated }) => (
  <svg className={`ua-chevron${rotated ? " rotated" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const QuoteIcon = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const SearchIcon = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const CloseSmIcon = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* ─────────────────────────────────────────────────────────────
   SEARCH BOX COMPONENT
───────────────────────────────────────────────────────────── */
const SearchBox = ({ onClose }) => {
  const [query,   setQuery]   = useState("");
  const [results, setResults] = useState([]);
  const [focused, setFocused] = useState(false);
  const [portalStyle, setPortalStyle] = useState({});

  const inputRef = useRef(null);
  const wrapRef  = useRef(null);
  const navigate = useNavigate();

  useEffect(() => { inputRef.current?.focus(); }, []);

  useEffect(() => {
    const q = query.trim().toLowerCase();
    if (!q) { setResults([]); return; }

    const matchedCategories = ALL_CATEGORIES.filter((c) =>
      c.label.toLowerCase().includes(q)
    );
    const matchedItems = ALL_SERVICES.filter((s) =>
      s.label.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q)
    );
    const catLabels     = new Set(matchedCategories.map((c) => c.label));
    const filteredItems = matchedItems.filter((s) => !catLabels.has(s.category));
    setResults([...matchedCategories, ...filteredItems].slice(0, 10));
  }, [query]);

  const calcPortalPos = useCallback(() => {
    if (!wrapRef.current) return;
    const rect    = wrapRef.current.getBoundingClientRect();
    const vw      = window.innerWidth;
    const PADDING = 8;
    let w    = Math.max(260, Math.min(rect.width, 420));
    let left = rect.left;
    if (left + w > vw - PADDING) left = vw - w - PADDING;
    left = Math.max(PADDING, left);
    setPortalStyle({ position: "fixed", top: rect.bottom + 4, left, width: w, zIndex: 99999 });
  }, []);

  useEffect(() => {
    if (results.length === 0 && !query.trim()) return;
    calcPortalPos();
    window.addEventListener("resize", calcPortalPos);
    return () => window.removeEventListener("resize", calcPortalPos);
  }, [results, query, calcPortalPos]);

  /* ── UPDATED: navigate to proper path ── */
  const handleSelect = (result) => {
    const destination = result.path || result.categoryPath || "/services";
    navigate(destination);
    setQuery("");
    setResults([]);
    onClose?.();
  };

  const handleKey = (e) => { if (e.key === "Escape") onClose?.(); };

  const ResultsPortal = () => {
    if (!query.trim()) return null;
    if (results.length === 0) {
      return createPortal(
        <div className="ua-search-empty-portal" style={portalStyle}>
          No services found for "<strong>{query}</strong>"
        </div>,
        document.body
      );
    }
    return createPortal(
      <ul className="ua-search-results-portal" id="ua-search-results" role="listbox" style={portalStyle}>
        {results.map((result, i) => (
          <li
            key={i}
            className={`ua-search-result-item${result.isCategory ? " is-category" : ""}`}
            role="option"
            onMouseDown={() => handleSelect(result)}
          >
            <span className="ua-result-icon">{result.icon}</span>
            <span className="ua-result-text">
              <span className="ua-result-label">{result.label}</span>
              {!result.isCategory && (
                <span className="ua-result-category">{result.category}</span>
              )}
            </span>
            {result.isCategory && <span className="ua-result-badge">Category</span>}
          </li>
        ))}
      </ul>,
      document.body
    );
  };

  return (
    <div className="ua-search-wrap" ref={wrapRef}>
      <div className={`ua-search-box${focused ? " focused" : ""}`}>
        <span className="ua-search-icon"><SearchIcon /></span>
        <input
          ref={inputRef}
          type="text"
          className="ua-search-input"
          placeholder="Search services…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          onKeyDown={handleKey}
          aria-label="Search services"
          aria-autocomplete="list"
          aria-controls="ua-search-results"
        />
        {query && (
          <button
            className="ua-search-clear"
            onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
            aria-label="Clear search"
          >
            <CloseSmIcon />
          </button>
        )}
      </div>
      <ResultsPortal />
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   DESKTOP MEGA DROPDOWN
───────────────────────────────────────────────────────────── */
const ServicesDropdown = ({ isOpen, anchorRef, onItemClick, onCategoryClick }) => {
  const [style, setStyle] = useState({});

  const calcStyle = useCallback(() => {
    if (!isOpen || !anchorRef?.current) return;
    const rect    = anchorRef.current.getBoundingClientRect();
    const vw      = window.innerWidth;
    const PADDING = 12;
    let dropWidth;
    if      (vw >= 1600) dropWidth = Math.min(1100, vw - PADDING * 2);
    else if (vw >= 1440) dropWidth = Math.min(1000, vw - PADDING * 2);
    else if (vw >= 1280) dropWidth = Math.min(920,  vw - PADDING * 2);
    else if (vw >= 1024) dropWidth = Math.min(820,  vw - PADDING * 2);
    else                 dropWidth = vw - PADDING * 2;

    let left = rect.left + rect.width / 2 - dropWidth / 2;
    left = Math.max(PADDING, Math.min(left, vw - dropWidth - PADDING));

    let cols;
    if      (dropWidth >= 700) cols = 3;
    else if (dropWidth >= 440) cols = 2;
    else                       cols = 1;

    setStyle({
      position: "fixed", top: rect.bottom + 6, left, width: dropWidth,
      zIndex: 9999, gridTemplateColumns: `repeat(${cols}, 1fr)`,
    });
  }, [isOpen, anchorRef]);

  useEffect(() => {
    calcStyle();
    window.addEventListener("resize", calcStyle);
    return () => window.removeEventListener("resize", calcStyle);
  }, [calcStyle]);

  if (!isOpen) return null;

  return createPortal(
    <div className={`ua-dropdown${isOpen ? " open" : ""}`} style={style} role="menu" aria-label="Services menu">
      <span className="ua-dd-header">Our Service Categories</span>
      {SERVICE_CATEGORIES.map((col) => (
        <div key={col.col} className="ua-dd-col">
          {col.groups.map((group) => (
            <div key={group.label} className="ua-dd-group">

              {/* ── UPDATED: use group.path ── */}
              <NavLink
                to={group.path}
                className="ua-dd-group-label-link"
                onClick={onCategoryClick}
              >
                {group.label}
                <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: 4, flexShrink: 0 }}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </NavLink>

              {/* ── UPDATED: use item.path ── */}
              {group.items.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className="ua-dd-item"
                  role="menuitem"
                  onClick={onItemClick}
                >
                  <span className="ua-dd-icon">{item.icon}</span>
                  <span className="ua-dd-item-label">{item.label}</span>
                </NavLink>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>,
    document.body
  );
};

/* ─────────────────────────────────────────────────────────────
   MOBILE ACCORDION
───────────────────────────────────────────────────────────── */
const MobileAccordion = ({ isOpen, onItemClick, onCategoryClick }) => (
  <div className={`ua-acc-body${isOpen ? " open" : ""}`}>
    {SERVICE_CATEGORIES.map((col) =>
      col.groups.map((group) => (
        <div key={group.label} className="ua-acc-section">

          {/* ── UPDATED: use group.path ── */}
          <NavLink
            to={group.path}
            className="ua-acc-section-label-link"
            onClick={onCategoryClick}
          >
            {group.label}
            <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </NavLink>

          {/* ── UPDATED: use item.path ── */}
          {group.items.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className="ua-acc-item"
              onClick={onItemClick}
            >
              <span className="ua-acc-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </div>
      ))
    )}
  </div>
);

/* ─────────────────────────────────────────────────────────────
   MAIN NAVBAR  (unchanged logic — only data paths updated above)
───────────────────────────────────────────────────────────── */
const Navbar = () => {
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [mobileAccOpen, setMobileAccOpen] = useState(false);
  const [searchOpen,    setSearchOpen]    = useState(false);

  const servicesRef    = useRef(null);
  const servicesBtnRef = useRef(null);
  const searchRef      = useRef(null);

  const handleOutsideClick = useCallback((e) => {
    if (servicesRef.current && !servicesRef.current.contains(e.target)) {
      const portalDropdown = document.querySelector(".ua-dropdown");
      if (portalDropdown && portalDropdown.contains(e.target)) return;
      setDropdownOpen(false);
    }
    if (searchRef.current && !searchRef.current.contains(e.target)) {
      setSearchOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [handleOutsideClick]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
        setSearchOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  useEffect(() => {
    const handleScroll = () => { if (dropdownOpen) setDropdownOpen(false); };
    const handleResize = () => { if (dropdownOpen) setDropdownOpen(false); };
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, [dropdownOpen]);

  const closeMobile = () => {
    setMobileOpen(false);
    setMobileAccOpen(false);
    setDropdownOpen(false);
  };

  return (
    <>
      <div className="ua-strip" aria-label="Announcement">
        ✦ Premium Offset &amp; Digital Printing — Crafted with precision since 1998 ✦
      </div>

      <header
        className="ua-nav"
        role="banner"
        style={{
          backgroundImage: `url(${navbarBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="ua-nav-inner">

          <NavLink to="/" className="ua-logo" aria-label="Urasa Arts Home">
            <img src={logo} className="ua-logo-mark" alt="Urasa Arts logo" />
            <div className="ua-logo-text">
              <span className="ua-logo-name">Urasa Arts</span>
            </div>
          </NavLink>

          <nav aria-label="Main navigation">
            <ul className="ua-nav-links">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <li key={link.label} ref={servicesRef}>
                    <button
                      ref={servicesBtnRef}
                      className={`ua-nav-btn${dropdownOpen ? " active" : ""}`}
                      onClick={() => setDropdownOpen((v) => !v)}
                      aria-haspopup="true"
                      aria-expanded={dropdownOpen}
                    >
                      {link.label}
                      <ChevronIcon rotated={dropdownOpen} />
                    </button>
                    <ServicesDropdown
                      isOpen={dropdownOpen}
                      anchorRef={servicesBtnRef}
                      onItemClick={() => setDropdownOpen(false)}
                      onCategoryClick={() => setDropdownOpen(false)}
                    />
                  </li>
                ) : (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) => `ua-nav-link${isActive ? " active" : ""}`}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="ua-nav-right">
            <div className="ua-search-container" ref={searchRef}>
              {searchOpen ? (
                <SearchBox onClose={() => setSearchOpen(false)} />
              ) : (
                <button
                  className="ua-search-toggle"
                  onClick={() => setSearchOpen(true)}
                  aria-label="Open search"
                >
                  <SearchIcon />
                  <span>Search</span>
                </button>
              )}
            </div>

            <NavLink to="/contact" className="ua-btn-quote" aria-label="Request a print quote">
              <QuoteIcon />
              Request Quote
            </NavLink>

            <button
              className={`ua-hamburger${mobileOpen ? " open" : ""}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </header>

      <div
        className={`ua-mobile-menu${mobileOpen ? " open" : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <div className="ua-mobile-overlay" onClick={closeMobile} aria-hidden="true" />
        <div
          className="ua-mobile-drawer"
          style={{
            backgroundImage: `url(${navbarBg})`,
            backgroundSize: "cover",
            backgroundPosition: "center center",
          }}
        >
          <div className="ua-mobile-header">
            <span className="ua-mobile-header-title">Urasa Arts</span>
            <button className="ua-mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
          </div>

          <div className="ua-mobile-search-wrap">
            <SearchBox onClose={closeMobile} />
          </div>

          <nav aria-label="Mobile navigation">
            <ul className="ua-mobile-links">
              {NAV_LINKS.map((link) =>
                link.hasDropdown ? (
                  <li key={link.label}>
                    <button
                      className="ua-mobile-acc-btn"
                      onClick={() => setMobileAccOpen((v) => !v)}
                      aria-expanded={mobileAccOpen}
                    >
                      {link.label}
                      <ChevronIcon rotated={mobileAccOpen} />
                    </button>
                    <MobileAccordion
                      isOpen={mobileAccOpen}
                      onItemClick={closeMobile}
                      onCategoryClick={closeMobile}
                    />
                  </li>
                ) : (
                  <li key={link.label}>
                    <NavLink
                      to={link.to}
                      end={link.to === "/"}
                      className={({ isActive }) => `ua-mobile-link${isActive ? " active" : ""}`}
                      onClick={closeMobile}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                )
              )}
            </ul>
          </nav>

          <div className="ua-mobile-cta">
            <NavLink to="/contact" className="ua-btn-quote" onClick={closeMobile}>
              <QuoteIcon />
              Request a Quote
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;





// import { useState, useEffect, useRef, useCallback } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { createPortal } from "react-dom";
// import "./Navbar.css";
// import logo from "../../assets/images/logo/logo.png";
// import navbarBg from "../../assets/images/nav/bg.jpg";

// /* ─────────────────────────────────────────────────────────────
//    ICONS8 HELPER
//    Usage: <I8 name="book" size={18} />
//    All icons use Fluency style (colorful 3D).
//    Full list: https://icons8.com/icons/set/fluency
// ───────────────────────────────────────────────────────────── */
// const I8 = ({ name, size = 20, alt = "" }) => (
//   <img
//     src={`https://img.icons8.com/fluency/${size * 2}/${name}.png`}
//     width={size}
//     height={size}
//     alt={alt}
//     style={{ display: "inline-block", verticalAlign: "middle", flexShrink: 0 }}
//     loading="lazy"
//   />
// );

// /* ─────────────────────────────────────────────────────────────
//    DATA — All services with Icons8 names
// ───────────────────────────────────────────────────────────── */
// export const SERVICE_CATEGORIES = [
//   {
//     col: 0,
//     groups: [
//       {
//         label: "Publish & Editorial",
//         slug: "publish-editorial",
//         path: "/services/publish-editorial",
//         icon8: "open-book",
//         items: [
//           { icon8: "bookmark-book",    label: "Saddle Booklet",             path: "/services/publish-editorial/saddle-booklet" },
//           { icon8: "book",             label: "Coffee Table Book",           path: "/services/publish-editorial/coffee-table-book" },
//           { icon8: "documents",        label: "Perfect Bound Booklet",       path: "/services/publish-editorial/perfect-bound-booklet" },
//           { icon8: "spiral-bound",     label: "Spiral / Comb Coil Booklet",  path: "/services/publish-editorial/spiral-comb-coil-booklet" },
//           { icon8: "hardcover-book",   label: "Hard Cover Booklet",          path: "/services/publish-editorial/hard-cover-booklet" },
//         ],
//       },
//       {
//         label: "Academic & Educational",
//         slug: "academic-educational",
//         path: "/services/academic-educational",
//         icon8: "graduation-cap",
//         items: [
//           { icon8: "literature",       label: "Textbook",         path: "/services/academic-educational/textbook" },
//           { icon8: "notebook",         label: "Notebook",          path: "/services/academic-educational/notebook" },
//           { icon8: "paint-palette",    label: "Artbook / Drawing", path: "/services/academic-educational/artbook-drawing" },
//           { icon8: "registry-editor",  label: "Ledger Register",   path: "/services/premium-packaging/ledger-register" },
//         ],
//       },
//     ],
//   },
//   {
//     col: 1,
//     groups: [
//       {
//         label: "Premium Packaging",
//         slug: "premium-packaging",
//         path: "/services/premium-packaging",
//         icon8: "gift",
//         items: [
//           { icon8: "box",              label: "Offset Packaging",  path: "/services/premium-packaging/offset-packaging" },
//         ],
//       },
//       {
//         label: "Corporate Identities",
//         slug: "corporate-identities",
//         path: "/services/corporate-identities",
//         icon8: "briefcase",
//         items: [
//           { icon8: "business-card",    label: "Business Cards",         path: "/services/corporate-identities/business-cards" },
//           { icon8: "vip",              label: "Premium Business Cards", path: "/services/corporate-identities/premium-business-cards" },
//           { icon8: "folder",           label: "Files & Folders",        path: "/services/corporate-identities/files-folders" },
//           { icon8: "diary",            label: "Diaries",                path: "/services/corporate-identities/diaries" },
//           { icon8: "calendar",         label: "Calendar",               path: "/services/corporate-identities/calendar" },
//           { icon8: "document",         label: "Letterheads",            path: "/services/corporate-identities/letterheads" },
//           { icon8: "envelope",         label: "Envelopes",              path: "/services/corporate-identities/envelopes" },
//         ],
//       },
//     ],
//   },
//   {
//     col: 2,
//     groups: [
//       {
//         label: "Specialty Cards & Invites",
//         slug: "specialty-cards",
//         path: "/services/specialty-cards",
//         icon8: "love-letter",
//         items: [
//           { icon8: "postcard",         label: "Postcards",                 path: "/services/specialty-cards/postcards" },
//           { icon8: "greeting-card",    label: "Greeting Cards",            path: "/services/specialty-cards/greeting-cards" },
//           { icon8: "diamond-ring",     label: "Invitation / Wedding Cards",path: "/services/specialty-cards/invitation-wedding-cards" },
//         ],
//       },
//       {
//         label: "Marketing Collateral",
//         slug: "marketing-collateral",
//         path: "/services/marketing-collateral",
//         icon8: "advertising",
//         items: [
//           { icon8: "magazine",         label: "Magazines",    path: "/services/marketing-collateral/magazines" },
//           { icon8: "brochure",         label: "Brochures",    path: "/services/marketing-collateral/brochures" },
//           { icon8: "catalogue",        label: "Catalogues",   path: "/services/marketing-collateral/catalogues" },
//           { icon8: "document",         label: "Pamphlets",    path: "/services/marketing-collateral/pamphlets" },
//           { icon8: "shopping-bag",     label: "Shopping Bags",path: "/services/marketing-collateral/shopping-bags" },
//         ],
//       },
//     ],
//   },
// ];

// /* Flat list of every service item for search */
// const ALL_SERVICES = SERVICE_CATEGORIES.flatMap((col) =>
//   col.groups.flatMap((group) =>
//     group.items.map((item) => ({
//       ...item,
//       category: group.label,
//       categorySlug: group.slug,
//       categoryPath: group.path,
//     }))
//   )
// );

// /* All category labels for search */
// const ALL_CATEGORIES = SERVICE_CATEGORIES.flatMap((col) =>
//   col.groups.map((group) => ({
//     label: group.label,
//     slug: group.slug,
//     path: group.path,
//     icon8: group.icon8 || "folder",
//     isCategory: true,
//   }))
// );

// const NAV_LINKS = [
//   { label: "Home",     to: "/" },
//   { label: "Services", to: "/services", hasDropdown: true },
//   { label: "About",    to: "/about" },
//   { label: "Blog",     to: "/blog" },
//   { label: "Contact",  to: "/contact" },
// ];

// /* ─────────────────────────────────────────────────────────────
//    ICONS (SVG — unchanged)
// ───────────────────────────────────────────────────────────── */
// const ChevronIcon = ({ rotated }) => (
//   <svg className={`ua-chevron${rotated ? " rotated" : ""}`} viewBox="0 0 24 24" aria-hidden="true">
//     <polyline points="6 9 12 15 18 9" />
//   </svg>
// );

// const QuoteIcon = () => (
//   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//     <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
//   </svg>
// );

// const SearchIcon = () => (
//   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//     <circle cx="11" cy="11" r="8" />
//     <line x1="21" y1="21" x2="16.65" y2="16.65" />
//   </svg>
// );

// const CloseSmIcon = () => (
//   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true">
//     <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
//   </svg>
// );

// /* ─────────────────────────────────────────────────────────────
//    SEARCH BOX COMPONENT
// ───────────────────────────────────────────────────────────── */
// const SearchBox = ({ onClose }) => {
//   const [query,   setQuery]   = useState("");
//   const [results, setResults] = useState([]);
//   const [focused, setFocused] = useState(false);
//   const [portalStyle, setPortalStyle] = useState({});

//   const inputRef = useRef(null);
//   const wrapRef  = useRef(null);
//   const navigate = useNavigate();

//   useEffect(() => { inputRef.current?.focus(); }, []);

//   useEffect(() => {
//     const q = query.trim().toLowerCase();
//     if (!q) { setResults([]); return; }

//     const matchedCategories = ALL_CATEGORIES.filter((c) =>
//       c.label.toLowerCase().includes(q)
//     );
//     const matchedItems = ALL_SERVICES.filter((s) =>
//       s.label.toLowerCase().includes(q) ||
//       s.category.toLowerCase().includes(q)
//     );
//     const catLabels     = new Set(matchedCategories.map((c) => c.label));
//     const filteredItems = matchedItems.filter((s) => !catLabels.has(s.category));
//     setResults([...matchedCategories, ...filteredItems].slice(0, 10));
//   }, [query]);

//   const calcPortalPos = useCallback(() => {
//     if (!wrapRef.current) return;
//     const rect    = wrapRef.current.getBoundingClientRect();
//     const vw      = window.innerWidth;
//     const PADDING = 8;
//     let w    = Math.max(260, Math.min(rect.width, 420));
//     let left = rect.left;
//     if (left + w > vw - PADDING) left = vw - w - PADDING;
//     left = Math.max(PADDING, left);
//     setPortalStyle({ position: "fixed", top: rect.bottom + 4, left, width: w, zIndex: 99999 });
//   }, []);

//   useEffect(() => {
//     if (results.length === 0 && !query.trim()) return;
//     calcPortalPos();
//     window.addEventListener("resize", calcPortalPos);
//     return () => window.removeEventListener("resize", calcPortalPos);
//   }, [results, query, calcPortalPos]);

//   const handleSelect = (result) => {
//     const destination = result.path || result.categoryPath || "/services";
//     navigate(destination);
//     setQuery("");
//     setResults([]);
//     onClose?.();
//   };

//   const handleKey = (e) => { if (e.key === "Escape") onClose?.(); };

//   const ResultsPortal = () => {
//     if (!query.trim()) return null;
//     if (results.length === 0) {
//       return createPortal(
//         <div className="ua-search-empty-portal" style={portalStyle}>
//           No services found for "<strong>{query}</strong>"
//         </div>,
//         document.body
//       );
//     }
//     return createPortal(
//       <ul className="ua-search-results-portal" id="ua-search-results" role="listbox" style={portalStyle}>
//         {results.map((result, i) => (
//           <li
//             key={i}
//             className={`ua-search-result-item${result.isCategory ? " is-category" : ""}`}
//             role="option"
//             onMouseDown={() => handleSelect(result)}
//           >
//             <span className="ua-result-icon">
//               <I8 name={result.icon8 || "document"} size={18} alt={result.label} />
//             </span>
//             <span className="ua-result-text">
//               <span className="ua-result-label">{result.label}</span>
//               {!result.isCategory && (
//                 <span className="ua-result-category">{result.category}</span>
//               )}
//             </span>
//             {result.isCategory && <span className="ua-result-badge">Category</span>}
//           </li>
//         ))}
//       </ul>,
//       document.body
//     );
//   };

//   return (
//     <div className="ua-search-wrap" ref={wrapRef}>
//       <div className={`ua-search-box${focused ? " focused" : ""}`}>
//         <span className="ua-search-icon"><SearchIcon /></span>
//         <input
//           ref={inputRef}
//           type="text"
//           className="ua-search-input"
//           placeholder="Search services…"
//           value={query}
//           onChange={(e) => setQuery(e.target.value)}
//           onFocus={() => setFocused(true)}
//           onBlur={() => setTimeout(() => setFocused(false), 200)}
//           onKeyDown={handleKey}
//           aria-label="Search services"
//           aria-autocomplete="list"
//           aria-controls="ua-search-results"
//         />
//         {query && (
//           <button
//             className="ua-search-clear"
//             onClick={() => { setQuery(""); setResults([]); inputRef.current?.focus(); }}
//             aria-label="Clear search"
//           >
//             <CloseSmIcon />
//           </button>
//         )}
//       </div>
//       <ResultsPortal />
//     </div>
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    DESKTOP MEGA DROPDOWN
// ───────────────────────────────────────────────────────────── */
// const ServicesDropdown = ({ isOpen, anchorRef, onItemClick, onCategoryClick }) => {
//   const [style, setStyle] = useState({});

//   const calcStyle = useCallback(() => {
//     if (!isOpen || !anchorRef?.current) return;
//     const rect    = anchorRef.current.getBoundingClientRect();
//     const vw      = window.innerWidth;
//     const PADDING = 12;
//     let dropWidth;
//     if      (vw >= 1600) dropWidth = Math.min(1100, vw - PADDING * 2);
//     else if (vw >= 1440) dropWidth = Math.min(1000, vw - PADDING * 2);
//     else if (vw >= 1280) dropWidth = Math.min(920,  vw - PADDING * 2);
//     else if (vw >= 1024) dropWidth = Math.min(820,  vw - PADDING * 2);
//     else                 dropWidth = vw - PADDING * 2;

//     let left = rect.left + rect.width / 2 - dropWidth / 2;
//     left = Math.max(PADDING, Math.min(left, vw - dropWidth - PADDING));

//     let cols;
//     if      (dropWidth >= 700) cols = 3;
//     else if (dropWidth >= 440) cols = 2;
//     else                       cols = 1;

//     setStyle({
//       position: "fixed", top: rect.bottom + 6, left, width: dropWidth,
//       zIndex: 9999, gridTemplateColumns: `repeat(${cols}, 1fr)`,
//     });
//   }, [isOpen, anchorRef]);

//   useEffect(() => {
//     calcStyle();
//     window.addEventListener("resize", calcStyle);
//     return () => window.removeEventListener("resize", calcStyle);
//   }, [calcStyle]);

//   if (!isOpen) return null;

//   return createPortal(
//     <div className={`ua-dropdown${isOpen ? " open" : ""}`} style={style} role="menu" aria-label="Services menu">
//       <span className="ua-dd-header">Our Service Categories</span>
//       {SERVICE_CATEGORIES.map((col) => (
//         <div key={col.col} className="ua-dd-col">
//           {col.groups.map((group) => (
//             <div key={group.label} className="ua-dd-group">

//               <NavLink
//                 to={group.path}
//                 className="ua-dd-group-label-link"
//                 onClick={onCategoryClick}
//               >
//                 {/* Icons8 category icon */}
//                 <I8 name={group.icon8 || "folder"} size={16} alt={group.label} />
//                 <span style={{ marginLeft: 6 }}>{group.label}</span>
//                 <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: "auto", flexShrink: 0 }}>
//                   <polyline points="9 18 15 12 9 6" />
//                 </svg>
//               </NavLink>

//               {group.items.map((item) => (
//                 <NavLink
//                   key={item.label}
//                   to={item.path}
//                   className="ua-dd-item"
//                   role="menuitem"
//                   onClick={onItemClick}
//                 >
//                   {/* Icons8 item icon */}
//                   <span className="ua-dd-icon">
//                     <I8 name={item.icon8} size={18} alt={item.label} />
//                   </span>
//                   <span className="ua-dd-item-label">{item.label}</span>
//                 </NavLink>
//               ))}
//             </div>
//           ))}
//         </div>
//       ))}
//     </div>,
//     document.body
//   );
// };

// /* ─────────────────────────────────────────────────────────────
//    MOBILE ACCORDION
// ───────────────────────────────────────────────────────────── */
// const MobileAccordion = ({ isOpen, onItemClick, onCategoryClick }) => (
//   <div className={`ua-acc-body${isOpen ? " open" : ""}`}>
//     {SERVICE_CATEGORIES.map((col) =>
//       col.groups.map((group) => (
//         <div key={group.label} className="ua-acc-section">

//           <NavLink
//             to={group.path}
//             className="ua-acc-section-label-link"
//             onClick={onCategoryClick}
//           >
//             <I8 name={group.icon8 || "folder"} size={16} alt={group.label} />
//             <span style={{ marginLeft: 6 }}>{group.label}</span>
//             <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true" style={{ marginLeft: "auto" }}>
//               <polyline points="9 18 15 12 9 6" />
//             </svg>
//           </NavLink>

//           {group.items.map((item) => (
//             <NavLink
//               key={item.label}
//               to={item.path}
//               className="ua-acc-item"
//               onClick={onItemClick}
//             >
//               <span className="ua-acc-icon">
//                 <I8 name={item.icon8} size={18} alt={item.label} />
//               </span>
//               {item.label}
//             </NavLink>
//           ))}
//         </div>
//       ))
//     )}
//   </div>
// );

// /* ─────────────────────────────────────────────────────────────
//    MAIN NAVBAR
// ───────────────────────────────────────────────────────────── */
// const Navbar = () => {
//   const [dropdownOpen,  setDropdownOpen]  = useState(false);
//   const [mobileOpen,    setMobileOpen]    = useState(false);
//   const [mobileAccOpen, setMobileAccOpen] = useState(false);
//   const [searchOpen,    setSearchOpen]    = useState(false);

//   const servicesRef    = useRef(null);
//   const servicesBtnRef = useRef(null);
//   const searchRef      = useRef(null);

//   const handleOutsideClick = useCallback((e) => {
//     if (servicesRef.current && !servicesRef.current.contains(e.target)) {
//       const portalDropdown = document.querySelector(".ua-dropdown");
//       if (portalDropdown && portalDropdown.contains(e.target)) return;
//       setDropdownOpen(false);
//     }
//     if (searchRef.current && !searchRef.current.contains(e.target)) {
//       setSearchOpen(false);
//     }
//   }, []);

//   useEffect(() => {
//     document.addEventListener("mousedown", handleOutsideClick);
//     return () => document.removeEventListener("mousedown", handleOutsideClick);
//   }, [handleOutsideClick]);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "Escape") {
//         setDropdownOpen(false);
//         setMobileOpen(false);
//         setSearchOpen(false);
//       }
//     };
//     document.addEventListener("keydown", onKey);
//     return () => document.removeEventListener("keydown", onKey);
//   }, []);

//   useEffect(() => {
//     document.body.style.overflow = mobileOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [mobileOpen]);

//   useEffect(() => {
//     const handleScroll = () => { if (dropdownOpen) setDropdownOpen(false); };
//     const handleResize = () => { if (dropdownOpen) setDropdownOpen(false); };
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     window.addEventListener("resize", handleResize);
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//       window.removeEventListener("resize", handleResize);
//     };
//   }, [dropdownOpen]);

//   const closeMobile = () => {
//     setMobileOpen(false);
//     setMobileAccOpen(false);
//     setDropdownOpen(false);
//   };

//   return (
//     <>
//       <div className="ua-strip" aria-label="Announcement">
//         ✦ Premium Offset &amp; Digital Printing — Crafted with precision since 1998 ✦
//       </div>

//       <header
//         className="ua-nav"
//         role="banner"
//         style={{
//           backgroundImage: `url(${navbarBg})`,
//           backgroundSize: "cover",
//           backgroundPosition: "center center",
//           backgroundRepeat: "no-repeat",
//         }}
//       >
//         <div className="ua-nav-inner">

//           <NavLink to="/" className="ua-logo" aria-label="Urasa Arts Home">
//             <img src={logo} className="ua-logo-mark" alt="Urasa Arts logo" />
//             <div className="ua-logo-text">
//               <span className="ua-logo-name">Urasa Arts</span>
//             </div>
//           </NavLink>

//           <nav aria-label="Main navigation">
//             <ul className="ua-nav-links">
//               {NAV_LINKS.map((link) =>
//                 link.hasDropdown ? (
//                   <li key={link.label} ref={servicesRef}>
//                     <button
//                       ref={servicesBtnRef}
//                       className={`ua-nav-btn${dropdownOpen ? " active" : ""}`}
//                       onClick={() => setDropdownOpen((v) => !v)}
//                       aria-haspopup="true"
//                       aria-expanded={dropdownOpen}
//                     >
//                       {link.label}
//                       <ChevronIcon rotated={dropdownOpen} />
//                     </button>
//                     <ServicesDropdown
//                       isOpen={dropdownOpen}
//                       anchorRef={servicesBtnRef}
//                       onItemClick={() => setDropdownOpen(false)}
//                       onCategoryClick={() => setDropdownOpen(false)}
//                     />
//                   </li>
//                 ) : (
//                   <li key={link.label}>
//                     <NavLink
//                       to={link.to}
//                       end={link.to === "/"}
//                       className={({ isActive }) => `ua-nav-link${isActive ? " active" : ""}`}
//                     >
//                       {link.label}
//                     </NavLink>
//                   </li>
//                 )
//               )}
//             </ul>
//           </nav>

//           <div className="ua-nav-right">
//             <div className="ua-search-container" ref={searchRef}>
//               {searchOpen ? (
//                 <SearchBox onClose={() => setSearchOpen(false)} />
//               ) : (
//                 <button
//                   className="ua-search-toggle"
//                   onClick={() => setSearchOpen(true)}
//                   aria-label="Open search"
//                 >
//                   <SearchIcon />
//                   <span>Search</span>
//                 </button>
//               )}
//             </div>

//             <NavLink to="/contact" className="ua-btn-quote" aria-label="Request a print quote">
//               <QuoteIcon />
//               Request Quote
//             </NavLink>

//             <button
//               className={`ua-hamburger${mobileOpen ? " open" : ""}`}
//               onClick={() => setMobileOpen((v) => !v)}
//               aria-label={mobileOpen ? "Close menu" : "Open menu"}
//               aria-expanded={mobileOpen}
//             >
//               <span /><span /><span />
//             </button>
//           </div>
//         </div>
//       </header>

//       <div
//         className={`ua-mobile-menu${mobileOpen ? " open" : ""}`}
//         role="dialog"
//         aria-modal="true"
//         aria-label="Navigation menu"
//       >
//         <div className="ua-mobile-overlay" onClick={closeMobile} aria-hidden="true" />
//         <div
//           className="ua-mobile-drawer"
//           style={{
//             backgroundImage: `url(${navbarBg})`,
//             backgroundSize: "cover",
//             backgroundPosition: "center center",
//           }}
//         >
//           <div className="ua-mobile-header">
//             <span className="ua-mobile-header-title">Urasa Arts</span>
//             <button className="ua-mobile-close" onClick={closeMobile} aria-label="Close menu">✕</button>
//           </div>

//           <div className="ua-mobile-search-wrap">
//             <SearchBox onClose={closeMobile} />
//           </div>

//           <nav aria-label="Mobile navigation">
//             <ul className="ua-mobile-links">
//               {NAV_LINKS.map((link) =>
//                 link.hasDropdown ? (
//                   <li key={link.label}>
//                     <button
//                       className="ua-mobile-acc-btn"
//                       onClick={() => setMobileAccOpen((v) => !v)}
//                       aria-expanded={mobileAccOpen}
//                     >
//                       {link.label}
//                       <ChevronIcon rotated={mobileAccOpen} />
//                     </button>
//                     <MobileAccordion
//                       isOpen={mobileAccOpen}
//                       onItemClick={closeMobile}
//                       onCategoryClick={closeMobile}
//                     />
//                   </li>
//                 ) : (
//                   <li key={link.label}>
//                     <NavLink
//                       to={link.to}
//                       end={link.to === "/"}
//                       className={({ isActive }) => `ua-mobile-link${isActive ? " active" : ""}`}
//                       onClick={closeMobile}
//                     >
//                       {link.label}
//                     </NavLink>
//                   </li>
//                 )
//               )}
//             </ul>
//           </nav>

//           <div className="ua-mobile-cta">
//             <NavLink to="/contact" className="ua-btn-quote" onClick={closeMobile}>
//               <QuoteIcon />
//               Request a Quote
//             </NavLink>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;