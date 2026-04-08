// import React, { useState, useRef, useEffect } from "react";
// import "./AcademicQuote.css";

// const COUNTRIES = [
//   "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
//   "Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
//   "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
//   "Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba",
//   "Cyprus","Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
//   "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea",
//   "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica",
//   "Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia",
//   "Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania",
//   "Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
//   "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Panama",
//   "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
//   "Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa",
//   "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
//   "Thailand","Togo","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom",
//   "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
// ];

// // Add new sizes here easily — just push to this array
// const SIZES = [
//   { id: 1, label: '8.5" X 11"', sub: "Portrait", w: 85, h: 110 },
//   { id: 2, label: '8.27" X 11.69"', sub: "Portrait", w: 82, h: 116 },
//   { id: 3, label: '6" X 6"', sub: "Square", w: 100, h: 100 },
//   { id: 4, label: '7.5" X 7.5"', sub: "Square", w: 100, h: 100 },
//   { id: 5, label: '9" X 6"', sub: "Landscape", w: 130, h: 87 },
//   { id: "custom", label: "Custom Size", sub: "Custom", w: 100, h: 100, isCustom: true },
// ];

// const QUANTITIES    = ["5000","6000","7000","8000","10000","15000","20000","25000","50000"];
// const BINDING_TYPES = ["Saddle Stitch","Perfect Bound","Wire-O","Spiral","Case Bound","Staple"];
// const PG_COVER      = ["100 GSM","130 GSM","150 GSM","170 GSM","200 GSM","250 GSM","300 GSM","350 GSM"];
// const COVER_FINISH  = ["Gloss Lamination","Matte Lamination","Soft Touch","UV Spot","Uncoated","Satin"];
// const EDGES         = ["Standard","Round Corner","Gilded","Silver","Gold Foil","Debossed"];
// const SPEC_FINISH   = ["None","Embossing","Debossing","Hot Foil","Spot UV","Die Cut"];
// const PAGES         = ["32","48","64","80","96","112","128","160","192","224","256"];
// const PRINT_COLORS  = ["Full Color (CMYK)","Black & White","Pantone","2 Color"];
// const PG_INT        = ["60 GSM","70 GSM","80 GSM","90 GSM","100 GSM","120 GSM"];
// const PAPER_TYPES   = ["Uncoated","Coated","Recycled","Bond","Newsprint","Art Paper"];
// const PAGE_RULINGS  = ["None","Ruled","Dotted","Graph","Blank","Cornell"];

// const SizeCardSVG = ({ size, selected }) => {
//   const SW = 150, SH = 130;
//   const rw = size.w, rh = size.h;
//   const rx = (SW - rw) / 2, ry = (SH - rh) / 2;
//   return (
//     <svg viewBox={"0 0 " + SW + " " + SH} width="100%" height="100%">
//       <rect x={rx} y={ry} width={rw} height={rh} rx="4"
//         fill="#d9d9d9"
//         stroke={selected ? "#1a1adb" : "#c0c0c0"}
//         strokeWidth={selected ? 2.5 : 1}
//       />
//       {size.isCustom && (
//         <>
//           <line x1="75" y1={ry + 22} x2="75" y2={ry + rh - 22} stroke="#aaa" strokeWidth="1.5" strokeDasharray="4 3"/>
//           <line x1={rx + 18} y1={SH / 2} x2={rx + rw - 18} y2={SH / 2} stroke="#aaa" strokeWidth="1.5" strokeDasharray="4 3"/>
//         </>
//       )}
//     </svg>
//   );
// };

// const SizeCard = ({ size, selected, onClick }) => (
//   <div className={"aq-size-card" + (selected ? " aq-size-selected" : "")} onClick={onClick}>
//     <div className="aq-size-thumb"><SizeCardSVG size={size} selected={selected} /></div>
//     <div className="aq-size-label">{size.label}</div>
//     <div className="aq-size-sub">{size.sub}</div>
//   </div>
// );

// const SelectField = ({ label, options, value, onChange }) => (
//   <div className="aq-field">
//     <label className="aq-label">{label}</label>
//     <select className="aq-select" value={value} onChange={e => onChange(e.target.value)}>
//       <option value="">Select</option>
//       {options.map(o => <option key={o} value={o}>{o}</option>)}
//     </select>
//   </div>
// );

// const CountryInput = ({ value, onChange }) => {
//   const [query, setQuery]           = useState("");
//   const [suggestions, setSuggestions] = useState([]);
//   const [open, setOpen]             = useState(false);
//   const ref = useRef(null);

//   useEffect(() => {
//     const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
//     document.addEventListener("mousedown", h);
//     return () => document.removeEventListener("mousedown", h);
//   }, []);

//   const onInput = val => {
//     setQuery(val);
//     onChange("");
//     if (val) {
//       const f = COUNTRIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 8);
//       setSuggestions(f);
//       setOpen(f.length > 0);
//     } else { setSuggestions([]); setOpen(false); }
//   };

//   const onSelect = c => { setQuery(c); onChange(c); setSuggestions([]); setOpen(false); };

//   return (
//     <div className="aq-field aq-country-wrap" ref={ref}>
//       <label className="aq-label">Country / Region</label>
//       <input className="aq-input" type="text" placeholder="Type to search country..."
//         value={query} onChange={e => onInput(e.target.value)}
//         onFocus={() => query && suggestions.length > 0 && setOpen(true)}
//         autoComplete="off"
//       />
//       {open && (
//         <ul className="aq-suggestions">
//           {suggestions.map(c => <li key={c} className="aq-suggestion-item" onClick={() => onSelect(c)}>{c}</li>)}
//         </ul>
//       )}
//     </div>
//   );
// };

// const AcademicQuote = () => {
//   const [sizeIndex,       setSizeIndex]       = useState(0);
//   const [carouselStart,   setCarouselStart]   = useState(0);
//   const [customW,         setCustomW]         = useState("");
//   const [customH,         setCustomH]         = useState("");
//   const [quantity,        setQuantity]        = useState("");
//   const [bindingType,     setBindingType]     = useState("");
//   const [paperGrammage,   setPaperGrammage]   = useState("");
//   const [coverFinish,     setCoverFinish]     = useState("");
//   const [edges,           setEdges]           = useState("");
//   const [specialFinish,   setSpecialFinish]   = useState("");
//   const [noOfPages,       setNoOfPages]       = useState("");
//   const [printColor,      setPrintColor]      = useState("");
//   const [paperGrammageInt,setPaperGrammageInt]= useState("");
//   const [paperType,       setPaperType]       = useState("");
//   const [pageRuling,      setPageRuling]      = useState("");
//   const [additionalNote,  setAdditionalNote]  = useState("");
//   const [name,            setName]            = useState("");
//   const [email,           setEmail]           = useState("");
//   const [country,         setCountry]         = useState("");

//   const VISIBLE = 5;
//   const canPrev      = carouselStart > 0;
//   const canNext      = carouselStart + VISIBLE < SIZES.length;
//   const visibleSizes = SIZES.slice(carouselStart, carouselStart + VISIBLE);
//   const selectedSize = SIZES[sizeIndex];
//   const isCustom     = selectedSize?.isCustom;

//   const sizeValid = isCustom ? customW.trim() !== "" && customH.trim() !== "" : true;

//   const isFormValid =
//     sizeValid && quantity && bindingType && paperGrammage && coverFinish &&
//     edges && specialFinish && noOfPages && printColor && paperGrammageInt &&
//     paperType && pageRuling && name.trim() && email.trim();

//   return (
//     <div className="aq-wrap">
//       <p className="aq-intro">Fill information as per your requirements to complete the steps and get your quote!</p>

//       {/* ── STEP 1 SIZE ── */}
//       <div className="aq-step-box aq-step-active">
//         <div className="aq-step-body">
//           <h3 className="aq-section-title">Size</h3>
//           <div className="aq-carousel-row">
//             <button className={"aq-arrow" + (canPrev ? "" : " aq-arrow-off")}
//               onClick={() => canPrev && setCarouselStart(s => s - 1)} aria-label="Prev">&#8249;</button>
//             <div className="aq-carousel">
//               {visibleSizes.map((sz, i) => {
//                 const gi = carouselStart + i;
//                 return <SizeCard key={sz.id} size={sz} selected={sizeIndex === gi} onClick={() => setSizeIndex(gi)} />;
//               })}
//             </div>
//             <button className={"aq-arrow" + (canNext ? "" : " aq-arrow-off")}
//               onClick={() => canNext && setCarouselStart(s => s + 1)} aria-label="Next">&#8250;</button>
//           </div>
//           {isCustom && (
//             <div className="aq-custom-row">
//               <div className="aq-field">
//                 <label className="aq-label">Width (inches)</label>
//                 <input className="aq-input" type="number" placeholder="e.g. 8.5" min="1" step="0.1"
//                   value={customW} onChange={e => setCustomW(e.target.value)} />
//               </div>
//               <div className="aq-field">
//                 <label className="aq-label">Height (inches)</label>
//                 <input className="aq-input" type="number" placeholder="e.g. 11" min="1" step="0.1"
//                   value={customH} onChange={e => setCustomH(e.target.value)} />
//               </div>
//             </div>
//           )}
//         </div>
//       </div>



import React, { useState, useRef, useEffect } from "react";
import "./AcademicQuote.css";

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia","Australia","Austria","Azerbaijan",
  "Bahamas","Bahrain","Bangladesh","Belarus","Belgium","Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina",
  "Botswana","Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Canada","Cape Verde",
  "Central African Republic","Chad","Chile","China","Colombia","Comoros","Congo","Costa Rica","Croatia","Cuba",
  "Cyprus","Czech Republic","Denmark","Djibouti","Dominican Republic","Ecuador","Egypt","El Salvador","Estonia",
  "Ethiopia","Fiji","Finland","France","Gabon","Gambia","Georgia","Germany","Ghana","Greece","Guatemala","Guinea",
  "Haiti","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica",
  "Japan","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia",
  "Libya","Lithuania","Luxembourg","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania",
  "Mauritius","Mexico","Moldova","Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
  "Netherlands","New Zealand","Nicaragua","Niger","Nigeria","North Korea","Norway","Oman","Pakistan","Panama",
  "Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal","Qatar","Romania","Russia","Rwanda",
  "Saudi Arabia","Senegal","Serbia","Sierra Leone","Singapore","Slovakia","Slovenia","Somalia","South Africa",
  "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania",
  "Thailand","Togo","Tunisia","Turkey","Turkmenistan","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe"
];

// Add new sizes here easily — just push to this array
const SIZES = [
  { id: 1, label: '8.5" X 11"', sub: "Portrait", img: "/assets/sizes/portrait.png" },
  { id: 2, label: '8.27" X 11.69"', sub: "Portrait", img: "/assets/sizes/portrait.png" },
  { id: 3, label: '6" X 6"', sub: "Square", img: "/assets/sizes/square.png" },
  { id: 4, label: '7.5" X 7.5"', sub: "Square", img: "/assets/sizes/square.png" },
  { id: 5, label: '9" X 6"', sub: "Landscape", img: "/assets/sizes/landscape.png" },
  { id: "custom", label: "Custom Size", sub: "Custom", img: "/assets/sizes/custom.png", isCustom: true },
];

const QUANTITIES    = ["5000","6000","7000","8000","10000","15000","20000","25000","50000"];
const BINDING_TYPES = ["Saddle Stitch","Perfect Bound","Wire-O","Spiral","Case Bound","Staple"];
const PG_COVER      = ["100 GSM","130 GSM","150 GSM","170 GSM","200 GSM","250 GSM","300 GSM","350 GSM"];
const COVER_FINISH  = ["Gloss Lamination","Matte Lamination","Soft Touch","UV Spot","Uncoated","Satin"];
const EDGES         = ["Standard","Round Corner","Gilded","Silver","Gold Foil","Debossed"];
const SPEC_FINISH   = ["None","Embossing","Debossing","Hot Foil","Spot UV","Die Cut"];
const PAGES         = ["32","48","64","80","96","112","128","160","192","224","256"];
const PRINT_COLORS  = ["Full Color (CMYK)","Black & White","Pantone","2 Color"];
const PG_INT        = ["60 GSM","70 GSM","80 GSM","90 GSM","100 GSM","120 GSM"];
const PAPER_TYPES   = ["Uncoated","Coated","Recycled","Bond","Newsprint","Art Paper"];
const PAGE_RULINGS  = ["None","Ruled","Dotted","Graph","Blank","Cornell"];

// ❌ REMOVED SVG DRAWING
// ✅ USING IMAGE INSTEAD

const SizeCard = ({ size, selected, onClick }) => (
  <div className={"aq-size-card" + (selected ? " aq-size-selected" : "")} onClick={onClick}>
    <div className="aq-size-thumb">
      <img 
        src={size.img} 
        alt={size.label} 
        style={{ width: "100%", height: "100%", objectFit: "contain" }} 
      />
    </div>
    <div className="aq-size-label">{size.label}</div>
    <div className="aq-size-sub">{size.sub}</div>
  </div>
);

const SelectField = ({ label, options, value, onChange }) => (
  <div className="aq-field">
    <label className="aq-label">{label}</label>
    <select className="aq-select" value={value} onChange={e => onChange(e.target.value)}>
      <option value="">Select</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </div>
);

const CountryInput = ({ value, onChange }) => {
  const [query, setQuery]           = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen]             = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const onInput = val => {
    setQuery(val);
    onChange("");
    if (val) {
      const f = COUNTRIES.filter(c => c.toLowerCase().startsWith(val.toLowerCase())).slice(0, 8);
      setSuggestions(f);
      setOpen(f.length > 0);
    } else { setSuggestions([]); setOpen(false); }
  };

  const onSelect = c => { setQuery(c); onChange(c); setSuggestions([]); setOpen(false); };

  return (
    <div className="aq-field aq-country-wrap" ref={ref}>
      <label className="aq-label">Country / Region</label>
      <input className="aq-input" type="text" placeholder="Type to search country..."
        value={query} onChange={e => onInput(e.target.value)}
        onFocus={() => query && suggestions.length > 0 && setOpen(true)}
        autoComplete="off"
      />
      {open && (
        <ul className="aq-suggestions">
          {suggestions.map(c => <li key={c} className="aq-suggestion-item" onClick={() => onSelect(c)}>{c}</li>)}
        </ul>
      )}
    </div>
  );
};

// 🔴 BELOW CODE IS 100% SAME (NO CHANGE)

const AcademicQuote = () => {
  const [sizeIndex,       setSizeIndex]       = useState(0);
  const [carouselStart,   setCarouselStart]   = useState(0);
  const [customW,         setCustomW]         = useState("");
  const [customH,         setCustomH]         = useState("");
  const [quantity,        setQuantity]        = useState("");
  const [bindingType,     setBindingType]     = useState("");
  const [paperGrammage,   setPaperGrammage]   = useState("");
  const [coverFinish,     setCoverFinish]     = useState("");
  const [edges,           setEdges]           = useState("");
  const [specialFinish,   setSpecialFinish]   = useState("");
  const [noOfPages,       setNoOfPages]       = useState("");
  const [printColor,      setPrintColor]      = useState("");
  const [paperGrammageInt,setPaperGrammageInt]= useState("");
  const [paperType,       setPaperType]       = useState("");
  const [pageRuling,      setPageRuling]      = useState("");
  const [additionalNote,  setAdditionalNote]  = useState("");
  const [name,            setName]            = useState("");
  const [email,           setEmail]           = useState("");
  const [country,         setCountry]         = useState("");

  const VISIBLE = 5;
  const canPrev      = carouselStart > 0;
  const canNext      = carouselStart + VISIBLE < SIZES.length;
  const visibleSizes = SIZES.slice(carouselStart, carouselStart + VISIBLE);
  const selectedSize = SIZES[sizeIndex];
  const isCustom     = selectedSize?.isCustom;

  const sizeValid = isCustom ? customW.trim() !== "" && customH.trim() !== "" : true;

  const isFormValid =
    sizeValid && quantity && bindingType && paperGrammage && coverFinish &&
    edges && specialFinish && noOfPages && printColor && paperGrammageInt &&
    paperType && pageRuling && name.trim() && email.trim();

  return (
    <div className="aq-wrap">
      <p className="aq-intro">Fill information as per your requirements to complete the steps and get your quote!</p>

      <div className="aq-step-box aq-step-active">
        <div className="aq-step-body">
          <h3 className="aq-section-title">Size</h3>
          <div className="aq-carousel-row">
            <button className={"aq-arrow" + (canPrev ? "" : " aq-arrow-off")}
              onClick={() => canPrev && setCarouselStart(s => s - 1)} aria-label="Prev">&#8249;</button>
            <div className="aq-carousel">
              {visibleSizes.map((sz, i) => {
                const gi = carouselStart + i;
                return <SizeCard key={sz.id} size={sz} selected={sizeIndex === gi} onClick={() => setSizeIndex(gi)} />;
              })}
            </div>
            <button className={"aq-arrow" + (canNext ? "" : " aq-arrow-off")}
              onClick={() => canNext && setCarouselStart(s => s + 1)} aria-label="Next">&#8250;</button>
          </div>

          {isCustom && (
            <div className="aq-custom-row">
              <div className="aq-field">
                <label className="aq-label">Width (inches)</label>
                <input className="aq-input" type="number" placeholder="e.g. 8.5" min="1" step="0.1"
                  value={customW} onChange={e => setCustomW(e.target.value)} />
              </div>
              <div className="aq-field">
                <label className="aq-label">Height (inches)</label>
                <input className="aq-input" type="number" placeholder="e.g. 11" min="1" step="0.1"
                  value={customH} onChange={e => setCustomH(e.target.value)} />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REST CODE SAME */}


      {/* ── STEP 2 GENERAL ── */}
      <div className="aq-step-row">
        <span className="aq-step-num">2.</span>
        <div className="aq-step-box aq-step-body">
          <h3 className="aq-section-title">General Details</h3>
          <div className="aq-fields-row">
            <div className="aq-field">
              <label className="aq-label">Quantity</label>
              <select className="aq-select" value={quantity} onChange={e => setQuantity(e.target.value)}>
                <option value="">Select</option>
                {QUANTITIES.map(q => <option key={q} value={q}>{q}</option>)}
              </select>
              <span className="aq-hint">Minimum 5000 Quantity</span>
            </div>
            <SelectField label="Binding Type" options={BINDING_TYPES} value={bindingType} onChange={setBindingType} />
          </div>
        </div>
      </div>

      {/* ── STEP 2 COVER ── */}
      <div className="aq-step-row">
        <span className="aq-step-num">2.</span>
        <div className="aq-step-box aq-step-body">
          <h3 className="aq-section-title">Cover</h3>
          <div className="aq-fields-row aq-fields-wrap">
            <SelectField label="Paper Grammage" options={PG_COVER}     value={paperGrammage} onChange={setPaperGrammage} />
            <SelectField label="Cover Finish"   options={COVER_FINISH}  value={coverFinish}   onChange={setCoverFinish}   />
            <SelectField label="Edges"          options={EDGES}         value={edges}         onChange={setEdges}         />
            <SelectField label="Special Finishing" options={SPEC_FINISH} value={specialFinish} onChange={setSpecialFinish} />
          </div>
        </div>
      </div>

      {/* ── STEP 3 INTERIOR ── */}
      <div className="aq-step-row">
        <span className="aq-step-num">3.</span>
        <div className="aq-step-box aq-step-body">
          <h3 className="aq-section-title">Interior Specification</h3>
          <div className="aq-fields-row aq-fields-wrap">
            <SelectField label="No. of Pages"   options={PAGES}        value={noOfPages}       onChange={setNoOfPages}       />
            <SelectField label="Print Color"    options={PRINT_COLORS} value={printColor}      onChange={setPrintColor}      />
            <SelectField label="Paper Grammage" options={PG_INT}       value={paperGrammageInt} onChange={setPaperGrammageInt}/>
            <SelectField label="Paper Type"     options={PAPER_TYPES}  value={paperType}       onChange={setPaperType}       />
            <SelectField label="Page Ruling"    options={PAGE_RULINGS} value={pageRuling}      onChange={setPageRuling}      />
          </div>
        </div>
      </div>

      {/* ── STEP 3 ADDITIONAL NOTE ── */}
      <div className="aq-step-row">
        <span className="aq-step-num">3.</span>
        <div className="aq-step-box aq-step-body">
          <h3 className="aq-section-title">Additional Note <span className="aq-optional">(Optional)</span></h3>
          <p className="aq-note-hint">Please give us any special information or instructions. ( If none, type Null )</p>
          <textarea className="aq-textarea" rows={5} value={additionalNote}
            onChange={e => setAdditionalNote(e.target.value)} />
        </div>
      </div>

      {/* ── STEP 4 CONTACT ── */}
      <div className="aq-step-row">
        <span className="aq-step-num">4.</span>
        <div className="aq-step-box aq-step-body">
          <div className="aq-fields-row aq-fields-wrap">
            <div className="aq-field">
              <label className="aq-label">Your Name / Project name</label>
              <input className="aq-input" type="text" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="aq-field">
              <label className="aq-label">Email ID</label>
              <input className="aq-input" type="email" value={email} onChange={e => setEmail(e.target.value)} />
            </div>
            <CountryInput value={country} onChange={setCountry} />
          </div>
        </div>
      </div>

      {/* ── ALL SET ── */}
      <div className="aq-allset">
        <h2 className="aq-allset-title">You&apos;re all set !</h2>
        <button
          className={"aq-btn-quote" + (isFormValid ? " aq-btn-enabled" : "")}
          disabled={!isFormValid}
        >
          Get Quote
        </button>
      </div>
    </div>
  );
};

export default AcademicQuote;