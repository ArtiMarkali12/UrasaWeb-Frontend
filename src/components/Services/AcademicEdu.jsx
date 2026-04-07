


import { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./AcademicEdu.css";
import saddleimg from "../../assets/images/products/saddle.png";
import coffeeimg from "../../assets/images/products/coffee.png";
import perfectimg from "../../assets/images/products/perfect.png";
import spiralimg from "../../assets/images/products/spiral.png";
import hardimg from "../../assets/images/products/hard.png";

const PRODUCTS = [
  {
    id: "saddle-booklet",
    label: "Saddle Booklet",
    path: "/services/academic-edu/saddle-booklet",
    image: saddleimg,
    description: "A saddle booklet consists of folded sheets nested together and stapled through the center spine.",
    tip: "Your total page count must be a multiple of four, as each folded sheet creates four individual pages.",
  },
  {
    id: "coffee-table-book",
    label: "Coffee Table",
    path: "/services/academic-edu/coffee-table-book",
    image: coffeeimg,
    description: "A coffee table book is a visual-led volume in any size—from grand to compact. Designed for easy browsing, it serves as tactile decor that showcases art, photography, or niche interests.",
    tip: `Choose "lay-flat" binding and high-quality paper to ensure the book stays open easily and feels premium to the touch.`,
  },
  {
    id: "perfect-bound-booklet",
    label: "Perfect Bound",
    path: "/services/academic-edu/perfect-bound-booklet",
    image: perfectimg,
    description: `Perfect binding uses a strong adhesive to attach pages to a wraparound cover, creating a crisp, professional square spine. Ideal for thicker booklets, it provides a high-end, bookstore-quality finish for catalogs or manuals.`,
    tip: `Keep important text 10mm away from the spine; perfect binding doesn't lay completely flat, and content can get "lost" in the gutter.`,
  },
  {
    id: "spiral-comb-coil-booklet",
    label: "Spiral / Wire-o Booklet",
    path: "/services/academic-edu/spiral-comb-coil-booklet",
    image: spiralimg,
    description: `Spiral or Wire-O binding uses a coil or metal loops to secure pages, allowing them to lay 360-degree flat.`,
    tip: "Keep text 12mm away from the binding edge so the punch holes don't cut into your design or content.",
  },
  {
    id: "hard-cover-booklet",
    label: "Hard Cover Booklet",
    path: "/services/academic-edu/hard-cover-booklet",
    image: hardimg,
    description: "A premium option featuring a rigid cover for a sophisticated, polished finish. Durable and elegant, it is ideal for bespoke catalogs or keepsakes in any size.",
    tip: "Include a wide gutter margin so content isn't lost in the binding.",
  },
];

const ProductCard = ({ product, openId, setOpenId }) => {
  const cardRef = useRef(null);
  const navigate = useNavigate();
  const isOpen = openId === product.id;

  const handleMouseEnter = () => setOpenId(product.id);
  const handleMouseLeave = () => setOpenId(null);

  const handleCardClick = (e) => {
    if (window.matchMedia("(hover: none)").matches) {
      if (!isOpen) {
        e.preventDefault();
        setOpenId(product.id);
      } else {
        navigate(product.path);
      }
    }
  };

  return (
    <div
      ref={cardRef}
      className={`ae-card${isOpen ? " ae-card--open" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Left: Image area */}
      <NavLink
        to={product.path}
        className="ae-card-left"
        aria-label={`View ${product.label}`}
        tabIndex={-1}
        onClick={handleCardClick}
      >
        <img
          src={product.image}
          alt={product.label}
          className="ae-card-img"
          loading="lazy"
        />
      </NavLink>

      {/* Right: Info panel */}
      <div className="ae-card-right">
        <p className="ae-card-desc">
          <strong>{product.label}</strong> {product.description}
        </p>
        <p className="ae-card-tip">
          <span className="ae-tip-label">Crucial tip : </span>
          {product.tip}
        </p>
      </div>

      {/* Bottom: Blue label bar */}
      <NavLink
        to={product.path}
        className="ae-card-label"
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

const AcademicEdu = () => {
  const [openId, setOpenId] = useState(null);
  const gridRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (gridRef.current && !gridRef.current.contains(e.target)) {
        setOpenId(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <main className="ae-page">

      <nav className="ae-breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/services" className="ae-bc-link">Services</NavLink>
        <span className="ae-bc-sep">&gt;</span>
        <span className="ae-bc-current">Academic &amp; Educational</span>
      </nav>

      <header className="pe-header">
        <h1 className="pe-title">Academic &amp; Educational</h1>
        <p className="pe-desc pe-desc--short">
          Our Academic &amp; Educational category offers end-to-end manufacturing for booklets that demand to be noticed.
        </p>
        <p className="ae-desc ae-desc--long">
          From custom dimensions that break standard formats to specialized cover effects and premium paper textures,
          every detail is tailored to your vision. Whether you require the sleekness of Saddle stitching, the
          durability of Hardbound, or the modern edge of Perfect binding, we combine vibrant color precision with
          structural strength to ensure your project is "the best of its kind."
        </p>
      </header>

      <section className="ae-grid" ref={gridRef} aria-label="Academic products">
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

export default AcademicEdu;
