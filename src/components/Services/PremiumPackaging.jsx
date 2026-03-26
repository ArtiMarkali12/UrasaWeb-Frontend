import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./PremiumPackaging.css";
import saddleimg from "../../assets/images/products/saddle.png";
import coffeeimg from "../../assets/images/products/coffee.png";
import perfectimg from "../../assets/images/products/perfect.png";
import spiralimg from "../../assets/images/products/spiral.png";
import hardimg from "../../assets/images/products/hard.png";

const PRODUCTS = [
  {
    id: "saddle-booklet",
    label: "Saddle Booklet",
    path: "/services/publish-editorial/saddle-booklet",
    image: saddleimg,
    description: "A saddle booklet consists of folded sheets nested together and stapled through the center spine.",
    tip: "Your total page count must be a multiple of four, as each folded sheet creates four individual pages.",
  },
  {
    id: "coffee-table-book",
    label: "Coffee Table",
    path: "/services/publish-editorial/coffee-table-book",
    image: coffeeimg,
    description: "A coffee table book is a large-format, high-quality hardcover book designed to sit on a coffee table and be browsed casually.",
    tip: "Use 170gsm or higher coated paper for vivid image reproduction and a premium feel.",
  },
  {
    id: "perfect-bound-booklet",
    label: "Perfect Bound",
    path: "/services/publish-editorial/perfect-bound-booklet",
    image: perfectimg,
    description: "Perfect bound books have pages glued to a flat spine, giving a clean, professional look similar to paperback novels.",
    tip: "Minimum of 40 pages recommended for a strong spine; thicker spines allow for title text on the spine.",
  },
  {
    id: "spiral-comb-coil-booklet",
    label: "Spiral / Wire-o Booklet",
    path: "/services/publish-editorial/spiral-comb-coil-booklet",
    image: spiralimg,
    description: "Spiral and wire-o booklets use a metal or plastic coil that allows pages to lay completely flat when open.",
    tip: "Ideal for notebooks, recipe books, and manuals where the reader needs the book to stay open hands-free.",
  },
  {
    id: "hard-cover-booklet",
    label: "Hard Cover Booklet",
    path: "/services/publish-editorial/hard-cover-booklet",
    image: hardimg,
    description: "Hardcover booklets feature a rigid board cover wrapped in paper or cloth, offering maximum durability and a premium presentation.",
    tip: "Add embossing, foil stamping, or UV spot coating on the cover to create a truly luxury product.",
  },
];

const ProductCard = ({ product, openId, setOpenId }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const isOpen = openId === product.id;

  // Desktop: hover
  const handleMouseEnter = () => setOpenId(product.id);
  const handleMouseLeave = () => setOpenId(null);

  // Mobile: card image area tap
  // Fix: use onClick instead of onTouchStart to avoid passive listener error
  const handleCardClick = (e) => {
    // Only intercept on touch/mobile — if card is not open yet, open it
    if (window.matchMedia("(hover: none)").matches) {
      if (!isOpen) {
        e.preventDefault(); // safe here — onClick is not passive
        setOpenId(product.id);
      } else {
        // Already open — second tap navigates
        navigate(product.path);
      }
    }
    // Desktop: let NavLink navigate normally (hover handles the animation)
  };

  return (
    <div
      ref={cardRef}
      className={`pe-card${isOpen ? " pe-card--open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left: Image area */}
      <NavLink
        to={product.path}
        className="pe-card-left"
        aria-label={`View ${product.label}`}
        tabIndex={-1}
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.label}
          className="pe-card-img"
          loading="lazy"
        />
      </NavLink>

      {/* Right: Info panel — slides in on hover/tap */}
      <div className="pe-card-right">
        <p className="pe-card-desc">
          <strong>{product.label}</strong> {product.description}
        </p>
        <p className="pe-card-tip">
          <span className="pe-tip-label">Crucial tip : </span>
          {product.tip}
        </p>
      </div>

      {/* Bottom: Blue label bar — always navigates */}
      <NavLink
        to={product.path}
        className="pe-card-label"
        aria-label={`View ${product.label}`}
      >
        <span>{product.label}</span>
        <svg
          width="14" height="14" fill="none" stroke="currentColor"
          strokeWidth="2.5" viewBox="0 0 24 24" aria-hidden="true"
        >
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </NavLink>
    </div>
  );
};

const PremiumPackaging = () => {
  const [openId, setOpenId] = useState(null);
  const gridRef = useRef(null);

  // Close open card when user taps outside the grid (touch only)
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    // Use click instead of touchstart — avoids passive listener issues
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <main className="pe-page">

      <nav className="pe-breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/services" className="pe-bc-link">Services</NavLink>
        <span className="pe-bc-sep">&gt;</span>
        <span className="pe-bc-current">Premium Packaging</span>
      </nav>

      <header className="pe-header">
        <h1 className="pe-title">Premium Packaging</h1>
        <p className="pe-desc pe-desc--short">
          Our Premium Packaging category offers end-to-end manufacturing for booklets that demand to be noticed.
        </p>
        <p className="pe-desc pe-desc--long">
          From custom dimensions that break standard formats to specialized cover effects and premium paper textures,
          every detail is tailored to your vision. Whether you require the sleekness of Saddle stitching, the
          durability of Hardbound, or the modern edge of Perfect binding, we combine vibrant color precision with
          structural strength to ensure your project is "the best of its kind."
        </p>
      </header>

      <section className="pe-grid" ref={gridRef} aria-label="Publishing products">
        {PRODUCTS.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            openId={openId}
            setOpenId={setOpenId}
          />
        ))}
      </section>

    </main>
  );
};

export default PremiumPackaging;
