/**
 * Testimonials.jsx
 *
 * Exact match to screenshot:
 * - "Testimonials" heading top-left
 * - Cards: quote text left + person image right (overflows top)
 * - Blue name bar at bottom of each card
 * - Hover: image + text zoom outward in 2 directions
 * - Dot navigation: 1 · 2 · 3 · 4
 * - Auto-slide every 5s, pause on hover
 * - Responsive: ultra-small → ultra-large
 *
 * Usage in Home.jsx:
 *   import Testimonials from "./Testimonials";
 *   <Testimonials />   ← place after ClientsSection
 *
 * Add CSS:  import "./Testimonials.css";  (already inside this file via className)
 * Or paste Testimonials.css into Home.css bottom.
 */


import React, { useState, useEffect, useRef, useCallback } from "react";
import "./Testimonials.css";

/* ── TESTIMONIALS DATA ────────────────────────────────────────
   Replace image imports with your actual person photos.
   Add more entries to add more cards — dots auto-update.
──────────────────────────────────────────────────────────── */

// Replace these with actual testimonial person images
import t1 from "../../assets/images/HomeImages/badge1.png";
import t2 from "../../assets/images/HomeImages/badge1.png";
import t3 from "../../assets/images/HomeImages/badge1.png";
import t4 from "../../assets/images/HomeImages/badge1.png";

const TESTIMONIALS = [
  {
    id: 1,
    quote:
      "Easily create a pixel-perfect online presentation for your prints and elevate your business to the next......",
    name: "Kailash Pagare (IAS)",
    title: "Commissioner ICDS",
    image: t1,
  },
  {
    id: 2,
    quote:
      "Easily create a pixel-perfect online presentation for your prints and elevate your business to the next......",
    name: "Kailash Pagare",
    title: "Commissioner ICDS",
    image: t2,
  },
  {
    id: 3,
    quote:
      "Easily create a pixel-perfect online presentation for your prints and elevate your business to the next......",
    name: "Kailash Pagare",
    title: "Commissioner ICDS",
    image: t3,
  },
  {
    id: 4,
    quote:
      "Easily create a pixel-perfect online presentation for your prints and elevate your business to the next......",
    name: "Kailash Pagare",
    title: "Commissioner ICDS",
    image: t4,
  },
];

const AUTO_INTERVAL = 5000; // 5 seconds

/* ── SINGLE CARD ─────────────────────────────────────────────── */
const TestimonialCard = ({ item, isActive }) => (
  <div className={`tm-card${isActive ? " tm-card--active" : ""}`}>
    {/* Grid line background */}
    <div className="tm-card-grid" aria-hidden="true" />

    {/* Quote text */}
    <p className="tm-quote">{item.quote}</p>

    {/* Person image — overflows top of card */}
    <div className="tm-img-wrap">
      <img src={item.image} alt={item.name} className="tm-img" />
    </div>

    {/* Blue name bar */}
    <div className="tm-name-bar">
      <span className="tm-name">{item.name}</span>
      <span className="tm-role">{item.title}</span>
    </div>
  </div>
);

/* ── MAIN COMPONENT ──────────────────────────────────────────── */
const Testimonials = () => {
  const [active,  setActive]  = useState(0);
  const [paused,  setPaused]  = useState(false);
  const timerRef              = useRef(null);
  const total                 = TESTIMONIALS.length;

  const goTo = useCallback((idx) => {
    setActive(((idx % total) + total) % total);
  }, [total]);

  /* Auto-advance */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => goTo(active + 1), AUTO_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [active, paused, goTo]);

  return (
    <section
      className="tm-section"
      aria-label="Testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="tm-inner">

        {/* Heading */}
        <h2 className="tm-heading">Testimonials</h2>

        {/* Cards track */}
        <div className="tm-track-wrap">
          <div
            className="tm-cards-row"
            style={{
              transform: `translateX(calc(-${active} * (100% / 2.5 + 24px / 2.5)))`,
              transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          >
            {TESTIMONIALS.map((item, idx) => (
              <TestimonialCard
                key={item.id}
                item={item}
                isActive={idx === active}
              />
            ))}
          </div>
        </div>

        {/* Dot navigation */}
        <div className="tm-dots" role="tablist" aria-label="Testimonial navigation">
          {TESTIMONIALS.map((item, idx) => (
            <button
              key={item.id}
              className={`tm-dot${idx === active ? " tm-dot--active" : ""}`}
              onClick={() => goTo(idx)}
              role="tab"
              aria-selected={idx === active}
              aria-label={`Testimonial ${idx + 1}`}
            >
              {idx + 1}
            </button>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Testimonials;