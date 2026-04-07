// import React, { useState, useEffect } from "react";
// import "./CorporateQoute.css";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Country list (full ISO list kept compact)
// const COUNTRIES = [
//   "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
//   "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
//   "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana",
//   "Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon",
//   "Canada","Chad","Chile","China","Colombia","Congo","Costa Rica","Croatia",
//   "Cuba","Cyprus","Czech Republic","Denmark","Ecuador","Egypt","El Salvador",
//   "Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
//   "Guatemala","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
//   "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
//   "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Libya","Lithuania",
//   "Luxembourg","Malaysia","Maldives","Mali","Malta","Mexico","Moldova",
//   "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
//   "Netherlands","New Zealand","Nicaragua","Nigeria","North Korea","Norway",
//   "Oman","Pakistan","Palestine","Panama","Paraguay","Peru","Philippines",
//   "Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia",
//   "Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa",
//   "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria",
//   "Taiwan","Tajikistan","Tanzania","Thailand","Tunisia","Turkey","Turkmenistan",
//   "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
//   "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
// ];

// const INITIAL_FORM = {
//   // Step 1 (injected from parent)
//   cardSize: "",
//   cardDimensions: "",
//   // Step 2 — General Details
//   quantity: "",
//   paperType: "",
//   printType: "",
//   specialFinishing: "",
//   printingSide: "",
//   // Step 3 — Additional Note
//   additionalNote: "",
//   // Step 4 — Customer Details
//   customerName: "",
//   email: "",
//   country: "",
//   // File uploads
//   files: [],
// };

// const CorporateQoute = ({ selectedSize }) => {
//   const [form, setForm]           = useState(INITIAL_FORM);
//   const [options, setOptions]     = useState(null);   // from GET /options/dropdown
//   const [loading, setLoading]     = useState(true);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [errors, setErrors]       = useState({});
//   const [apiError, setApiError]   = useState("");

//   // ── Fetch dropdown options ──────────────────────────────────────────────
//   useEffect(() => {
//     const fetchOptions = async () => {
//       try {
//         const res  = await fetch(`${BASE_URL}/api/business-card/options/dropdown`);
//         const data = await res.json();
//         setOptions(data);
//       } catch (err) {
//         console.error("Failed to load options:", err);
//         setApiError("Failed to load form options. Please refresh the page.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOptions();
//   }, []);

//   // ── Sync selectedSize from parent (Step 1) ─────────────────────────────
//   useEffect(() => {
//     if (selectedSize) {
//       setForm((prev) => ({
//         ...prev,
//         cardSize:       selectedSize.label,
//         cardDimensions: selectedSize.dimensions,
//       }));
//       // Clear size error if it existed
//       setErrors((prev) => ({ ...prev, cardSize: "" }));
//     }
//   }, [selectedSize]);

//   // ── Field change handler ────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
//   };

//   // ── File change handler ─────────────────────────────────────────────────
//   const handleFileChange = (e) => {
//     setForm((prev) => ({ ...prev, files: Array.from(e.target.files) }));
//   };

//   // ── Validation ──────────────────────────────────────────────────────────
//   const validate = () => {
//     const e = {};
//     if (!form.cardSize)       e.cardSize       = "Please select a card size (Step 1).";
//     if (!form.quantity)       e.quantity       = "Quantity is required.";
//     if (!form.paperType)      e.paperType      = "Paper type is required.";
//     if (!form.printType)      e.printType      = "Print type is required.";
//     if (!form.specialFinishing) e.specialFinishing = "Special finishing is required.";
//     if (!form.printingSide)   e.printingSide   = "Printing side is required.";
//     if (!form.customerName.trim()) e.customerName = "Your name is required.";
//     if (!form.email.trim())   e.email = "Email is required.";
//     else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
//       e.email = "Enter a valid email address.";
//     if (!form.country)        e.country        = "Country is required.";
//     return e;
//   };

//   // ── Check if all required fields are filled (for button enable) ─────────
//   const isFormComplete = () => {
//     return (
//       !!selectedSize &&
//       !!form.quantity &&
//       !!form.paperType &&
//       !!form.printType &&
//       !!form.specialFinishing &&
//       !!form.printingSide &&
//       !!form.customerName.trim() &&
//       !!form.email.trim() &&
//       /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
//       !!form.country
//     );
//   };

//   // ── Submit ──────────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       // Scroll to first error
//       const firstErrorKey = Object.keys(validationErrors)[0];
//       document.querySelector(`[name="${firstErrorKey}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
//       return;
//     }

//     setSubmitting(true);
//     setApiError("");

//     try {
//       const formData = new FormData();

//       // All text fields
//       formData.append("cardSize",         form.cardSize);
//       formData.append("cardDimensions",   form.cardDimensions);
//       formData.append("quantity",         form.quantity);
//       formData.append("paperType",        form.paperType);
//       formData.append("printType",        form.printType);
//       formData.append("specialFinishing", form.specialFinishing);
//       formData.append("printingSide",     form.printingSide);
//       formData.append("additionalNote",   form.additionalNote);
//       formData.append("customerName",     form.customerName);
//       formData.append("email",            form.email);
//       formData.append("country",          form.country);

//       // File uploads
//       form.files.forEach((file) => formData.append("files", file));

//       const res = await fetch(`${BASE_URL}/api/business-card`, {
//         method: "POST",
//         body: formData,
//         // Do NOT set Content-Type — browser sets multipart/form-data boundary automatically
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData?.message || `Server error: ${res.status}`);
//       }

//       setSubmitted(true);
//       setForm(INITIAL_FORM);
//     } catch (err) {
//       setApiError(err.message || "Something went wrong. Please try again.");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // ── Helpers to get option values safely ────────────────────────────────
//   const getOpts = (key) => {
//     if (!options) return [];
//     // Support both flat array and nested object structures
//     if (Array.isArray(options[key])) return options[key];
//     if (options[key]?.values) return options[key].values;
//     if (options?.generalDetails?.[key]) return options.generalDetails[key];
//     return [];
//   };

//   // ── Success screen ──────────────────────────────────────────────────────
//   if (submitted) {
//     return (
//       <div className="bcqf-success">
//         <div className="bcqf-success-icon">✓</div>
//         <h2>You're all set!</h2>
//         <p>Your quote request has been submitted. We'll get back to you shortly.</p>
//         <button
//           className="bcqf-btn-reset"
//           onClick={() => { setSubmitted(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
//         >
//           Submit Another Quote
//         </button>
//       </div>
//     );
//   }

//   return (
//     <form className="bcqf-form" onSubmit={handleSubmit} noValidate>

//       {apiError && <div className="bcqf-api-error">{apiError}</div>}

//       {/* ══════════════════════════════════════ */}
//       {/* STEP 2 — General Details              */}
//       {/* ══════════════════════════════════════ */}
//       <div className="bcqf-step-block">
//         <div className="bcqf-step-number">2.</div>

//         <div className="bcqf-card">
//           <p className="bcqf-card-title">General Details</p>

//           {loading ? (
//             <div className="bcqf-loading">
//               <span className="bcqf-spinner" />
//               Loading options…
//             </div>
//           ) : (
//             <div className="bcqf-grid">

//               {/* Quantity */}
//               <div className="bcqf-field">
//                 <label className="bcqf-label" htmlFor="quantity">
//                   Quantity <span className="bcqf-req">*</span>
//                 </label>
//                 <select
//                   id="quantity"
//                   name="quantity"
//                   className={`bcqf-select${errors.quantity ? " bcqf-input-error" : ""}`}
//                   value={form.quantity}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   {getOpts("quantity").map((opt, i) => (
//                     <option key={i} value={typeof opt === "object" ? opt.value : opt}>
//                       {typeof opt === "object" ? opt.label : opt}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.quantity && <span className="bcqf-error">{errors.quantity}</span>}
//               </div>

//               {/* Paper Type */}
//               <div className="bcqf-field">
//                 <label className="bcqf-label" htmlFor="paperType">
//                   Paper Type <span className="bcqf-req">*</span>
//                 </label>
//                 <select
//                   id="paperType"
//                   name="paperType"
//                   className={`bcqf-select${errors.paperType ? " bcqf-input-error" : ""}`}
//                   value={form.paperType}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   {getOpts("paperType").map((opt, i) => (
//                     <option key={i} value={typeof opt === "object" ? opt.value : opt}>
//                       {typeof opt === "object" ? opt.label : opt}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.paperType && <span className="bcqf-error">{errors.paperType}</span>}
//               </div>

//               {/* Print Type */}
//               <div className="bcqf-field">
//                 <label className="bcqf-label" htmlFor="printType">
//                   Print Type <span className="bcqf-req">*</span>
//                 </label>
//                 <select
//                   id="printType"
//                   name="printType"
//                   className={`bcqf-select${errors.printType ? " bcqf-input-error" : ""}`}
//                   value={form.printType}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   {getOpts("printType").map((opt, i) => (
//                     <option key={i} value={typeof opt === "object" ? opt.value : opt}>
//                       {typeof opt === "object" ? opt.label : opt}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.printType && <span className="bcqf-error">{errors.printType}</span>}
//               </div>

//               {/* Special Finishing */}
//               <div className="bcqf-field">
//                 <label className="bcqf-label" htmlFor="specialFinishing">
//                   Special Finishing <span className="bcqf-req">*</span>
//                 </label>
//                 <select
//                   id="specialFinishing"
//                   name="specialFinishing"
//                   className={`bcqf-select${errors.specialFinishing ? " bcqf-input-error" : ""}`}
//                   value={form.specialFinishing}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   {getOpts("specialFinishing").map((opt, i) => (
//                     <option key={i} value={typeof opt === "object" ? opt.value : opt}>
//                       {typeof opt === "object" ? opt.label : opt}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.specialFinishing && <span className="bcqf-error">{errors.specialFinishing}</span>}
//               </div>

//               {/* Printing Side */}
//               <div className="bcqf-field">
//                 <label className="bcqf-label" htmlFor="printingSide">
//                   Printing Side <span className="bcqf-req">*</span>
//                 </label>
//                 <select
//                   id="printingSide"
//                   name="printingSide"
//                   className={`bcqf-select${errors.printingSide ? " bcqf-input-error" : ""}`}
//                   value={form.printingSide}
//                   onChange={handleChange}
//                 >
//                   <option value="">Select</option>
//                   {getOpts("printingSide").map((opt, i) => (
//                     <option key={i} value={typeof opt === "object" ? opt.value : opt}>
//                       {typeof opt === "object" ? opt.label : opt}
//                     </option>
//                   ))}
//                 </select>
//                 {errors.printingSide && <span className="bcqf-error">{errors.printingSide}</span>}
//               </div>

//               {/* File Upload */}
//               <div className="bcqf-field bcqf-field--full">
//                 <label className="bcqf-label" htmlFor="files">
//                   Upload Files <span className="bcqf-optional">(Optional)</span>
//                 </label>
//                 <input
//                   id="files"
//                   type="file"
//                   multiple
//                   accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.zip"
//                   className="bcqf-file-input"
//                   onChange={handleFileChange}
//                 />
//                 <p className="bcqf-file-hint">PDF, AI, EPS, PNG, JPG or ZIP — max 10 files</p>
//               </div>

//             </div>
//           )}
//         </div>
//       </div>

//       {/* ══════════════════════════════════════ */}
//       {/* STEP 3 — Additional Note             */}
//       {/* ══════════════════════════════════════ */}
//       <div className="bcqf-step-block">
//         <div className="bcqf-step-number">3.</div>

//         <div className="bcqf-card">
//           <p className="bcqf-card-title">
//             Additional Note <span className="bcqf-optional">(Optional)</span>
//           </p>
//           <p className="bcqf-card-subtitle">
//             Please give us any special information or instructions. ( If none, type Null )
//           </p>
//           <textarea
//             name="additionalNote"
//             id="additionalNote"
//             className="bcqf-textarea"
//             rows={5}
//             placeholder="Type your notes here…"
//             value={form.additionalNote}
//             onChange={handleChange}
//           />
//         </div>
//       </div>

//       {/* ══════════════════════════════════════ */}
//       {/* STEP 4 — Customer Details             */}
//       {/* ══════════════════════════════════════ */}
//       <div className="bcqf-step-block">
//         <div className="bcqf-step-number">4.</div>

//         <div className="bcqf-card">
//           <p className="bcqf-card-title">Your Details</p>

//           <div className="bcqf-grid bcqf-grid--3">

//             {/* Name */}
//             <div className="bcqf-field">
//               <label className="bcqf-label" htmlFor="customerName">
//                 Your Name / Project Name <span className="bcqf-req">*</span>
//               </label>
//               <input
//                 type="text"
//                 id="customerName"
//                 name="customerName"
//                 className={`bcqf-input${errors.customerName ? " bcqf-input-error" : ""}`}
//                 placeholder="e.g. John Doe"
//                 value={form.customerName}
//                 onChange={handleChange}
//               />
//               {errors.customerName && <span className="bcqf-error">{errors.customerName}</span>}
//             </div>

//             {/* Email */}
//             <div className="bcqf-field">
//               <label className="bcqf-label" htmlFor="email">
//                 Email ID <span className="bcqf-req">*</span>
//               </label>
//               <input
//                 type="email"
//                 id="email"
//                 name="email"
//                 className={`bcqf-input${errors.email ? " bcqf-input-error" : ""}`}
//                 placeholder="e.g. john@email.com"
//                 value={form.email}
//                 onChange={handleChange}
//               />
//               {errors.email && <span className="bcqf-error">{errors.email}</span>}
//             </div>

//             {/* Country */}
//             <div className="bcqf-field">
//               <label className="bcqf-label" htmlFor="country">
//                 Country / Region <span className="bcqf-req">*</span>
//               </label>
//               <select
//                 id="country"
//                 name="country"
//                 className={`bcqf-select${errors.country ? " bcqf-input-error" : ""}`}
//                 value={form.country}
//                 onChange={handleChange}
//               >
//                 <option value="">Select Country</option>
//                 {COUNTRIES.map((c) => (
//                   <option key={c} value={c}>{c}</option>
//                 ))}
//               </select>
//               {errors.country && <span className="bcqf-error">{errors.country}</span>}
//             </div>

//           </div>
//         </div>
//       </div>

//       {/* ══════════════════════════════════════ */}
//       {/* ALL SET + GET QUOTE BUTTON            */}
//       {/* ══════════════════════════════════════ */}
//       <div className="bcqf-submit-section">
//         <div className="bcqf-allset">
//           <h2 className="bcqf-allset-title">You're all set !</h2>
//         </div>

//         {errors.cardSize && (
//           <p className="bcqf-error bcqf-size-error">{errors.cardSize}</p>
//         )}

//         <button
//           type="submit"
//           className={`bcqf-submit-btn${isFormComplete() ? " bcqf-submit-btn--active" : ""}`}
//           disabled={!isFormComplete() || submitting}
//         >
//           {submitting ? (
//             <><span className="bcqf-spinner bcqf-spinner--white" /> Submitting…</>
//           ) : (
//             "Get Quote"
//           )}
//         </button>

//         {!isFormComplete() && (
//           <p className="bcqf-submit-hint">
//             Please fill in all required fields and select a card size to enable the button.
//           </p>
//         )}
//       </div>

//     </form>
//   );
// };

// export default CorporateQoute;


import React, { useState, useEffect } from "react";
import "./CorporateQoute.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Andorra","Angola","Argentina","Armenia",
  "Australia","Austria","Azerbaijan","Bahrain","Bangladesh","Belarus","Belgium",
  "Belize","Benin","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana",
  "Brazil","Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon",
  "Canada","Chad","Chile","China","Colombia","Congo","Costa Rica","Croatia",
  "Cuba","Cyprus","Czech Republic","Denmark","Ecuador","Egypt","El Salvador",
  "Estonia","Ethiopia","Finland","France","Georgia","Germany","Ghana","Greece",
  "Guatemala","Honduras","Hungary","Iceland","India","Indonesia","Iran","Iraq",
  "Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya",
  "Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Libya","Lithuania",
  "Luxembourg","Malaysia","Maldives","Mali","Malta","Mexico","Moldova",
  "Mongolia","Montenegro","Morocco","Mozambique","Myanmar","Namibia","Nepal",
  "Netherlands","New Zealand","Nicaragua","Nigeria","North Korea","Norway",
  "Oman","Pakistan","Palestine","Panama","Paraguay","Peru","Philippines",
  "Poland","Portugal","Qatar","Romania","Russia","Rwanda","Saudi Arabia",
  "Senegal","Serbia","Singapore","Slovakia","Slovenia","Somalia","South Africa",
  "South Korea","Spain","Sri Lanka","Sudan","Sweden","Switzerland","Syria",
  "Taiwan","Tajikistan","Tanzania","Thailand","Tunisia","Turkey","Turkmenistan",
  "Uganda","Ukraine","United Arab Emirates","United Kingdom","United States",
  "Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen","Zambia","Zimbabwe",
];

const INITIAL_FORM = {
  cardSize: "",
  cardDimensions: "",
  customWidth: "",
  customHeight: "",
  quantity: "",
  paperType: "",
  printType: "",
  specialFinishing: "",
  printingSide: "",
  additionalNote: "",
  customerName: "",
  email: "",
  country: "",
  files: [],
};

// ─── props: selectedSize, customSizeComplete ────────────────────────────────
const CorporateQoute = ({ selectedSize, customSizeComplete }) => {
  const [form, setForm]             = useState(INITIAL_FORM);
  const [options, setOptions]       = useState(null);
  const [loading, setLoading]       = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [errors, setErrors]         = useState({});
  const [apiError, setApiError]     = useState("");

  // ── Fetch dropdown options ──────────────────────────────────────────────
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res  = await fetch(`${BASE_URL}/api/business-card/options/dropdown`);
        const data = await res.json();
        setOptions(data);
      } catch (err) {
        console.error("Failed to load options:", err);
        setApiError("Failed to load form options. Please refresh the page.");
      } finally {
        setLoading(false);
      }
    };
    fetchOptions();
  }, []);

  // ── Sync selectedSize from parent (Step 1) ─────────────────────────────
  useEffect(() => {
    if (selectedSize) {
      setForm((prev) => ({
        ...prev,
        cardSize:       selectedSize.label,
        cardDimensions: selectedSize.dimensions,
        // custom size values (will be "" for non-custom)
        customWidth:    selectedSize.customWidth  || "",
        customHeight:   selectedSize.customHeight || "",
      }));
      setErrors((prev) => ({ ...prev, cardSize: "" }));
    }
  }, [selectedSize]);

  // ── Generic field change ────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ── File change ─────────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, files: Array.from(e.target.files) }));
  };

  // ── Quantity helpers ────────────────────────────────────────────────────
  const quantityNum    = parseInt(form.quantity, 10);
  const quantityTooLow = form.quantity !== "" && (!isNaN(quantityNum) && quantityNum < 500);
  const quantityValid  = form.quantity !== "" && !isNaN(quantityNum) && quantityNum >= 500;

  // ── Validation ──────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!form.cardSize)         e.cardSize         = "Please select a card size (Step 1).";
    if (selectedSize?.isCustom && (!selectedSize.customWidth || !selectedSize.customHeight))
                                e.cardSize         = "Please enter custom width and height (Step 1).";
    if (!form.quantity)         e.quantity         = "Quantity is required.";
    else if (isNaN(quantityNum) || quantityNum < 500)
                                e.quantity         = "Minimum quantity is 500.";
    if (!form.paperType)        e.paperType        = "Paper type is required.";
    if (!form.printType)        e.printType        = "Print type is required.";
    if (!form.specialFinishing) e.specialFinishing = "Special finishing is required.";
    if (!form.printingSide)     e.printingSide     = "Printing side is required.";
    if (!form.customerName.trim()) e.customerName  = "Your name is required.";
    if (!form.email.trim())     e.email            = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                e.email            = "Enter a valid email address.";
    if (!form.country)          e.country          = "Country is required.";
    return e;
  };

  // ── Form completeness check (enables Get Quote button) ─────────────────
  const isFormComplete = () => {
    // Step 1: size selected + custom size filled if applicable
    const sizeOk = !!selectedSize && (customSizeComplete !== false ? customSizeComplete : true);
    return (
      sizeOk &&
      quantityValid &&
      !!form.paperType &&
      !!form.printType &&
      !!form.specialFinishing &&
      !!form.printingSide &&
      !!form.customerName.trim() &&
      !!form.email.trim() &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email) &&
      !!form.country
    );
  };

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      const firstErrorKey = Object.keys(validationErrors)[0];
      document.querySelector(`[name="${firstErrorKey}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setSubmitting(true);
    setApiError("");

    try {
      const formData = new FormData();

      formData.append("cardSize",         form.cardSize);
      formData.append("cardDimensions",   form.cardDimensions);
      // Custom size — send only when applicable
      if (selectedSize?.isCustom) {
        formData.append("customWidth",  form.customWidth);
        formData.append("customHeight", form.customHeight);
      }
      formData.append("quantity",         form.quantity);
      formData.append("paperType",        form.paperType);
      formData.append("printType",        form.printType);
      formData.append("specialFinishing", form.specialFinishing);
      formData.append("printingSide",     form.printingSide);
      formData.append("additionalNote",   form.additionalNote);
      formData.append("customerName",     form.customerName);
      formData.append("email",            form.email);
      formData.append("country",          form.country);

      form.files.forEach((file) => formData.append("files", file));

      const res = await fetch(`${BASE_URL}/api/business-card`, {
        method: "POST",
        body:   formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData?.message || `Server error: ${res.status}`);
      }

      setSubmitted(true);
      setForm(INITIAL_FORM);
    } catch (err) {
      setApiError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Options helper ──────────────────────────────────────────────────────
  const getOpts = (key) => {
    if (!options) return [];
    if (Array.isArray(options[key]))           return options[key];
    if (options[key]?.values)                  return options[key].values;
    if (options?.generalDetails?.[key])        return options.generalDetails[key];
    return [];
  };

  // ── Success screen ──────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="bcqf-success">
        <div className="bcqf-success-icon">✓</div>
        <h2>You're all set!</h2>
        <p>Your quote request has been submitted. We'll get back to you shortly.</p>
        <button
          className="bcqf-btn-reset"
          onClick={() => { setSubmitted(false); window.scrollTo({ top: 0, behavior: "smooth" }); }}
        >
          Submit Another Quote
        </button>
      </div>
    );
  }

  return (
    <form className="bcqf-form" onSubmit={handleSubmit} noValidate>

      {apiError && <div className="bcqf-api-error">{apiError}</div>}

      {/* ══════════════════════════════════════ */}
      {/* STEP 2 — General Details              */}
      {/* ══════════════════════════════════════ */}
      <div className="bcqf-step-block">
        <div className="bcqf-step-number">2.</div>

        <div className="bcqf-card">
          <p className="bcqf-card-title">General Details</p>

          {loading ? (
            <div className="bcqf-loading">
              <span className="bcqf-spinner" />
              Loading options…
            </div>
          ) : (
            <div className="bcqf-grid">

              {/* ── Quantity — number input with min-500 validation ── */}
              <div className="bcqf-field">
                <label className="bcqf-label" htmlFor="quantity">
                  Quantity <span className="bcqf-req">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  step="1"
                  className={`bcqf-input${errors.quantity || quantityTooLow ? " bcqf-input-error" : ""}`}
                  placeholder="Min. 500"
                  value={form.quantity}
                  onChange={handleChange}
                />
                {/* Show warning inline as user types, before submit */}
                {quantityTooLow && !errors.quantity && (
                  <span className="bcqf-error">Minimum quantity is 500.</span>
                )}
                {errors.quantity && (
                  <span className="bcqf-error">{errors.quantity}</span>
                )}
              </div>

              {/* Paper Type */}
              <div className="bcqf-field">
                <label className="bcqf-label" htmlFor="paperType">
                  Paper Type <span className="bcqf-req">*</span>
                </label>
                <select
                  id="paperType"
                  name="paperType"
                  className={`bcqf-select${errors.paperType ? " bcqf-input-error" : ""}`}
                  value={form.paperType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {getOpts("paperType").map((opt, i) => (
                    <option key={i} value={typeof opt === "object" ? opt.value : opt}>
                      {typeof opt === "object" ? opt.label : opt}
                    </option>
                  ))}
                </select>
                {errors.paperType && <span className="bcqf-error">{errors.paperType}</span>}
              </div>

              {/* Print Type */}
              <div className="bcqf-field">
                <label className="bcqf-label" htmlFor="printType">
                  Print Type <span className="bcqf-req">*</span>
                </label>
                <select
                  id="printType"
                  name="printType"
                  className={`bcqf-select${errors.printType ? " bcqf-input-error" : ""}`}
                  value={form.printType}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {getOpts("printType").map((opt, i) => (
                    <option key={i} value={typeof opt === "object" ? opt.value : opt}>
                      {typeof opt === "object" ? opt.label : opt}
                    </option>
                  ))}
                </select>
                {errors.printType && <span className="bcqf-error">{errors.printType}</span>}
              </div>

              {/* Special Finishing */}
              <div className="bcqf-field">
                <label className="bcqf-label" htmlFor="specialFinishing">
                  Special Finishing <span className="bcqf-req">*</span>
                </label>
                <select
                  id="specialFinishing"
                  name="specialFinishing"
                  className={`bcqf-select${errors.specialFinishing ? " bcqf-input-error" : ""}`}
                  value={form.specialFinishing}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {getOpts("specialFinishing").map((opt, i) => (
                    <option key={i} value={typeof opt === "object" ? opt.value : opt}>
                      {typeof opt === "object" ? opt.label : opt}
                    </option>
                  ))}
                </select>
                {errors.specialFinishing && <span className="bcqf-error">{errors.specialFinishing}</span>}
              </div>

              {/* Printing Side */}
              <div className="bcqf-field">
                <label className="bcqf-label" htmlFor="printingSide">
                  Printing Side <span className="bcqf-req">*</span>
                </label>
                <select
                  id="printingSide"
                  name="printingSide"
                  className={`bcqf-select${errors.printingSide ? " bcqf-input-error" : ""}`}
                  value={form.printingSide}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  {getOpts("printingSide").map((opt, i) => (
                    <option key={i} value={typeof opt === "object" ? opt.value : opt}>
                      {typeof opt === "object" ? opt.label : opt}
                    </option>
                  ))}
                </select>
                {errors.printingSide && <span className="bcqf-error">{errors.printingSide}</span>}
              </div>

              {/* File Upload */}
              <div className="bcqf-field bcqf-field--full">
                <label className="bcqf-label" htmlFor="files">
                  Upload Files <span className="bcqf-optional">(Optional)</span>
                </label>
                <input
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf,.ai,.eps,.png,.jpg,.jpeg,.zip"
                  className="bcqf-file-input"
                  onChange={handleFileChange}
                />
                <p className="bcqf-file-hint">PDF, AI, EPS, PNG, JPG or ZIP — max 10 files</p>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* STEP 3 — Additional Note             */}
      {/* ══════════════════════════════════════ */}
      <div className="bcqf-step-block">
        <div className="bcqf-step-number">3.</div>

        <div className="bcqf-card">
          <p className="bcqf-card-title">
            Additional Note <span className="bcqf-optional">(Optional)</span>
          </p>
          <p className="bcqf-card-subtitle">
            Please give us any special information or instructions. ( If none, type Null )
          </p>
          <textarea
            name="additionalNote"
            id="additionalNote"
            className="bcqf-textarea"
            rows={5}
            placeholder="Type your notes here…"
            value={form.additionalNote}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* STEP 4 — Customer Details             */}
      {/* ══════════════════════════════════════ */}
      <div className="bcqf-step-block">
        <div className="bcqf-step-number">4.</div>

        <div className="bcqf-card">
          <p className="bcqf-card-title">Your Details</p>

          <div className="bcqf-grid bcqf-grid--3">

            {/* Name */}
            <div className="bcqf-field">
              <label className="bcqf-label" htmlFor="customerName">
                Your Name / Project Name <span className="bcqf-req">*</span>
              </label>
              <input
                type="text"
                id="customerName"
                name="customerName"
                className={`bcqf-input${errors.customerName ? " bcqf-input-error" : ""}`}
                placeholder="e.g. John Doe"
                value={form.customerName}
                onChange={handleChange}
              />
              {errors.customerName && <span className="bcqf-error">{errors.customerName}</span>}
            </div>

            {/* Email */}
            <div className="bcqf-field">
              <label className="bcqf-label" htmlFor="email">
                Email ID <span className="bcqf-req">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className={`bcqf-input${errors.email ? " bcqf-input-error" : ""}`}
                placeholder="e.g. john@email.com"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <span className="bcqf-error">{errors.email}</span>}
            </div>

            {/* Country */}
            <div className="bcqf-field">
              <label className="bcqf-label" htmlFor="country">
                Country / Region <span className="bcqf-req">*</span>
              </label>
              <select
                id="country"
                name="country"
                className={`bcqf-select${errors.country ? " bcqf-input-error" : ""}`}
                value={form.country}
                onChange={handleChange}
              >
                <option value="">Select Country</option>
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              {errors.country && <span className="bcqf-error">{errors.country}</span>}
            </div>

          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════ */}
      {/* ALL SET + GET QUOTE BUTTON            */}
      {/* ══════════════════════════════════════ */}
      <div className="bcqf-submit-section">
        <div className="bcqf-allset">
          <h2 className="bcqf-allset-title">You're all set !</h2>
        </div>

        {errors.cardSize && (
          <p className="bcqf-error bcqf-size-error">{errors.cardSize}</p>
        )}

        <button
          type="submit"
          className={`bcqf-submit-btn${isFormComplete() ? " bcqf-submit-btn--active" : ""}`}
          disabled={!isFormComplete() || submitting}
        >
          {submitting ? (
            <><span className="bcqf-spinner bcqf-spinner--white" /> Submitting…</>
          ) : (
            "Get Quote"
          )}
        </button>

        {!isFormComplete() && (
          <p className="bcqf-submit-hint">
            Please fill in all required fields and select a card size to enable the button.
          </p>
        )}
      </div>

    </form>
  );
};

export default CorporateQoute;