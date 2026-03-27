// import React, { useState, useEffect } from "react";
// import "./BookletQuote.css";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const defaultForm = {
//   quantity: "",
//   bookSize: "",
//   orientation: "",
//   bindingStyle: {
//     bindingType: "",
//     coverStyle: "",
//     coverFlaps: false,
//   },
//   interiorSpecifications: {
//     numberOfPages: "",
//     printColor: "",
//     paperWeight: "",
//     paperType: "",
//     coverFinish: "",
//   },
//   specialFinishing: {
//     printFinishing: [],
//     pageEdges: "",
//   },
//   packaging: "",
//   additionalNotes: "",
//   customerDetails: {
//     name: "",
//     email: "",
//     phone: "",
//     address: "",
//   },
// };

// const orientationOptions = ["Portrait", "Landscape"];

// const BookletQuote = () => {
//   const [options, setOptions] = useState({
//     bookSizes: [],
//     bindingTypes: [],
//     coverStyles: [],
//     printColors: [],
//     paperWeights: [],
//     paperTypes: [],
//     coverFinishes: [],
//     pageEdges: [],
//     packaging: [],
//     specialFinishing: [],
//   });

//   // Safe getter — always returns an array even if API sends undefined/null
//   const getOpt = (key) => (Array.isArray(options[key]) ? options[key] : []);

//   const [form, setForm] = useState(defaultForm);
//   const [loading, setLoading] = useState(false);
//   const [submitted, setSubmitted] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetch(`${API_BASE_URL}/api/booklet-quote/options`)
//       .then((res) => res.json())
//       .then((data) => {
//         if (data.success) setOptions(data.data);
//       })
//       .catch(() => {});
//   }, []);

//   // Check if all required fields are filled
//   const isFormValid = () => {
//     const {
//       quantity,
//       bookSize,
//       orientation,
//       bindingStyle,
//       interiorSpecifications,
//       specialFinishing,
//       packaging,
//       customerDetails,
//     } = form;

//     return (
//       quantity &&
//       bookSize &&
//       orientation &&
//       bindingStyle.bindingType &&
//       bindingStyle.coverStyle &&
//       interiorSpecifications.numberOfPages &&
//       interiorSpecifications.printColor &&
//       interiorSpecifications.paperWeight &&
//       interiorSpecifications.paperType &&
//       interiorSpecifications.coverFinish &&
//       specialFinishing.pageEdges &&
//       packaging &&
//       customerDetails.name &&
//       customerDetails.email &&
//       customerDetails.phone
//     );
//   };

//   const handleChange = (path, value) => {
//     setForm((prev) => {
//       const keys = path.split(".");
//       if (keys.length === 1) return { ...prev, [keys[0]]: value };
//       return {
//         ...prev,
//         [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
//       };
//     });
//   };

//   const handleMultiSelect = (value) => {
//     setForm((prev) => {
//       const current = prev.specialFinishing.printFinishing;
//       const updated = current.includes(value)
//         ? current.filter((v) => v !== value)
//         : [...current, value];
//       return {
//         ...prev,
//         specialFinishing: { ...prev.specialFinishing, printFinishing: updated },
//       };
//     });
//   };

//   const handleSubmit = async () => {
//     if (!isFormValid()) return;
//     setLoading(true);
//     setError("");
//     try {
//       const res = await fetch(`${API_BASE_URL}/api/booklet-quote`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });
//       const data = await res.json();
//       if (data.success) {
//         setSubmitted(true);
//         setForm(defaultForm);
//       } else {
//         setError("Something went wrong. Please try again.");
//       }
//     } catch {
//       setError("Network error. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (submitted) {
//     return (
//       <div className="bq-success-screen">
//         <div className="bq-success-card">
//           <div className="bq-success-icon">✓</div>
//           <h2>Quote Submitted!</h2>
//           <p>We'll get back to you shortly with your booklet quote.</p>
//           <button className="bq-restart-btn" onClick={() => setSubmitted(false)}>
//             Submit Another Quote
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const SelectField = ({ label, path, optionsList, placeholder }) => (
//     <div className="bq-field">
//       <label className="bq-label">{label}</label>
//       <div className="bq-select-wrap">
//         <select
//           className="bq-select"
//           value={path.includes(".") ? form[path.split(".")[0]][path.split(".")[1]] : form[path]}
//           onChange={(e) => handleChange(path, e.target.value)}
//         >
//           <option value="">{placeholder || `Select ${label}`}</option>
//           {optionsList.map((opt) => (
//             <option key={opt} value={opt}>{opt}</option>
//           ))}
//         </select>
//         <span className="bq-select-arrow">▾</span>
//       </div>
//     </div>
//   );

//   return (
//     <div className="bq-wrapper">
//       <p className="bq-intro-text">
//         Fill information as per your requirements to complete the steps and get your quote !
//       </p>

//       {/* STEP 1: General Details */}
//       <div className="bq-step">
//         <div className="bq-step-header">
//           <span className="bq-step-number">1.</span>
//           <span className="bq-step-title">General Details</span>
//         </div>
//         <div className="bq-step-body">
//           <div className="bq-row bq-row-3">
//             <div className="bq-field">
//               <label className="bq-label">Quantity <span className="bq-req">*</span></label>
//               <input
//                 className="bq-input"
//                 type="number"
//                 placeholder="e.g. 500"
//                 value={form.quantity}
//                 onChange={(e) => handleChange("quantity", e.target.value)}
//                 min="1"
//               />
//             </div>
//             <SelectField label="Size" path="bookSize" optionsList={getOpt("bookSizes")} placeholder="Select Size" />
//             <SelectField label="Orientation" path="orientation" optionsList={orientationOptions} placeholder="Select Orientation" />
//           </div>
//         </div>
//       </div>

//       {/* STEP 2: Cover */}
//       <div className="bq-step">
//         <div className="bq-step-header">
//           <span className="bq-step-number">2.</span>
//           <span className="bq-step-title">Cover</span>
//         </div>
//         <div className="bq-step-body">
//           <div className="bq-row bq-row-4">
//             <SelectField label="Paper Grammage" path="interiorSpecifications.paperWeight" optionsList={getOpt("paperWeights")} />
//             <SelectField label="Cover Finish" path="interiorSpecifications.coverFinish" optionsList={getOpt("coverFinishes")} />
//             <div className="bq-field">
//               <label className="bq-label">Cover Flaps (French Flaps)</label>
//               <div className="bq-select-wrap">
//                 <select
//                   className="bq-select"
//                   value={form.bindingStyle.coverFlaps ? "yes" : "no"}
//                   onChange={(e) => handleChange("bindingStyle.coverFlaps", e.target.value === "yes")}
//                 >
//                   <option value="no">No</option>
//                   <option value="yes">Yes</option>
//                 </select>
//                 <span className="bq-select-arrow">▾</span>
//               </div>
//             </div>
//             <SelectField label="Edges" path="specialFinishing.pageEdges" optionsList={getOpt("pageEdges")} />
//           </div>
//           <div className="bq-row bq-row-2 bq-mt">
//             <div className="bq-field bq-field-full">
//               <label className="bq-label">Special Finishing</label>
//               <div className="bq-multiselect-wrap">
//                 {getOpt("specialFinishing").length === 0 ? (
//                   <span className="bq-no-opts">No options available</span>
//                 ) : (
//                   getOpt("specialFinishing").map((opt) => (
//                     <label key={opt} className="bq-chip-label">
//                       <input
//                         type="checkbox"
//                         checked={form.specialFinishing.printFinishing.includes(opt)}
//                         onChange={() => handleMultiSelect(opt)}
//                       />
//                       <span>{opt}</span>
//                     </label>
//                   ))
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* STEP 3: Interior Specification */}
//       <div className="bq-step">
//         <div className="bq-step-header">
//           <span className="bq-step-number">3.</span>
//           <span className="bq-step-title">Interior Specification</span>
//         </div>
//         <div className="bq-step-body">
//           <div className="bq-row bq-row-4">
//             <div className="bq-field">
//               <label className="bq-label">No. of Pages <span className="bq-req">*</span></label>
//               <input
//                 className="bq-input"
//                 type="number"
//                 placeholder="e.g. 48"
//                 value={form.interiorSpecifications.numberOfPages}
//                 onChange={(e) => handleChange("interiorSpecifications.numberOfPages", e.target.value)}
//                 min="4"
//               />
//             </div>
//             <SelectField label="Print Color" path="interiorSpecifications.printColor" optionsList={getOpt("printColors")} />
//             <SelectField label="Paper Grammage" path="interiorSpecifications.paperWeight" optionsList={getOpt("paperWeights")} />
//             <SelectField label="Paper Type" path="interiorSpecifications.paperType" optionsList={getOpt("paperTypes")} />
//           </div>
//           <div className="bq-row bq-mt">
//             <SelectField label="Binding Type" path="bindingStyle.bindingType" optionsList={getOpt("bindingTypes")} />
//             <SelectField label="Cover Style" path="bindingStyle.coverStyle" optionsList={getOpt("coverStyles")} />
//             <SelectField label="Packaging" path="packaging" optionsList={getOpt("packaging")} />
//           </div>
//         </div>
//       </div>

//       {/* STEP 4: Additional Note */}
//       <div className="bq-step">
//         <div className="bq-step-header">
//           <span className="bq-step-number">4.</span>
//           <span className="bq-step-title">Additional Note <span className="bq-optional">(Optional)</span></span>
//         </div>
//         <div className="bq-step-body">
//           <p className="bq-note-hint">Please give us any special information or instructions. (If none, type Null)</p>
//           <textarea
//             className="bq-textarea"
//             rows={4}
//             placeholder="Enter any special instructions or notes here..."
//             value={form.additionalNotes}
//             onChange={(e) => handleChange("additionalNotes", e.target.value)}
//           />
//         </div>
//       </div>

//       {/* STEP 5: Customer Details */}
//       <div className="bq-step">
//         <div className="bq-step-header">
//           <span className="bq-step-number">5.</span>
//           <span className="bq-step-title"></span>
//         </div>
//         <div className="bq-step-body">
//           <div className="bq-row bq-row-3">
//             <div className="bq-field">
//               <label className="bq-label">Your Name / Project name <span className="bq-req">*</span></label>
//               <input
//                 className="bq-input"
//                 type="text"
//                 placeholder="Your Name / Project Name"
//                 value={form.customerDetails.name}
//                 onChange={(e) => handleChange("customerDetails.name", e.target.value)}
//               />
//             </div>
//             <div className="bq-field">
//               <label className="bq-label">Email ID <span className="bq-req">*</span></label>
//               <input
//                 className="bq-input"
//                 type="email"
//                 placeholder="Email ID"
//                 value={form.customerDetails.email}
//                 onChange={(e) => handleChange("customerDetails.email", e.target.value)}
//               />
//             </div>
//             <div className="bq-field">
//               <label className="bq-label">Phone <span className="bq-req">*</span></label>
//               <input
//                 className="bq-input"
//                 type="tel"
//                 placeholder="Phone Number"
//                 value={form.customerDetails.phone}
//                 onChange={(e) => handleChange("customerDetails.phone", e.target.value)}
//               />
//             </div>
//           </div>
//           <div className="bq-row bq-mt">
//             <div className="bq-field">
//               <label className="bq-label">Address <span className="bq-optional">(Optional)</span></label>
//               <input
//                 className="bq-input"
//                 type="text"
//                 placeholder="Address"
//                 value={form.customerDetails.address}
//                 onChange={(e) => handleChange("customerDetails.address", e.target.value)}
//               />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* You're all set + Get Quote */}
//       {error && <p className="bq-error">{error}</p>}

//       <div className="bq-footer">
//         <h2 className="bq-allset">You're all set !</h2>
//         <button
//           className={`bq-submit-btn ${isFormValid() ? "bq-submit-btn--active" : ""}`}
//           onClick={handleSubmit}
//           disabled={!isFormValid() || loading}
//         >
//           {loading ? "Submitting..." : "Get Quote"}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default BookletQuote;



import React, { useState, useEffect, useCallback } from "react";
import "./BookletQuote.css";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ─────────────────────────────────────────────
   STEP ORDER — categoryKey must match backend
───────────────────────────────────────────── */
const STEP_ORDER = [
  { key: "generalDetails",         label: "General Details"        },
  { key: "cover",                  label: "Cover"                  },
  { key: "interiorSpecification",  label: "Interior Specification" },
  { key: "additionalNote",         label: "Additional Note"        },
  { key: "customerDetails",        label: "Customer Details"       },
];

/* ─────────────────────────────────────────────
   FIELD CONFIG — subcategoryKey → render hints
───────────────────────────────────────────── */
const FIELD_CONFIG = {
  quantity:        { type: "number",     placeholder: "e.g. 500",              required: true  },
  numberOfPages:   { type: "number",     placeholder: "e.g. 48",               required: true  },
  additionalNotes: { type: "textarea",   required: false                                        },
  coverFlaps:      { type: "boolean",    required: false                                        },
  printFinishing:  { type: "multicheck", required: false                                        },
  name:            { type: "text",       placeholder: "Your Name / Project Name", required: true  },
  email:           { type: "email",      placeholder: "Email ID",              required: true  },
  phone:           { type: "tel",        placeholder: "Phone Number",          required: true  },
  address:         { type: "text",       placeholder: "Address",               required: false },
};

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : {};

const buildEmptyForm = (categories) => {
  const form = {};
  Object.values(safeObj(categories)).forEach((cat) => {
    Object.entries(safeObj(cat?.subcategories)).forEach(([subKey]) => {
      const cfg = FIELD_CONFIG[subKey] || {};
      if (cfg.type === "multicheck") form[subKey] = [];
      else if (cfg.type === "boolean") form[subKey] = false;
      else form[subKey] = "";
    });
  });
  return form;
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const BookletQuote = () => {
  const [categories, setCategories] = useState({});
  const [formData,   setFormData]   = useState({});
  const [loading,    setLoading]    = useState(false);
  const [fetching,   setFetching]   = useState(true);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  /* ── fetch options ── */
  const fetchOptions = useCallback(() => {
    setFetching(true);
    fetch(`${API_BASE_URL}/api/booklet-quote/options`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          /* support both { categories: {...} } and flat data */
          const cats = safeObj(data.data?.categories ?? data.data);
          setCategories(cats);
          setFormData(buildEmptyForm(cats));
        }
      })
      .catch(() => {})
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  /* ── field change ── */
  const handleChange = (subKey, value) =>
    setFormData((prev) => ({ ...prev, [subKey]: value }));

  const handleMultiCheck = (subKey, value) =>
    setFormData((prev) => {
      const cur = safeArr(prev[subKey]);
      return {
        ...prev,
        [subKey]: cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value],
      };
    });

  /* ── validation ── */
  const isFormValid = useCallback(() => {
    return Object.entries(FIELD_CONFIG).every(([key, cfg]) => {
      if (!cfg.required) return true;
      const val = formData[key];
      if (val === undefined || val === null) return false;
      if (typeof val === "string") return val.trim() !== "";
      if (Array.isArray(val)) return val.length > 0;
      return true;
    });
  }, [formData]);

  /* ── build POST payload matching existing booklet-quote schema ── */
  const buildPayload = () => ({
    quantity:    formData.quantity    ?? "",
    bookSize:    formData.bookSize    ?? "",
    orientation: formData.orientation ?? "",
    bindingStyle: {
      bindingType: formData.bindingType ?? "",
      coverStyle:  formData.coverStyle  ?? "",
      coverFlaps:  formData.coverFlaps  ?? false,
    },
    interiorSpecifications: {
      numberOfPages: formData.numberOfPages ?? "",
      printColor:    formData.printColor    ?? "",
      paperWeight:   formData.paperWeight   ?? "",
      paperType:     formData.paperType     ?? "",
      coverFinish:   formData.coverFinish   ?? "",
    },
    specialFinishing: {
      printFinishing: safeArr(formData.printFinishing),
      pageEdges:      formData.pageEdges ?? "",
    },
    packaging:       formData.packaging       ?? "",
    additionalNotes: formData.additionalNotes ?? "",
    customerDetails: {
      name:    formData.name    ?? "",
      email:   formData.email   ?? "",
      phone:   formData.phone   ?? "",
      address: formData.address ?? "",
    },
    timeline: {
      orderDate:    new Date().toISOString().split("T")[0],
      expectedDate: "",
    },
  });

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!isFormValid() || loading) return;
    setLoading(true);
    setError("");
    try {
      const res  = await fetch(`${API_BASE_URL}/api/booklet-quote`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(buildPayload()),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitted(true);
        setFormData(buildEmptyForm(categories));
      } else {
        setError(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     FIELD RENDERER
  ───────────────────────────────────────── */
  const renderField = (subKey, subcat) => {
    const cfg        = FIELD_CONFIG[subKey] || { type: "select", required: false };
    const attributes = safeArr(subcat?.attributes);
    const label      = subcat?.label ?? subKey;
    const value      = formData[subKey] ?? "";

    /* TEXTAREA */
    if (cfg.type === "textarea") {
      return (
        <div key={subKey} className="bq-field bq-field-full">
          <p className="bq-note-hint">
            Please give us any special information or instructions. (If none, type Null)
          </p>
          <textarea
            className="bq-textarea"
            rows={4}
            placeholder="Enter any special instructions or notes here..."
            value={value}
            onChange={(e) => handleChange(subKey, e.target.value)}
          />
        </div>
      );
    }

    /* MULTICHECK chips */
    if (cfg.type === "multicheck") {
      return (
        <div key={subKey} className="bq-field bq-field-full">
          <label className="bq-label">{label}</label>
          <div className="bq-multiselect-wrap">
            {attributes.length === 0 ? (
              <span className="bq-no-opts">No options available</span>
            ) : (
              attributes.map((opt) => (
                <label key={opt} className="bq-chip-label">
                  <input
                    type="checkbox"
                    checked={safeArr(formData[subKey]).includes(opt)}
                    onChange={() => handleMultiCheck(subKey, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    /* BOOLEAN yes/no */
    if (cfg.type === "boolean") {
      return (
        <div key={subKey} className="bq-field">
          <label className="bq-label">{label}</label>
          <div className="bq-select-wrap">
            <select
              className="bq-select"
              value={value ? "yes" : "no"}
              onChange={(e) => handleChange(subKey, e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
            <span className="bq-select-arrow">▾</span>
          </div>
        </div>
      );
    }

    /* NUMBER */
    if (cfg.type === "number") {
      return (
        <div key={subKey} className="bq-field">
          <label className="bq-label">
            {label}
            {cfg.required && <span className="bq-req"> *</span>}
          </label>
          <input
            className="bq-input"
            type="number"
            placeholder={cfg.placeholder ?? ""}
            value={value}
            min="1"
            onChange={(e) => handleChange(subKey, e.target.value)}
          />
        </div>
      );
    }

    /* TEXT / EMAIL / TEL */
    if (["text", "email", "tel"].includes(cfg.type)) {
      return (
        <div key={subKey} className="bq-field">
          <label className="bq-label">
            {label}
            {cfg.required  && <span className="bq-req"> *</span>}
            {!cfg.required && <span className="bq-optional"> (Optional)</span>}
          </label>
          <input
            className="bq-input"
            type={cfg.type}
            placeholder={cfg.placeholder ?? ""}
            value={value}
            onChange={(e) => handleChange(subKey, e.target.value)}
          />
        </div>
      );
    }

    /* DEFAULT — dropdown */
    return (
      <div key={subKey} className="bq-field">
        <label className="bq-label">
          {label}
          {cfg.required && <span className="bq-req"> *</span>}
        </label>
        <div className="bq-select-wrap">
          <select
            className="bq-select"
            value={value}
            onChange={(e) => handleChange(subKey, e.target.value)}
          >
            <option value="">Select {label}</option>
            {attributes.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <span className="bq-select-arrow">▾</span>
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────
     STEP RENDERER
  ───────────────────────────────────────── */
  const renderStep = (stepDef, stepIndex) => {
    const cat          = categories[stepDef.key];
    const subcategories = safeObj(cat?.subcategories);
    const subEntries   = Object.entries(subcategories);
    const isNoteStep   = stepDef.key === "additionalNote";
    const colCount     = Math.min(Math.max(subEntries.length, 1), 4);

    return (
      <div key={stepDef.key} className="bq-step">
        <div className="bq-step-header">
          <span className="bq-step-number">{stepIndex + 1}.</span>
          <span className="bq-step-title">
            {cat?.label ?? stepDef.label}
            {isNoteStep && (
              <span className="bq-optional"> (Optional)</span>
            )}
          </span>
        </div>

        <div className="bq-step-body">
          {isNoteStep ? (
            renderField("additionalNotes", {
              label: "Additional Notes",
              attributes: [],
            })
          ) : subEntries.length === 0 ? (
            <span className="bq-no-opts">No fields configured yet.</span>
          ) : (
            <div className={`bq-row bq-row-${colCount}`}>
              {subEntries.map(([subKey, subcat]) =>
                renderField(subKey, subcat)
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────
     SUCCESS
  ───────────────────────────────────────── */
  if (submitted) {
    return (
      <div className="bq-success-screen">
        <div className="bq-success-card">
          <div className="bq-success-icon">✓</div>
          <h2>Quote Submitted!</h2>
          <p>We'll get back to you shortly with your booklet quote.</p>
          <button
            className="bq-restart-btn"
            onClick={() => {
              setSubmitted(false);
              fetchOptions();
            }}
          >
            Submit Another Quote
          </button>
        </div>
      </div>
    );
  }

  /* ─────────────────────────────────────────
     LOADING SKELETON
  ───────────────────────────────────────── */
  if (fetching) {
    return (
      <div className="bq-wrapper">
        <p className="bq-intro-text">
          Fill information as per your requirements to complete the steps and get your quote !
        </p>
        {[1, 2, 3, 4, 5].map((n) => (
          <div key={n} className="bq-step bq-step--skeleton">
            <div className="bq-skeleton-header" />
            <div className="bq-step-body">
              <div className="bq-skeleton-row">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bq-skeleton-field" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /* ─────────────────────────────────────────
     MAIN
  ───────────────────────────────────────── */
  return (
    <div className="bq-wrapper">
      <p className="bq-intro-text">
        Fill information as per your requirements to complete the steps and get your quote !
      </p>

      {STEP_ORDER.map((stepDef, idx) => renderStep(stepDef, idx))}

      {error && <p className="bq-error">{error}</p>}

      <div className="bq-footer">
        <h2 className="bq-allset">You're all set !</h2>
        <button
          className={`bq-submit-btn ${isFormValid() ? "bq-submit-btn--active" : ""}`}
          onClick={handleSubmit}
          disabled={!isFormValid() || loading}
        >
          {loading ? "Submitting..." : "Get Quote"}
        </button>
      </div>
    </div>
  );
};

export default BookletQuote;