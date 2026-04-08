import React, { useState } from "react";
import "./Spiral.css";
import booklet1 from "../../assets/images/servicesImage/saddle.png";
import booklet2 from "../../assets/images/servicesImage/saddle.png";
import booklet3 from "../../assets/images/servicesImage/saddle.png";
import booklet4 from "../../assets/images/servicesImage/saddle.png";    
import BookletQuote from "./BookletQuote";

const bookletData = [
  {
    id: 1,
    image: booklet1,
    cover: "Uncoated",
    grammage: "100 GSM",
  },
  {
    id: 2,
    image: booklet2,
    cover: "Glossy",
    grammage: "130 GSM",
  },
  {
    id: 3,
    image: booklet3,
    cover: "Matte",
    grammage: "170 GSM",
  },
  {
    id: 4,
    image: booklet4,
    cover: "Premium",
    grammage: "250 GSM",
  },
];

const Spiral = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = bookletData[activeIndex];

  return (
    <div className="spiral-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Services &gt; Publishing & Editorial &gt;{" "}
        <span>spiral comb coil booklet</span>
      </div>

      {/* Title */}
      <h1 className="title">Spiral Comb Coil Booklet</h1>

      {/* Description */}
      <p className="description">
        Engineered for both creative and academic excellence, our Saddle Stitch
        Booklets provide a sleek, durable, and lightweight binding solution.
        Perfect for high-end product catalogs, corporate magazines, and
        high-volume educational workbooks. We combine exact folding precision
        with premium paper stocks and vibrant ink coverage.
      </p>

      {/* Main Section */}
      <div className="booklet-card">
        
        {/* WHITE CARD AREA */}
        <div className="image-wrapper">
          
          {/* Image */}
          <div className="image-section">
            <img
              src={current.image}
              alt="Booklet"
              className="book-image fade"
            />
          </div>

          {/* Details */}
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

        {/* Pagination */}
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
      <BookletQuote/>
    </div>
  );
};

export default Spiral;