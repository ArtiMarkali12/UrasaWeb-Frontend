// import React, { useState } from "react";
// import "./BusinessCard.css";
// import booklet1 from "../../assets/images/servicesImage/businesscard.png";
// import booklet2 from "../../assets/images/servicesImage/businesscard.png";
// import booklet3 from "../../assets/images/servicesImage/businesscard.png";
// import booklet4 from "../../assets/images/servicesImage/businesscard.png";    


// const bookletData = [
//   {
//     id: 1,
//     image: booklet1,
//     cover: "Uncoated",
//     grammage: "100 GSM",
//   },
//   {
//     id: 2,
//     image: booklet2,
//     cover: "Glossy",
//     grammage: "130 GSM",
//   },
//   {
//     id: 3,
//     image: booklet3,
//     cover: "Matte",
//     grammage: "170 GSM",
//   },
//   {
//     id: 4,
//     image: booklet4,
//     cover: "Premium",
//     grammage: "250 GSM",
//   },
// ];

// const BusinessCard = () => {
//   const [activeIndex, setActiveIndex] = useState(0);
//   const current = bookletData[activeIndex];

//   return (
//     <div className="business-container">
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         Services &gt; Publishing & Editorial &gt;{" "}
//         <span>Business Card</span>
//       </div>

//       {/* Title */}
//       <h1 className="title">Business Card</h1>

//       {/* Description */}
//       <p className="description">
//         Engineered for both creative and academic excellence, our Saddle Stitch
//         Booklets provide a sleek, durable, and lightweight binding solution.
//         Perfect for high-end product catalogs, corporate magazines, and
//         high-volume educational workbooks. We combine exact folding precision
//         with premium paper stocks and vibrant ink coverage.
//       </p>

//       {/* Main Section */}
//       <div className="corporate-card">
        
//         {/* WHITE CARD AREA */}
//         <div className="image-wrapper">
          
//           {/* Image */}
//           <div className="image-section">
//             <img
//               src={current.image}
//               alt="corporateindentity"
//               className="bcard-image fade"
//             />
//           </div>

//           {/* Details */}
//           <div className="details-section">
//             <div>
//               <h4>Cover</h4>
//               <p>{current.cover}</p>
//             </div>

//             <div>
//               <h4>Grammage</h4>
//               <p>{current.grammage}</p>
//             </div>
//           </div>

//         </div>

//         {/* Pagination */}
//         <div className="pagination">
//           {bookletData.map((item, index) => (
//             <span
//               key={item.id}
//               className={activeIndex === index ? "active" : ""}
//               onClick={() => setActiveIndex(index)}
//             >
//               {item.id}
//             </span>
//           ))}
//         </div>

//       </div>
      
//     </div>
//   );
// };

// export default BusinessCard;

import React, { useState, useRef, useEffect } from "react";
import "./BusinessCard.css";
import CorporateQoute from "./CorporateQoute";

import booklet1 from "../../assets/images/servicesImage/businesscard.png";
import booklet2 from "../../assets/images/servicesImage/businesscard.png";
import booklet3 from "../../assets/images/servicesImage/businesscard.png";
import booklet4 from "../../assets/images/servicesImage/businesscard.png";

// ── Size images — replace with your actual paths ──────────────────────────
import usSize     from "../../assets/images/servicesImage/ussize.png";
import europeSize from "../../assets/images/servicesImage/Europe.png";
import japanSize  from "../../assets/images/servicesImage/japan.png";
import squareSize from "../../assets/images/servicesImage/square.png";
import circleSize from "../../assets/images/servicesImage/circle.png";
import foldedCard from "../../assets/images/servicesImage/square.png";
import miniCard   from "../../assets/images/servicesImage/square.png";
import customCard from "../../assets/images/servicesImage/square.png";


const bookletData = [
  { id: 1, image: booklet1, cover: "Uncoated", grammage: "100 GSM" },
  { id: 2, image: booklet2, cover: "Glossy",   grammage: "130 GSM" },
  { id: 3, image: booklet3, cover: "Matte",    grammage: "170 GSM" },
  { id: 4, image: booklet4, cover: "Premium",  grammage: "250 GSM" },
];

// Static size options — label & dimensions go to admin with the quote
const sizeOptions = [
  { id: 1, label: "US Size",     dimensions: '3.5" X 2"',     image: usSize     },
  { id: 2, label: "Europe Size", dimensions: '3.35" X 2.17"', image: europeSize },
  { id: 3, label: "Japan Size",  dimensions: '3.58" X 2.17"', image: japanSize  },
  { id: 4, label: "Square",      dimensions: '2.5" X 2.5"',   image: squareSize },
  { id: 5, label: "Circle",      dimensions: '2.5" X 2.5"',   image: circleSize },
  { id: 6, label: "Folded Card", dimensions: '3.5" X 4"',     image: foldedCard },
  { id: 7, label: "Mini Card",   dimensions: '3.5" X 1"',     image: miniCard   },
  { id: 8, label: "Custom",      dimensions: '3.5" X 2"',     image: customCard },
  // Add more: { id: 9, label: "New Size", dimensions: 'W" X H"', image: newImg },
];

const BusinessCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null); // null = nothing chosen yet
  const [scrollPos, setScrollPos]       = useState(0);
  const carouselRef                     = useRef(null);
  const current                         = bookletData[activeIndex];
  const scrollAmount                    = 200;

  const canScrollLeft  = scrollPos > 0;
  const canScrollRight = carouselRef.current
    ? scrollPos < carouselRef.current.scrollWidth - carouselRef.current.clientWidth - 1
    : true;

  const doScrollLeft  = () => carouselRef.current?.scrollBy({ left: -scrollAmount, behavior: "smooth" });
  const doScrollRight = () => carouselRef.current?.scrollBy({ left:  scrollAmount, behavior: "smooth" });

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => setScrollPos(el.scrollLeft);
    el.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="business-container">

      {/* Breadcrumb */}
      <div className="breadcrumb">
        Services &gt; Publishing &amp; Editorial &gt;{" "}
        <span>Business Card</span>
      </div>

      {/* Title */}
      <h1 className="bc-title">Business Card</h1>

      {/* Description */}
      <p className="bc-description">
        Engineered for both creative and academic excellence, our Business Cards
        provide a sleek, durable, and lightweight solution. Perfect for high-end
        product catalogs, corporate identities, and high-volume workbooks. We
        combine exact folding precision with premium paper stocks and vibrant ink
        coverage, ensuring a flawless, professional finish that represents your
        brand perfectly on the global stage.
      </p>

      {/* Image viewer card */}
      <div className="corporate-card">
        <div className="image-wrapper">
          <div className="image-section">
            <img
              src={current.image}
              alt="business card preview"
              className="bcard-image fade"
              key={activeIndex}
            />
          </div>
          <div className="details-section">
            <div>
              <h4>Cover</h4>
              <p>{current.cover}</p>
            </div>
            <div>
              <h4>Grammage</h4>
              <p>{current.grammage}</p>
            </div>
          </div>
        </div>

        <div className="pagination">
          {bookletData.map((item, index) => (
            <span
              key={item.id}
              className={activeIndex === index ? "active" : ""}
              onClick={() => setActiveIndex(index)}
            >
              {item.id}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════ */}
      {/* Step 1 — Size Selector (static)           */}
      {/* ══════════════════════════════════════════ */}
      <div className="bq-section">
        <p className="bq-header-text">
          Fill information as per your requirements to complete the steps and get your quote !
        </p>

        <div className="bq-step-block">
          <div className="bq-step-number">1.</div>

          <div className="bq-card">
            <p className="bq-card-title">Business Card</p>

            <div className="bq-carousel-row">
              <button
                className={`bq-arrow${!canScrollLeft ? " bq-arrow-disabled" : ""}`}
                onClick={doScrollLeft}
                aria-label="Scroll left"
              >&#8249;</button>

              <div className="bq-carousel-track" ref={carouselRef}>
                {sizeOptions.map((option) => (
                  <div
                    key={option.id}
                    className={`bq-size-item${selectedSize?.id === option.id ? " bq-size-item--selected" : ""}`}
                    onClick={() => setSelectedSize(option)}
                  >
                    <div className="bq-img-wrapper">
                      <img
                        src={option.image}
                        alt={option.label}
                        className="bq-size-img"
                      />
                    </div>
                    <span className="bq-size-label">{option.label}</span>
                    <span className="bq-size-dim">{option.dimensions}</span>
                  </div>
                ))}
              </div>

              <button
                className={`bq-arrow${!canScrollRight ? " bq-arrow-disabled" : ""}`}
                onClick={doScrollRight}
                aria-label="Scroll right"
              >&#8250;</button>
            </div>

            {/* Inline validation hint */}
            {selectedSize === null && (
              <p className="bq-size-hint">Please select a size to continue.</p>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* Steps 2–4 + Submit — separate dynamic component       */}
      {/* ══════════════════════════════════════════════════════ */}
      <CorporateQoute selectedSize={selectedSize} />

    </div>
  );
};

export default BusinessCard;