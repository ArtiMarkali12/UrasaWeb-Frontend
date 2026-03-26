// import React, { useState } from "react";
// import "./saddlebooklet.css";

// // ── Import your booklet images ────────────────────────────
// // Place images in: src/assets/booklets/
// // booklet-1.png, booklet-2.png, booklet-3.png, booklet-4.png

// import booklet1 from "../../assets/images/HomeImages/srv4a.png";
// import booklet2 from "../../assets/images/HomeImages/srv4a.png";
// import booklet3 from "../../assets/images/HomeImages/srv4a.png";
// import booklet4 from "../../assets/images/HomeImages/srv4a.png";

// const variants = [
//   { id: 1, cover: "Uncoated", grammage: "100 GSM", image: booklet1, alt: "Saddle booklet uncoated" },
//   { id: 2, cover: "Gloss",    grammage: "130 GSM", image: booklet2, alt: "Saddle booklet gloss"    },
//   { id: 3, cover: "Matte",    grammage: "150 GSM", image: booklet3, alt: "Saddle booklet matte"    },
//   { id: 4, cover: "Silk",     grammage: "170 GSM", image: booklet4, alt: "Saddle booklet silk"     },
// ];

// export default function SaddleBooklet() {
//   const [active, setActive] = useState(0);
//   const cur = variants[active];

//   return (
//     <div className="sb">

//       {/* breadcrumb */}
//       <p className="sb__crumb">
//         <span>Services</span>
//         <span className="sb__crumb-sep">›</span>
//         <span>Publishing &amp; Editorial</span>
//         <span className="sb__crumb-sep">›</span>
//         <a href="#" className="sb__crumb-link">Saddle Booklet</a>
//       </p>

//       {/* title */}
//       <h1 className="sb__title">Saddle Booklet</h1>

//       {/* description */}
//       <p className="sb__desc">
//         Engineered for both creative and academic excellence, our Saddle Stitch
//         Booklets provide a sleek, durable, and lightweight binding solution.
//         Perfect for high-end product catalogs, corporate magazines, and
//         high-volume educational workbooks. We combine exact folding precision
//         with premium paper stocks and vibrant ink coverage, ensuring a flawless,
//         professional finish that represents your brand perfectly on the global
//         stage.
//       </p>

//       {/* card — full width, flush edges */}
//       <div className="sb__card">

//         {/* image + specs centred together */}
//         <div className="sb__body">
//           <div className="sb__imgbox">
//             <img
//               key={cur.id}
//               src={cur.image}
//               alt={cur.alt}
//               className="sb__img"
//               draggable={false}
//             />
//           </div>

//           <div className="sb__specs">
//             <div className="sb__spec">
//               <span className="sb__spec-lbl">Cover</span>
//               <span className="sb__spec-val">{cur.cover}</span>
//             </div>
//             <div className="sb__spec">
//               <span className="sb__spec-lbl">Grammage</span>
//               <span className="sb__spec-val">{cur.grammage}</span>
//             </div>
//           </div>
//         </div>

//         {/* dots — plain filled circles, NO numbers, NO rings */}
//         <div className="sb__dots" role="tablist" aria-label="Select variant">
//           {variants.map((v, i) => (
//             <button
//               key={v.id}
//               type="button"
//               role="tab"
//               aria-selected={i === active}
//               aria-label={v.cover}
//               className={`sb__dot${i === active ? " sb__dot--on" : ""}`}
//               onClick={() => setActive(i)}
//             />
//           ))}
//         </div>

//       </div>
//     </div>
//   );
// }


// import React, { useState } from "react";
// import "./saddlebooklet.css";

// import booklet1 from "../../assets/images/servicesImage/saddle.png";
// import booklet2 from "../../assets/images/servicesImage/saddle.png";
// import booklet3 from "../../assets/images/servicesImage/saddle.png";
// import booklet4 from "../../assets/images/servicesImage/saddle.png";
// const bookletData = [
//   {
//     id: 1,
//     image:booklet1,
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

// const SaddleBooklet = () => {
//   const [activeIndex, setActiveIndex] = useState(0);

//   const current = bookletData[activeIndex];

//   return (
//     <div className="saddle-container">
//       {/* Breadcrumb */}
//       <div className="breadcrumb">
//         Services &gt; Publishing & Editorial &gt; <span>Saddle Booklet</span>
//       </div>

//       {/* Title */}
//       <h1 className="title">Saddle Booklet</h1>

//       {/* Description */}
//       <p className="description">
//         Engineered for both creative and academic excellence, our Saddle Stitch
//         Booklets provide a sleek, durable, and lightweight binding solution.
//         Perfect for high-end product catalogs, corporate magazines, and
//         high-volume educational workbooks.
//       </p>

//       {/* Card */}
//       <div className="booklet-card">
//         {/* Image */}
//         <div className="image-section">
//           <img
//             src={current.image}
//             alt="Booklet"
//             className="book-image fade"
//           />
//         </div>

//         {/* Details */}
//         <div className="details-section">
//           <div>
//             <h4>Cover</h4>
//             <p>{current.cover}</p>
//           </div>

//           <div>
//             <h4>Grammage</h4>
//             <p>{current.grammage}</p>
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

// export default SaddleBooklet;



import React, { useState } from "react";
import "./saddlebooklet.css";
import booklet1 from "../../assets/images/servicesImage/saddle.png";
import booklet2 from "../../assets/images/servicesImage/saddle.png";
import booklet3 from "../../assets/images/servicesImage/saddle.png";
import booklet4 from "../../assets/images/servicesImage/saddle.png";    

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

const SaddleBooklet = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const current = bookletData[activeIndex];

  return (
    <div className="saddle-container">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        Services &gt; Publishing & Editorial &gt;{" "}
        <span>Saddle Booklet</span>
      </div>

      {/* Title */}
      <h1 className="title">Saddle Booklet</h1>

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
    </div>
  );
};

export default SaddleBooklet;