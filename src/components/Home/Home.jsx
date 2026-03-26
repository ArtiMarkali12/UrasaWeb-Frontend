import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Home.css";
import Testimonials from "./Testimonials";

// ── HERO CAROUSEL IMAGES (3 images) ───────────────────────────
// Replace these with your actual 3 hero images
import heroImage1 from "../../assets/images/HomeImages/hero.jpeg";
import heroImage2 from "../../assets/images/HomeImages/hero.jpeg"; // replace: hero2.jpeg
import heroImage3 from "../../assets/images/HomeImages/hero.jpeg"; // replace: hero3.jpeg

import badge1 from "../../assets/images/HomeImages/badge1.png";
import badge2 from "../../assets/images/HomeImages/badge2.png";

import recent1 from "../../assets/images/HomeImages/recent1.png";
import recent2 from "../../assets/images/HomeImages/recent2.png";
import recent3 from "../../assets/images/HomeImages/recent3.png";

// ── SERVICE IMAGES ─────────────────────────────────────────────
import service1  from "../../assets/images/HomeImages/srv1.png";
import service2a from "../../assets/images/HomeImages/srv2a.png";
import service2b from "../../assets/images/HomeImages/srv2b.png";
import service3a from "../../assets/images/HomeImages/srv5a.png";
import service3b from "../../assets/images/HomeImages/srv5b.png";
import service3c from "../../assets/images/HomeImages/srv5c.png";
import service3d from "../../assets/images/HomeImages/srv5d.png";
import service3e from "../../assets/images/HomeImages/srv5e.png";
import service3f from "../../assets/images/HomeImages/srv5f.png";
import service4a from "../../assets/images/HomeImages/srv4a.png";
import service4b from "../../assets/images/HomeImages/srv4b.png";
import service5a from "../../assets/images/HomeImages/srv3a.png";
import service5b from "../../assets/images/HomeImages/srv3b.png";
import service5c from "../../assets/images/HomeImages/srv3c.png";
import service6  from "../../assets/images/HomeImages/srv6.png";

// ── QUALITY STANDARDS ─────────────────────────────────────────
import qs1 from "../../assets/images/HomeImages/qun1.png";
import qs2 from "../../assets/images/HomeImages/qun3.png";
import qs3 from "../../assets/images/HomeImages/qun4.png";
import qs4 from "../../assets/images/HomeImages/qun2.png";

// ── PARTNER LOGOS ─────────────────────────────────────────────
import partner1 from "../../assets/images/HomeImages/partner1.png";
import partner2 from "../../assets/images/HomeImages/partner2.png";
import partner3 from "../../assets/images/HomeImages/partner3.png";
import partner4 from "../../assets/images/HomeImages/partner4.png";
import partner5 from "../../assets/images/HomeImages/partner5.png";
import partner6 from "../../assets/images/HomeImages/partner6.png";
import partner7 from "../../assets/images/HomeImages/partner7.png";
import partner8 from "../../assets/images/HomeImages/partner8.png";

/* ─────────────────────────────────────────────────────────────
   HERO CAROUSEL DATA
   Each slide has its own image + optional headline/sub override.
   interval: auto-advance every 7 seconds (within 5–10s range).
───────────────────────────────────────────────────────────── */
const HERO_SLIDES = [
  {
    id: 1,
    image: heroImage1,
    alt:   "Urasa Arts printing facility — slide 1",
  },
  {
    id: 2,
    image: heroImage2,
    alt:   "Urasa Arts printing facility — slide 2",
  },
  {
    id: 3,
    image: heroImage3,
    alt:   "Urasa Arts printing facility — slide 3",
  },
];

const SLIDE_INTERVAL = 7000; // 7 seconds — within 5–10s range

/* ─────────────────────────────────────────────────────────────
   SERVICES DATA
───────────────────────────────────────────────────────────── */
const services = [
  {
    id: 1, type: "single",
    images: [{ src: service1, cls: "sl-solo" }],
    title: "Publishing & Editorials",
  },
  {
    id: 2, type: "dual2",
    images: [
      { src: service2a, cls: "sl-left" },
      { src: service2b, cls: "sl-right" },
    ],
    title: "Premium Packaging",
  },
  {
    id: 3, type: "six",
    images: [
      { src: service3a, cls: "sl-6-tl" },
      { src: service3b, cls: "sl-6-tc" },
      { src: service3c, cls: "sl-6-tr" },
      { src: service3d, cls: "sl-6-bl" },
      { src: service3e, cls: "sl-6-bc" },
      { src: service3f, cls: "sl-6-br" },
    ],
    title: "Corporate Identities",
  },
  {
    id: 4, type: "dual4",
    images: [
      { src: service4a, cls: "sl-left" },
      { src: service4b, cls: "sl-right" },
    ],
    title: "Academic & Educational",
  },
  // {
  //   id: 5, type: "triple",
  //   images: [
  //     { src: service5a, cls: "sl-tl" },
  //     { src: service5b, cls: "sl-tc" },
  //     { src: service5c, cls: "sl-tr" },
  //   ],
  //   title: "Specialty Cards & Invites",
  // },

     {
     id: 5, type: "triple",
     images: [
       { src: service5a, cls: "sl-tl" },   
       { src: service5b, cls: "sl-tc" },   
       { src: service5a, cls: "sl-tr" },  
     ],
     title: "Specialty Cards & Invites",
   },
  {
    id: 6, type: "single",
    images: [{ src: service6, cls: "sl-solo" }],
    title: "Marketing Collateral",
  },
];

const qualityFeatures = [
  { id: 1, image: qs1, title: "Durable & Accurate Colours" },
  { id: 2, image: qs2, title: "Premium Binding & Adhesives" },
  { id: 3, image: qs3, title: "FSC Certified Papers & Inks" },
  { id: 4, image: qs4, title: "Anti-Piracy" },
];

const partners = [
  { id: 1, image: partner1, alt: "Komori" },
  { id: 2, image: partner2, alt: "Wohlenberg" },
  { id: 3, image: partner3, alt: "Heidelberg" },
  { id: 4, image: partner4, alt: "Polar" },
  { id: 5, image: partner5, alt: "Siegwerk Druckfarben" },
  { id: 6, image: partner6, alt: "Hubergroup Print Solutions" },
  { id: 7, image: partner7, alt: "Toyo Ink" },
  { id: 8, image: partner8, alt: "TechNova" },
];

/* ─────────────────────────────────────────────────────────────
   HERO CAROUSEL COMPONENT
───────────────────────────────────────────────────────────── */
const HeroCarousel = () => {
  const [current,  setCurrent]  = useState(0);
  const [prev,     setPrev]     = useState(null);
  const [paused,   setPaused]   = useState(false);
  const [progress, setProgress] = useState(0);

  const timerRef    = useRef(null);
  const progressRef = useRef(null);
  const startTime   = useRef(null);

  const total = HERO_SLIDES.length;

  /* Go to a specific slide */
  const goTo = useCallback((idx) => {
    setCurrent((cur) => {
      setPrev(cur);
      return idx;
    });
    setProgress(0);
    startTime.current = performance.now();
  }, []);

  const next = useCallback(() => {
    goTo((current + 1) % total);
  }, [current, total, goTo]);

  const goToIdx = useCallback((idx) => {
    if (idx === current) return;
    goTo(idx);
  }, [current, goTo]);

  /* Auto-advance timer */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(next, SLIDE_INTERVAL);
    return () => clearTimeout(timerRef.current);
  }, [current, paused, next]);

  /* Progress bar animation */
  useEffect(() => {
    if (paused) { cancelAnimationFrame(progressRef.current); return; }
    startTime.current = performance.now();

    const tick = (now) => {
      const elapsed = now - startTime.current;
      setProgress(Math.min((elapsed / SLIDE_INTERVAL) * 100, 100));
      progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [current, paused]);

  /* Keyboard navigation */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft")  goTo((current - 1 + total) % total);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, total, next, goTo]);

  return (
    <section
      className="hero-banner"
      aria-label="Hero Carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ── SLIDES ─────────────────────────────────────────── */}
      <div className="hero-slides" aria-live="polite">
        {HERO_SLIDES.map((slide, idx) => {
          const isActive = idx === current;
          const isPrev   = idx === prev;
          return (
            <div
              key={slide.id}
              className={`hero-slide${isActive ? " is-active" : ""}${isPrev ? " is-prev" : ""}`}
              aria-hidden={!isActive}
            >
              <img
                src={slide.image}
                alt={slide.alt}
                className="hero-img"
                loading={idx === 0 ? "eager" : "lazy"}
              />
            </div>
          );
        })}
      </div>

      {/* ── GRADIENT OVERLAY ──────────────────────────────── */}
      <div className="hero-overlay" aria-hidden="true" />

      {/* ── CONTENT ───────────────────────────────────────── */}
      <div className="hero-inner">
        <div className="hero-content" key={current}>
          <p className="hero-eyebrow">Delivering Quality</p>
          <h1 className="hero-heading">Since 1998</h1>
          <p className="hero-body">
            Easily create a pixel-perfect online presentation for your prints
            <br className="hero-br" />
            and elevate your business to the next level today!
          </p>
          <a href="/quote" className="hero-cta">Request a Quote</a>
        </div>
      </div>

      {/* ── CONTROLS ──────────────────────────────────────── */}
      {/* Prev arrow */}
      <button
        className="hero-arrow hero-arrow--prev"
        onClick={() => goTo((current - 1 + total) % total)}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow */}
      <button
        className="hero-arrow hero-arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* ── DOT INDICATORS + PROGRESS ─────────────────────── */}
      <div className="hero-dots" role="tablist" aria-label="Slide indicators">
        {HERO_SLIDES.map((slide, idx) => (
          <button
            key={slide.id}
            className={`hero-dot${idx === current ? " is-active" : ""}`}
            onClick={() => goToIdx(idx)}
            role="tab"
            aria-selected={idx === current}
            aria-label={`Go to slide ${idx + 1}`}
          >
            {/* Progress fill on active dot */}
            {idx === current && (
              <span
                className="hero-dot-fill"
                style={{ width: `${progress}%` }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── SLIDE COUNTER ─────────────────────────────────── */}
      <div className="hero-counter" aria-hidden="true">
        <span className="hero-counter-current">{String(current + 1).padStart(2, "0")}</span>
        <span className="hero-counter-sep"> / </span>
        <span className="hero-counter-total">{String(total).padStart(2, "0")}</span>
      </div>
    </section>
  );
};

/* ─────────────────────────────────────────────────────────────
   CLIENT LOGOS IMPORTS
   ─────────────────────────────────────────────────────────────
   HOW TO ADD MORE LOGOS IN FUTURE:
   Step 1: Import new logo
           import client17 from "../../assets/images/HomeImages/client17.png";
   Step 2: Add to CLIENT_ROWS below in whichever row you want
           { id: 17, src: client17, alt: "Client Name" }
   Step 3: Done! No other changes needed.
   ─────────────────────────────────────────────────────────────
   HOW TO ADD A NEW ROW IN FUTURE:
   Add a new object to CLIENT_ROWS array below with:
   { id: 6, logos: [ ...your logos... ] }
   Row direction alternates automatically (odd=ltr, even=rtl)
───────────────────────────────────────────────────────────── */
import client1  from "../../assets/images/HomeImages/client1.png";
import client2  from "../../assets/images/HomeImages/client2.png";
import client3  from "../../assets/images/HomeImages/client3.png";
import client4  from "../../assets/images/HomeImages/client4.png";
import client5  from "../../assets/images/HomeImages/client5.png";
import client6  from "../../assets/images/HomeImages/client6.png";
import client7  from "../../assets/images/HomeImages/client7.png";
import client8  from "../../assets/images/HomeImages/client8.png";
import client9  from "../../assets/images/HomeImages/client9.png";
import client10 from "../../assets/images/HomeImages/client10.png";
import client11 from "../../assets/images/HomeImages/client11.png";
import client12 from "../../assets/images/HomeImages/client12.png";
import client13 from "../../assets/images/HomeImages/client13.png";
import client14 from "../../assets/images/HomeImages/client14.png";
import client15 from "../../assets/images/HomeImages/client15.png";
import client16 from "../../assets/images/HomeImages/client16.png";
import client17 from "../../assets/images/HomeImages/client17.png";
import client18 from "../../assets/images/HomeImages/client18.png";
import client19 from "../../assets/images/HomeImages/client19.png";
import client20 from "../../assets/images/HomeImages/client20.png";
import client21 from "../../assets/images/HomeImages/client21.png";
import client22 from "../../assets/images/HomeImages/client22.png";
import client23 from "../../assets/images/HomeImages/client23.png";
import client24 from "../../assets/images/HomeImages/client24.png";
import client25 from "../../assets/images/HomeImages/client25.png";
import client26 from "../../assets/images/HomeImages/client26.png";
import client27 from "../../assets/images/HomeImages/client27.png";
import client28 from "../../assets/images/HomeImages/client28.png";
import client29 from "../../assets/images/HomeImages/client29.png";
import client30 from "../../assets/images/HomeImages/client30.png";
import client31 from "../../assets/images/HomeImages/client31.png";
import client32 from "../../assets/images/HomeImages/client32.png";
import client33 from "../../assets/images/HomeImages/client33.png";
import client34 from "../../assets/images/HomeImages/client34.png";
import client35 from "../../assets/images/HomeImages/client35.png";
import client36 from "../../assets/images/HomeImages/client36.png";
import client37 from "../../assets/images/HomeImages/client37.png";
import client38 from "../../assets/images/HomeImages/client38.png";
import client39 from "../../assets/images/HomeImages/client39.png";
import client40 from "../../assets/images/HomeImages/client40.png";
import client41 from "../../assets/images/HomeImages/client41.png";
import client42 from "../../assets/images/HomeImages/client42.png";
import client43 from "../../assets/images/HomeImages/client43.png";
import client44 from "../../assets/images/HomeImages/client44.png";
import client45 from "../../assets/images/HomeImages/client45.png";
import client46 from "../../assets/images/HomeImages/client46.png";
import client47 from "../../assets/images/HomeImages/client47.png";
import client48 from "../../assets/images/HomeImages/client48.png";
import client49 from "../../assets/images/HomeImages/client49.png";
import client50 from "../../assets/images/HomeImages/client50.png";
import client51 from "../../assets/images/HomeImages/client51.png";
import client52 from "../../assets/images/HomeImages/client52.png";
import client53 from "../../assets/images/HomeImages/client53.png";
import client54 from "../../assets/images/HomeImages/client54.png";
import client55 from "../../assets/images/HomeImages/client55.png";
import client56 from "../../assets/images/HomeImages/client56.png";
import client57 from "../../assets/images/HomeImages/client57.png";
import client58 from "../../assets/images/HomeImages/client58.png";
import client59 from "../../assets/images/HomeImages/client59.png";
import client60 from "../../assets/images/HomeImages/client60.png";
import client61 from "../../assets/images/HomeImages/client61.png";
import client62 from "../../assets/images/HomeImages/client62.png";
import client63 from "../../assets/images/HomeImages/client63.png";
import client64 from "../../assets/images/HomeImages/client64.png";
import client65 from "../../assets/images/HomeImages/client65.png";
import client66 from "../../assets/images/HomeImages/client66.png";
import client67 from "../../assets/images/HomeImages/client67.png";
import client68 from "../../assets/images/HomeImages/client68.png";
import client69 from "../../assets/images/HomeImages/client69.png";
import client70 from "../../assets/images/HomeImages/client70.png";
import client71 from "../../assets/images/HomeImages/client71.png";
import client72 from "../../assets/images/HomeImages/client72.png";
import client73 from "../../assets/images/HomeImages/client73.png";
import client74 from "../../assets/images/HomeImages/client74.png";
import client75 from "../../assets/images/HomeImages/client75.png";
import client76 from "../../assets/images/HomeImages/client76.png";
import client77 from "../../assets/images/HomeImages/client77.png";
import client78 from "../../assets/images/HomeImages/client78.png";
import client79 from "../../assets/images/HomeImages/client79.png";
import client80 from "../../assets/images/HomeImages/client80.png";
import client81 from "../../assets/images/HomeImages/client81.png";
import client82 from "../../assets/images/HomeImages/client82.png";
import client83 from "../../assets/images/HomeImages/client83.png";
import client84 from "../../assets/images/HomeImages/client84.png";
import client85 from "../../assets/images/HomeImages/client85.png";
import client86 from "../../assets/images/HomeImages/client86.png";
import client87 from "../../assets/images/HomeImages/client87.png";
import client88 from "../../assets/images/HomeImages/client88.png";
import client89 from "../../assets/images/HomeImages/client89.png";
import client90 from "../../assets/images/HomeImages/client90.png";
import client91 from "../../assets/images/HomeImages/client91.png";
import client92 from "../../assets/images/HomeImages/client92.png";
import client93 from "../../assets/images/HomeImages/client93.png";
import client94 from "../../assets/images/HomeImages/client94.png";
import client95 from "../../assets/images/HomeImages/client95.png";
import client96 from "../../assets/images/HomeImages/client96.png";
import client97 from "../../assets/images/HomeImages/client97.png";



// Future: import client18 from "../../assets/images/HomeImages/client17.png";

/* ─────────────────────────────────────────────────────────────
   CLIENT_ROWS — 5 LAYERS
   ─────────────────────────────────────────────────────────────
   प्रत्येक layer ला स्वतःचे specific logos आहेत.
   Odd layers (1,3,5) → LEFT scroll
   Even layers (2,4)  → RIGHT scroll  ← zigzag between layers
   Within each layer  → odd logos UP, even logos DOWN (CSS)

   ✅ FUTURE: नवीन logo त्याच layer मध्ये add करायला:
      त्या layer च्या logos array मध्ये एक entry add करा.

   ✅ FUTURE: नवीन layer add करायला:
      खालच्या pattern प्रमाणे नवीन object add करा.
      Direction आपोआप alternate होईल.
───────────────────────────────────────────────────────────── */
const CLIENT_ROWS = [

  /* ════════════════════════════════════════════════════════
     LAYER 1 — big corporations 
     Scrolls: LEFT →
     Add more: { id: "r1-5", src: clientXX, alt: "Company Name" }
  ════════════════════════════════════════════════════════ */
  {
    id: 1,
    label: "Big Corporations",
    logos: [
      { id: "r1-1", src: client1,  alt: "Client 1"  },
      { id: "r1-2", src: client2,  alt: "Client 2"  },
      { id: "r1-3", src: client3,  alt: "Client 3"  },
      { id: "r1-4", src: client4,  alt: "Client 4"  },
       { id: "r1-5", src: client5,  alt: "Client 5"  },
      { id: "r1-6", src: client6,  alt: "Client 6"  },
      { id: "r1-7", src: client7,  alt: "Client 7"  },
      { id: "r1-8", src: client8,  alt: "Client 8"  },
        { id: "r1-9", src: client9,  alt: "Client 9"  },
      { id: "r1-10", src: client10, alt: "Client 10" },
        { id: "r1-11", src: client11, alt: "Client 11" },
      { id: "r1-12", src: client12, alt: "Client 12" },
        { id: "r1-13", src: client13, alt: "Client 13" },
      { id: "r1-14", src: client14, alt: "Client 14" },
        { id: "r1-15", src: client15, alt: "Client 15" },
      { id: "r1-16", src: client16, alt: "Client 16" },
       { id: "r1-17", src: client17, alt: "Client 17" },
        { id: "r1-18", src: client18, alt: "Client 18" },

      // Future: { id: "r1-9", src: client17, alt: "Company Name" },
    ],
  },

  /* ════════════════════════════════════════════════════════
     LAYER 2 — banks
     Scrolls: RIGHT ←
     Add more: { id: "r2-5", src: clientXX, alt: "Corporate Name" }
  ════════════════════════════════════════════════════════ */
  {
    id: 2,
    label: "Banks",
    logos: [
      { id: "r2-1", src: client19,  alt: "Client 19"  }, 
      { id: "r2-2", src: client20,  alt: "Client 20"  },
      { id: "r2-3", src: client21,  alt: "Client 21"  },
      { id: "r2-4", src: client22,  alt: "Client 22"  },
       { id: "r2-5", src: client23,  alt: "Client 23"  },
      { id: "r2-6", src: client24,  alt: "Client 24"  },
      { id: "r2-7", src: client25,  alt: "Client 25"  },
      { id: "r2-8", src: client26,  alt: "Client 26"  },
       { id: "r2-9", src: client27,  alt: "Client 27"  },
      { id: "r2-10", src: client28, alt: "Client 28" },   
        { id: "r2-11", src: client29, alt: "Client 29" },
        { id: "r2-12", src: client30, alt: "Client 30" },
      // Future: { id: "r2-5", src: client18, alt: "Corporate Name" },
    ],
  },

  /* ════════════════════════════════════════════════════════
     LAYER 3 —builders
     Scrolls: LEFT →
     Add more: { id: "r3-5", src: clientXX, alt: "Institution Name" }
  ════════════════════════════════════════════════════════ */
  {
    id: 3,
    label: "Builders",
    logos: [
      

        { id: "r3-1", src: client31, alt: "Client 31" },
        { id: "r3-2", src: client32, alt: "Client 32" },
        { id: "r3-3", src: client33, alt: "Client 33" },
        { id: "r3-4", src: client34, alt: "Client 34" },
        { id: "r3-5", src: client35, alt: "Client 35" },
        { id: "r3-6", src: client36, alt: "Client 36" },
          { id: "r3-7", src: client37, alt: "Client 37" },
        { id: "r3-8", src: client38, alt: "Client 38" },
          { id: "r3-9", src: client39, alt: "Client 39" },
        { id: "r3-10", src: client40, alt: "Client 40" },
        { id: "r3-11", src: client41, alt: "Client 41" },
        { id: "r3-12", src: client42, alt: "Client 42" },
        { id: "r3-13", src: client43, alt: "Client 43" },
        { id: "r3-14", src: client44, alt: "Client 44" },
        { id: "r3-15", src: client45, alt: "Client 45" },
        { id: "r3-16", src: client46, alt: "Client 46" },
        { id: "r3-17", src: client47, alt: "Client 47" },
        { id: "r3-18", src: client48, alt: "Client 48" },
          { id: "r3-19", src: client49, alt: "Client 49" },
        { id: "r3-20", src: client50, alt: "Client 50" },
        { id: "r3-21", src: client51, alt: "Client 51" },
        { id: "r3-22", src: client52, alt: "Client 52" },
        { id: "r3-23", src: client53, alt: "Client 53" },
        { id: "r3-24", src: client54, alt: "Client 54" }, 
      // Future: { id: "r3-5", src: client19, alt: "Institution Name" },
    ],
  },

  /* ════════════════════════════════════════════════════════
     LAYER 4 — mid corporations
     Scrolls: RIGHT ←
     Add more: { id: "r4-5", src: clientXX, alt: "Brand Name" }
  ════════════════════════════════════════════════════════ */
  {
    id: 4,
    label: "Mid Corporations",
    logos: [
      // { id: "r4-1", src: client13, alt: "Client 13" },
      // { id: "r4-2", src: client14, alt: "Client 14" },
      // { id: "r4-3", src: client15, alt: "Client 15" },
      // { id: "r4-4", src: client16, alt: "Client 16" },
        { id: "r4-1", src: client55, alt: "Client 55" },
        { id: "r4-2", src: client56, alt: "Client 56" },
        { id: "r4-3", src: client57, alt: "Client 57" },
        { id: "r4-4", src: client58, alt: "Client 58" },  
        { id: "r4-5", src: client59, alt: "Client 59" },
        { id: "r4-6", src: client60, alt: "Client 60" },
        { id: "r4-7", src: client61, alt: "Client 61" },
        { id: "r4-8", src: client62, alt: "Client 62" },
        { id: "r4-9", src: client63, alt: "Client 63" },
          { id: "r4-10", src: client64, alt: "Client 64" },
        { id: "r4-11", src: client65, alt: "Client 65" },
          { id: "r4-12", src: client66, alt: "Client 66" },
        { id: "r4-13", src: client67, alt: "Client 67" },
        { id: "r4-14", src: client68, alt: "Client 68" }, 
        { id: "r4-15", src: client69, alt: "Client 69" },
          { id: "r4-16", src: client70, alt: "Client 70" },
        { id: "r4-17", src: client71, alt: "Client 71" },
          { id: "r4-18", src: client72, alt: "Client 72" },
        { id: "r4-19", src: client73, alt: "Client 73" },
          { id: "r4-20", src: client74, alt: "Client 74" },
        { id: "r4-21", src: client75, alt: "Client 75" },
        { id: "r4-22", src: client76, alt: "Client 76" },
      // Future: { id: "r4-5", src: client20, alt: "Brand Name" },
    ],
  },

  /* ════════════════════════════════════════════════════════
     LAYER 5 — Banking / Finance Logos
     Scrolls: LEFT →
     Add more: { id: "r5-5", src: clientXX, alt: "Bank Name" }
  ════════════════════════════════════════════════════════ */
  {
    id: 5,
    label: "small brands",
    logos: [
      { id: "r5-1", src: client77, alt: "Client 77" },
      { id: "r5-2", src: client78, alt: "Client 78" },
      { id: "r5-3", src: client79, alt: "Client 79" },  
      { id: "r5-4", src: client80, alt: "Client 80" },
       { id: "r5-5", src: client81, alt: "Client 81" },
      { id: "r5-6", src: client82, alt: "Client 82" },
      { id: "r5-7", src: client83, alt: "Client 83" },  
      { id: "r5-8", src: client84, alt: "Client 84" },
      { id: "r5-9", src: client85, alt: "Client 85" },
      { id: "r5-10", src: client86, alt: "Client 86" },
        { id: "r5-11", src: client87, alt: "Client 87" },
      { id: "r5-12", src: client88, alt: "Client 88" },
      { id: "r5-13", src: client89, alt: "Client 89" },
      { id: "r5-14", src: client90, alt: "Client 90" },
        { id: "r5-15", src: client91, alt: "Client 91" },
        { id: "r5-16", src: client92, alt: "Client 92" },
      { id: "r5-17", src: client93, alt: "Client 93" },
      { id: "r5-18", src: client94, alt: "Client 94" },
      { id: "r5-19", src: client95, alt: "Client 95" },
      { id: "r5-20", src: client96, alt: "Client 96" },
      { id: "r5-21", src: client97, alt: "Client 97" },
      // Future: { id: "r5-5", src: client21, alt: "Bank Name" },
    ],
  },

  /* ════════════════════════════════════════════════════════
     FUTURE LAYER 6 — New Category
     Scrolls: RIGHT ← (even id = rtl)
     Uncomment and add logos to activate:
  ════════════════════════════════════════════════════════
  {
    id: 6,
    label: "New Category",
    logos: [
      { id: "r6-1", src: client17, alt: "Client Name" },
      { id: "r6-2", src: client18, alt: "Client Name" },
    ],
  },
  */
];

/* ─────────────────────────────────────────────────────────────
   ClientMarqueeRow COMPONENT
   - logos फक्त 2x duplicate — seamless infinite loop साठी
     (1 visible set + 1 hidden set that loops back)
   - Direction: odd row id = ltr, even row id = rtl
   - Zigzag: CSS nth-child handles UP/DOWN within row
───────────────────────────────────────────────────────────── */
const ClientMarqueeRow = ({ id, logos }) => {
  const direction = id % 2 === 1 ? "ltr" : "rtl";

  /* 2 copies only — animation translates -50% for seamless loop */
  const doubled = [...logos, ...logos];

  return (
    <div className={`cs-row cs-row--${direction}`}>
      <div className="cs-track">
        {doubled.map((logo, idx) => (
          <div className="cs-logo-wrap" key={`${logo.id}-${idx}`}>
            <img
              src={logo.src}
              alt={logo.alt}
              className="cs-logo-img"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────────
   HOME PAGE
───────────────────────────────────────────────────────────── */
const Home = () => {
  const [cardsVisible, setCardsVisible] = useState(false);
  const gridRef = useRef(null);

  useEffect(() => {
    const el = gridRef.current;
    if (!el) return;
    const check = () => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight - 80) setCardsVisible(true);
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    return () => window.removeEventListener("scroll", check);
  }, []);

  return (
    <main>
      {/* ── HERO CAROUSEL ───────────────────────────────────── */}
      <HeroCarousel />

      {/* ── CERTIFICATION BAR ───────────────────────────────── */}
      <section className="cert-bar" aria-label="Certifications">
        <div className="cert-inner">
          <div className="cert-text">
            <p className="cert-tagline">
              Easily create a pixel-perfect online presentation for your prints
              and elevate your business to the next level today!
            </p>
          </div>
          <div className="cert-divider" aria-hidden="true" />
          <div className="cert-badges">
            <div className="cert-badge-wrap">
              <img src={badge1} alt="ISO 9001:2015 Certified" className="cert-badge-img" />
            </div>
            <div className="cert-badge-wrap">
              <img src={badge2} alt="ISO 14001 Certified Company" className="cert-badge-img" />
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR SERVICES ────────────────────────────────────── */}
      <section className="svc-section" aria-label="Our Services">
        <div className="svc-inner">
          <div className="svc-header">
            <h2 className="svc-title">Our Services</h2>
            <p className="svc-desc">
              Our Publish &amp; Editorial category offers end-to-end
              manufacturing for booklets that demand to be noticed. From custom
              dimensions that break standard formats to specialized cover
              effects and premium paper textures, every detail is tailored to
              your vision. Whether you require the sleekness of Saddle
              stitching, the durability of Hardbound, or the modern edge of
              Perfect binding, we combine vibrant color precision with
              structural strength to ensure your project is &ldquo;the best of
              its kind.&rdquo;
            </p>
          </div>

          <div className="svc-grid" ref={gridRef}>
            {services.map((svc, index) => (
              <div
                key={svc.id}
                className={`svc-card svc-card--${svc.type}${cardsVisible ? " svc-visible" : ""}`}
                style={{ transitionDelay: cardsVisible ? `${index * 0.1}s` : "0s" }}
                onTouchStart={(e) => e.currentTarget.classList.add("svc-touched")}
                onTouchEnd={(e)   => e.currentTarget.classList.remove("svc-touched")}
              >
                <div className="svc-img-wrap">
                  {svc.images.map((img) => (
                    <img key={img.cls} src={img.src} alt={svc.title} className={`svc-img ${img.cls}`} />
                  ))}
                </div>
                <div className="svc-label">
                  <span className="svc-label-text">{svc.title}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OUR RECENT WORK ─────────────────────────────────── */}
      {/* <section className="recent-section">
        <div className="recent-container">
          <div className="recent-header">
            <h2>Our Recent Work</h2>
            <p>
              Our Publish &amp; Editorial category offers end-to-end manufacturing
              for booklets that demand to be noticed. From custom dimensions
              that break standard formats to specialized cover effects and
              premium paper textures, every detail is tailored to your vision.
            </p>
          </div>
          <div className="recent-grid">
            {[
              { title: "1000 Days" },
              { title: "ICDS Scheme Book 2025" },
              { title: "Unicef 1000 Days of Baby" },
            ].map((item) => (
              <div className="recent-card" key={item.title}>
                <div className="recent-img">
                  <img src={service4b} alt={item.title} />
                </div>
                <div className="recent-title">{item.title}</div>
                <p>Easily create a pixel-perfect online presentation for your prints and elevate your business to the next......</p>
                <span className="read-more">Read More</span>
              </div>
            ))}
          </div>
        </div>
      </section> */}


      {/* ── OUR RECENT WORK ─────────────────────────────────── */}
<section className="recent-section">
  <div className="recent-container">
    <div className="recent-header">
      <h2>Our Recent Work</h2>
      <p>
        Discover our latest print and manufacturing achievements. We continuously update this gallery with our newest projects—from
        complex publishing to premium packaging. Explore our most recent collaborations to stay informed on our evolving capabilities
        and our ongoing commitment to uncompromising precision.
      </p>
    </div>
    <div className="recent-grid">
      {[
        {
          img: recent1,                          // ← image 1 import 
          title: "1000 Days",
          desc: "A beautifully crafted saddle-stitched booklet produced for a government health initiative, featuring vibrant full-colour printing on premium 130gsm coated paper.",
        },
        {
          img: recent2,                          // ← image 2 import
          title: "ICDS Scheme Book 2025",
          desc: "A perfect-bound reference guide designed for the Integrated Child Development Services programme, printed with precision colour matching and a gloss-laminated cover.",
        },
        {
          img: recent3,                          // ← image 3 import 
          title: "Unicef 1000 Days of Baby",
          desc: "A premium hardcover publication developed in collaboration with UNICEF, showcasing child nutrition milestones with rich imagery and high-fidelity offset printing.",
        },
      ].map((item) => (
        <div className="recent-card" key={item.title}>
          <div className="recent-img">
            <img src={item.img} alt={item.title} />
          </div>
          <div className="recent-title">{item.title}</div>
          <p>{item.desc}</p>
          <span className="read-more">Read More</span>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* ── QUALITY STANDARDS ───────────────────────────────── */}
      <section className="qs-section" aria-label="Quality Standards">
        <div className="qs-inner">
          <div className="qs-left">
            <div className="qs-features-grid">
              {qualityFeatures.map((feat) => (
                <div className="qs-feat-card" key={feat.id}>
                  <div className="qs-feat-img-wrap">
                    <img src={feat.image} alt={feat.title} className="qs-feat-img" />
                  </div>
                  <p className="qs-feat-title">{feat.title}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="qs-right">
            <h2 className="qs-title">Quality Standards</h2>
            <p className="qs-desc">
              Our Publish &amp; Editorial category offers end-to-end
              manufacturing for booklets that demand to be noticed. From custom
              dimensions that break standard formats to specialized cover
              effects and premium paper textures, every detail is tailored to
              your vision.
            </p>
            <div className="qs-partners">
              <p className="qs-partners-label">Equipment &amp; Material Partners</p>
              <div className="qs-partners-grid">
                {partners.map((p) => (
                  <div className="qs-partner-item" key={p.id}>
                    <img src={p.image} alt={p.alt} className="qs-partner-img" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CLIENTS SECTION ─────────────────────────────────── */}
      <section className="cs-section" aria-label="Our Clients">
        <div className="cs-inner">
          {/* Inline style guarantees row layout — no CSS conflict */}
          <div
            className="cs-card-outer"
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "stretch",
              background: "#ffffff",
              borderRadius: "20px",
              border: "1px solid #e4eaf6",
              boxShadow: "0 4px 32px rgba(21,53,201,0.08)",
              overflow: "hidden",
              minHeight: "680px",
              width: "100%",
            }}
          >
            {/* LEFT — Blue panel */}
            <div
              className="cs-left"
              style={{ flexShrink: 0, width: "300px", display: "flex" }}
            >
              <div className="cs-card">
                <div className="cs-card-dots" aria-hidden="true" />
                <div className="cs-card-content">
                  <p className="cs-card-eyebrow">Trusted By</p>
                  <h2 className="cs-card-number">150+</h2>
                  <p className="cs-card-label">Clients</p>
                  <p className="cs-card-desc">
                    Easily create a pixel-perfect online presentation for your
                    prints and elevate your business to the next level today!
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT — Zigzag scrolling logo rows */}
            <div
              className="cs-right"
              style={{ flex: 1, minWidth: 0, overflow: "hidden", display: "flex", alignItems: "center" }}
            >
              <div className="cs-rows" style={{ width: "100%" }}>
                {CLIENT_ROWS.map((row) => (
                  <ClientMarqueeRow
                    key={row.id}
                    id={row.id}
                    logos={row.logos}
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
      <Testimonials />
    </main>
  );
};

export default Home;