import React, { useState } from "react";
import "./BusinessCard.css";
import BusinessCardQuote from "./BusinessCardQuote";

import booklet1 from "../../assets/images/servicesImage/businesscard.png";
import booklet2 from "../../assets/images/servicesImage/businesscard.png";
import booklet3 from "../../assets/images/servicesImage/businesscard.png";
import booklet4 from "../../assets/images/servicesImage/businesscard.png";

const bookletData = [
  { id: 1, image: booklet1, cover: "Uncoated", grammage: "100 GSM" },
  { id: 2, image: booklet2, cover: "Glossy", grammage: "130 GSM" },
  { id: 3, image: booklet3, cover: "Matte", grammage: "170 GSM" },
  { id: 4, image: booklet4, cover: "Premium", grammage: "250 GSM" },
];

const BusinessCard = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = bookletData[activeIndex];

  return (
    <div className="business-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Services &gt; Publishing &amp; Editorial &gt; <span>Business Card</span>
      </div>

      {/* Title */}
      <h1 className="bc-title">Business Card</h1>

      {/* Description */}
      <p className="bc-description">
        Engineered for both creative and academic excellence, our Business Cards
        provide a sleek, durable, and lightweight solution. Perfect for high-end
        product catalogs, corporate identities, and high-volume workbooks. We
        combine exact folding precision with premium paper stocks and vibrant
        ink coverage, ensuring a flawless, professional finish that represents
        your brand perfectly on the global stage.
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

      {/* Form Section */}
      <BusinessCardQuote />
    </div>
  );
};

export default BusinessCard;
