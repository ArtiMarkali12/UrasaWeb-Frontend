import React, { useState, useEffect, useCallback } from "react";
import "./BookletQuote.css";
import CountrySelector from "./CountrySelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ── Size images ──────────────────────────────────────────────────
import usSize from "../../assets/images/servicesImage/ussize.png";
import europeSize from "../../assets/images/servicesImage/Europe.png";
import japanSize from "../../assets/images/servicesImage/japan.png";
import squareSize from "../../assets/images/servicesImage/square.png";
import circleSize from "../../assets/images/servicesImage/circle.png";
import foldedCard from "../../assets/images/servicesImage/square.png";
import miniCard from "../../assets/images/servicesImage/square.png";
import customCard from "../../assets/images/servicesImage/square.png";

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : {};

/* Determine field type based on backend configuration or fallback to patterns */
const getFieldTypeInfo = (categoryKey, subcategory) => {
  if (subcategory?.fieldType) {
    return {
      type: subcategory.fieldType,
      placeholder: subcategory.placeholder || "",
      required: subcategory.required || false,
    };
  }

  const catKey = categoryKey.toLowerCase();
  const subKey = (
    subcategory?.displayName ||
    subcategory?.subcategoryKey ||
    ""
  ).toLowerCase();

  if (catKey.includes("customer") || catKey.includes("detail")) {
    if (subKey.includes("name"))
      return { type: "text", placeholder: "Enter your name", required: true };
    if (subKey.includes("email"))
      return { type: "email", placeholder: "Enter your email", required: true };
    if (subKey.includes("phone"))
      return {
        type: "tel",
        placeholder: "Enter your phone number",
        required: true,
      };
    if (subKey.includes("address"))
      return {
        type: "text",
        placeholder: "Enter your address",
        required: false,
      };
  }

  if (catKey.includes("general")) {
    if (subKey.includes("quantity"))
      return { type: "number", placeholder: "e.g., 500", required: true };
    if (subKey.includes("size")) return { type: "select", required: false };
  }

  if (catKey.includes("cover")) {
    if (subKey.includes("flap")) return { type: "boolean", required: false };
    if (subKey.includes("finish")) return { type: "select", required: false };
    if (subKey.includes("grammage") || subKey.includes("weight"))
      return { type: "select", required: false };
  }

  if (catKey.includes("interior")) {
    if (subKey.includes("page") && subKey.includes("number"))
      return { type: "number", placeholder: "e.g., 48", required: true };
    if (subKey.includes("color")) return { type: "select", required: false };
    if (subKey.includes("grammage") || subKey.includes("weight"))
      return { type: "select", required: false };
    if (subKey.includes("type")) return { type: "select", required: false };
  }

  if (catKey.includes("special") || catKey.includes("finishing")) {
    if (subKey.includes("print")) return { type: "checkbox", required: false };
    if (subKey.includes("edge")) return { type: "select", required: false };
  }

  if (catKey.includes("additional") || catKey.includes("note")) {
    return { type: "textarea", required: false };
  }

  if (catKey.includes("packaging")) {
    return { type: "checkbox", required: false };
  }

  return { type: "select", placeholder: "Select option", required: false };
};

const isRequired = (categoryKey, subcategoryKey) => {
  const subKey = subcategoryKey.toLowerCase();
  return (
    subKey.includes("quantity") ||
    subKey.includes("name") ||
    subKey.includes("email") ||
    subKey.includes("phone") ||
    (subKey.includes("page") && subKey.includes("number"))
  );
};

const buildEmptyForm = (categories) => {
  const form = {};

  Object.entries(categories).forEach(([catKey, category]) => {
    Object.entries(safeObj(category?.subcategories)).forEach(
      ([subKey, subcategory]) => {
        const fieldInfo = getFieldTypeInfo(catKey, subcategory);

        if (fieldInfo.type === "checkbox") {
          form[subKey] = [];
        } else if (fieldInfo.type === "boolean") {
          form[subKey] = false;
        } else {
          form[subKey] = "";
        }
      },
    );

    const hasDirectField =
      category?.fieldType &&
      Object.keys(safeObj(category?.subcategories)).length === 0;
    if (hasDirectField) {
      const fieldInfo = getFieldTypeInfo(catKey, category);
      if (fieldInfo.type === "checkbox") {
        form[catKey] = [];
      } else if (fieldInfo.type === "boolean") {
        form[catKey] = false;
      } else {
        form[catKey] = "";
      }
    }

    const directAttributes = safeArr(category?.attributes);
    if (directAttributes.length > 0 && !hasDirectField) {
      form[catKey] = [];
    }
  });

  return form;
};

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const BusinessCardQuote = () => {
  const [categories, setCategories] = useState({});
  const [formData, setFormData] = useState({});
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    email: "",
    country: "",
  });
  const [expectedDate, setExpectedDate] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Size Selector states
  const [selectedSize, setSelectedSize] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customHeight, setCustomHeight] = useState("");
  const [sizeText, setSizeText] = useState("");
  const [carouselIndex, setCarouselIndex] = useState(0);

  // Size options with images
  const sizeOptions = [
    { label: "US Size", img: usSize, dimensions: '3.5" X 2"' },
    { label: "Europe Size", img: europeSize, dimensions: '3.35" X 2.17"' },
    { label: "Japan Size", img: japanSize, dimensions: '3.58" X 2.17"' },
    { label: "Square", img: squareSize, dimensions: '2.5" X 2.5"' },
    { label: "Circle", img: circleSize, dimensions: '2.5" X 2.5"' },
    { label: "Folded Card", img: foldedCard, dimensions: '3.5" X 4"' },
    { label: "Mini Card", img: miniCard, dimensions: '3.5" X 1"' },
    { label: "Custom", img: customCard, dimensions: "Your size" },
  ];

  // Carousel navigation
  const itemsToShow = 5;
  const maxIndex = Math.max(0, sizeOptions.length - itemsToShow);

  const nextSlide = () =>
    setCarouselIndex((prev) => Math.min(prev + 1, maxIndex));
  const prevSlide = () => setCarouselIndex((prev) => Math.max(prev - 1, 0));

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX);
    setScrollLeft(carouselIndex);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX;
    const walk = (x - startX) / 120;
    if (Math.abs(walk) > 0.3) {
      const newIndex = Math.max(
        0,
        Math.min(maxIndex, Math.round(scrollLeft - walk)),
      );
      setCarouselIndex(newIndex);
    }
  };

  const handleMouseUp = () => setIsDragging(false);
  const handleMouseLeave = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].pageX);
    setScrollLeft(carouselIndex);
  };

  const handleTouchMove = (e) => {
    const x = e.touches[0].pageX;
    const walk = (x - startX) / 120;
    if (Math.abs(walk) > 0.3) {
      const newIndex = Math.max(
        0,
        Math.min(maxIndex, Math.round(scrollLeft - walk)),
      );
      setCarouselIndex(newIndex);
    }
  };

  /* ── fetch options ── */
  const fetchOptions = useCallback(() => {
    setFetching(true);
    fetch(`${API_BASE_URL}/api/business-card/options`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          const cats = safeObj(data.data?.categories ?? data.data);
          setCategories(cats);
          setFormData(buildEmptyForm(cats));
        }
      })
      .catch((err) => {
        console.error("Error fetching options:", err);
        setError("Failed to load form options. Please refresh the page.");
      })
      .finally(() => setFetching(false));
  }, []);

  useEffect(() => {
    fetchOptions();
  }, [fetchOptions]);

  // Auto-generate order date
  useEffect(() => {
    if (
      customerDetails.name &&
      customerDetails.name.trim() &&
      customerDetails.email &&
      customerDetails.email.trim() &&
      !orderDate
    ) {
      const today = new Date().toISOString().split("T")[0];
      setOrderDate(today);
    }
  }, [customerDetails.name, customerDetails.email, orderDate]);

  /* ── field change ── */
  const handleChange = (subKey, value) => {
    setFormData((prev) => ({ ...prev, [subKey]: value }));
  };

  /* ── size selector handlers ── */
  const handleSizeSelect = (size) => {
    setSelectedSize(size);
    if (size !== "Custom") {
      setCustomWidth("");
      setCustomHeight("");
    }
  };

  const handleMultiCheck = (subKey, value) => {
    setFormData((prev) => {
      const cur = safeArr(prev[subKey]);
      return {
        ...prev,
        [subKey]: cur.includes(value)
          ? cur.filter((v) => v !== value)
          : [...cur, value],
      };
    });
  };

  /* ── validation ── */
  const isFormValid = useCallback(() => {
    if (Object.keys(categories).length === 0) return false;
    if (!customerDetails.name || !customerDetails.name.trim()) return false;
    if (!customerDetails.email || !customerDetails.email.trim()) return false;
    if (!selectedSize) return false;
    if (selectedSize === "Custom") {
      if (!customWidth || !customHeight) return false;
    }

    Object.entries(categories).forEach(([catKey, category]) => {
      Object.entries(safeObj(category?.subcategories)).forEach(([subKey]) => {
        if (isRequired(catKey, subKey)) {
          const val = formData[subKey];
          if (val === undefined || val === null || val === "") return false;
          if (Array.isArray(val) && val.length === 0) return false;
        }
      });
    });

    return true;
  }, [
    formData,
    categories,
    customerDetails,
    selectedSize,
    customWidth,
    customHeight,
  ]);

  /* ── build POST payload ── */
  const buildPayload = () => {
    const selectedSizeObj = sizeOptions.find((s) => s.label === selectedSize);

    let finalCardSize = "";
    if (selectedSize === "Custom") {
      finalCardSize = `Custom (${customWidth || ""} x ${customHeight || ""} inches)`;
    } else if (selectedSizeObj) {
      finalCardSize = `${selectedSize} (${selectedSizeObj.dimensions})`;
    }

    // Build the payload matching backend validator structure
    const payload = {
      // Required: basicsAndDimensions
      basicsAndDimensions: {
        projectName: customerDetails.name || "Business Card",
        quantity: formData["quantity"] || "500",
        numberOfDifferentNames: formData["numberOfDifferentNames"] || "1",
        cardSize: finalCardSize || 'US Size (3.5" X 2")',
        orientation: formData["orientation"] || "portrait",
      },

      // Required: paperAndMaterial
      paperAndMaterial: {
        paperStock:
          formData["paperStock"] || formData["paperType"] || "Standard",
        printingSides:
          formData["printingSides"] ||
          formData["printingSide"] ||
          "Single Side",
      },

      // Required: customerDetails
      customerDetails: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        phone: formData["phone"] || "N/A",
        country: customerDetails.country || "",
      },

      // Timeline
      timeline: {
        orderDate: orderDate || new Date().toISOString().split("T")[0],
        expectedDate: expectedDate || "",
      },

      // Size specifications for admin display
      sizeSpecifications: {
        selectedSize: selectedSize || "",
        additionalInfo: sizeText || "",
      },
    };

    // Map any additional form fields from backend categories
    Object.entries(categories).forEach(([catKey, category]) => {
      Object.entries(safeObj(category?.subcategories)).forEach(
        ([subKey, subcategory]) => {
          const value = formData[subKey];
          const subKeyLower = subKey.toLowerCase();

          if (subKeyLower.includes("quantity")) {
            payload.basicsAndDimensions.quantity = value;
          } else if (
            subKeyLower.includes("card") &&
            subKeyLower.includes("size")
          ) {
            payload.basicsAndDimensions.cardSize = value;
          } else if (subKeyLower.includes("orientation")) {
            payload.basicsAndDimensions.orientation = value.toLowerCase();
          } else if (
            subKeyLower.includes("paper") &&
            subKeyLower.includes("stock")
          ) {
            payload.paperAndMaterial.paperStock = value;
          } else if (
            subKeyLower.includes("print") &&
            subKeyLower.includes("side")
          ) {
            payload.paperAndMaterial.printingSides = value;
          } else if (
            subKeyLower.includes("special") &&
            subKeyLower.includes("effect")
          ) {
            payload.specialEffects = safeArr(value);
          } else if (subKeyLower.includes("lamination")) {
            payload.laminationAndCoating = payload.laminationAndCoating || {};
            payload.laminationAndCoating.type = value;
          } else if (
            subKeyLower.includes("corner") &&
            subKeyLower.includes("type")
          ) {
            payload.cornerStyle = payload.cornerStyle || {};
            payload.cornerStyle.type = value;
          } else if (
            subKeyLower.includes("corner") &&
            subKeyLower.includes("color")
          ) {
            payload.cornerStyle = payload.cornerStyle || {};
            payload.cornerStyle.color = value;
          } else if (subKeyLower.includes("foil")) {
            payload.laminationAndCoating = payload.laminationAndCoating || {};
            payload.laminationAndCoating.premiumFinishes =
              payload.laminationAndCoating.premiumFinishes || {};
            payload.laminationAndCoating.premiumFinishes.foilColor = value;
          } else if (
            subKeyLower.includes("note") ||
            subKeyLower.includes("additional")
          ) {
            payload.additionalNotes = value;
          } else if (subKeyLower.includes("name")) {
            payload.customerDetails.name = value;
          } else if (subKeyLower.includes("email")) {
            payload.customerDetails.email = value;
          } else if (subKeyLower.includes("phone")) {
            payload.customerDetails.phone = value;
          }
        },
      );
    });

    return payload;
  };

  /* ── submit ── */
  const handleSubmit = async () => {
    if (!isFormValid() || loading) return;
    setLoading(true);
    setError("");
    try {
      const payload = buildPayload();

      console.log(
        "🚀 Sending complete payload to backend:",
        JSON.stringify(payload, null, 2),
      );

      const res = await fetch(`${API_BASE_URL}/api/business-card`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData(buildEmptyForm(categories));
        setSelectedSize("");
        setCustomWidth("");
        setCustomHeight("");
        setSizeText("");
        setCarouselIndex(0);
      } else {
        setError(data.message ?? "Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────
     FIELD RENDERER
  ───────────────────────────────────────── */
  const renderField = (categoryKey, subcategoryKey, subcategory) => {
    const label = subcategory.displayName || subcategoryKey;
    const attributes = safeArr(subcategory.attributes);
    const fieldInfo = getFieldTypeInfo(categoryKey, subcategory);
    const value = formData[subcategoryKey] ?? "";
    const required =
      fieldInfo.required || isRequired(categoryKey, subcategoryKey);

    if (fieldInfo.type === "textarea") {
      return (
        <div key={subcategoryKey} className="bq-field bq-field-full">
          <label className="bq-label">
            {label}
            {!required && <span className="bq-optional"> (Optional)</span>}
          </label>
          <p className="bq-note-hint">
            Please give us any special information or instructions.
          </p>
          <textarea
            className="bq-textarea"
            rows={4}
            placeholder={
              fieldInfo.placeholder ||
              "Enter any special instructions or notes here..."
            }
            value={value}
            onChange={(e) => handleChange(subcategoryKey, e.target.value)}
          />
        </div>
      );
    }

    if (fieldInfo.type === "checkbox") {
      return (
        <div key={subcategoryKey} className="bq-field bq-field-full">
          <label className="bq-label">{label}</label>
          <div className="bq-multiselect-wrap">
            {attributes.length === 0 ? (
              <span className="bq-no-opts">No options available</span>
            ) : (
              attributes.map((opt) => (
                <label key={opt} className="bq-chip-label">
                  <input
                    type="checkbox"
                    checked={safeArr(formData[subcategoryKey]).includes(opt)}
                    onChange={() => handleMultiCheck(subcategoryKey, opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    if (fieldInfo.type === "radio") {
      return (
        <div key={subcategoryKey} className="bq-field bq-field-full">
          <label className="bq-label">
            {label}
            {required && <span className="bq-req"> *</span>}
          </label>
          <div className="bq-radio-group">
            {attributes.length === 0 ? (
              <span className="bq-no-opts">No options available</span>
            ) : (
              attributes.map((opt) => (
                <label key={opt} className="bq-radio-item">
                  <input
                    type="radio"
                    name={subcategoryKey}
                    value={opt}
                    checked={formData[subcategoryKey] === opt}
                    onChange={(e) =>
                      handleChange(subcategoryKey, e.target.value)
                    }
                  />
                  <span>{opt}</span>
                </label>
              ))
            )}
          </div>
        </div>
      );
    }

    if (fieldInfo.type === "boolean") {
      return (
        <div
          key={subcategoryKey}
          className="bq-checkbox-container"
          style={{ marginTop: "16px" }}
        >
          <label className="bq-checkbox-label">
            <input
              type="checkbox"
              checked={value === true || value === "true" || value === "yes"}
              onChange={(e) => handleChange(subcategoryKey, e.target.checked)}
            />
            <span className="bq-checkbox-text">
              {label}
              {required && <span className="bq-req"> *</span>}
            </span>
          </label>
        </div>
      );
    }

    if (fieldInfo.type === "number") {
      return (
        <div key={subcategoryKey} className="bq-field">
          <label className="bq-label">
            {label}
            {required && <span className="bq-req"> *</span>}
          </label>
          <input
            className="bq-input"
            type="number"
            placeholder={fieldInfo.placeholder || ""}
            value={value}
            min="1"
            onChange={(e) => handleChange(subcategoryKey, e.target.value)}
          />
        </div>
      );
    }

    if (["text", "email", "tel"].includes(fieldInfo.type)) {
      return (
        <div key={subcategoryKey} className="bq-field">
          <label className="bq-label">
            {label}
            {required && <span className="bq-req"> *</span>}
          </label>
          <input
            className="bq-input"
            type={fieldInfo.type}
            placeholder={fieldInfo.placeholder || ""}
            value={value}
            onChange={(e) => handleChange(subcategoryKey, e.target.value)}
          />
        </div>
      );
    }

    return (
      <div key={subcategoryKey} className="bq-field">
        <label className="bq-label">
          {label}
          {required && <span className="bq-req"> *</span>}
        </label>
        <div className="bq-select-wrap">
          <select
            className="bq-select"
            value={value}
            onChange={(e) => handleChange(subcategoryKey, e.target.value)}
            disabled={attributes.length === 0}
          >
            <option value="">
              {attributes.length === 0
                ? "No options available"
                : `Select ${label}`}
            </option>
            {attributes.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
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
  const renderStep = (categoryKey, category, stepIndex) => {
    const subcategories = safeObj(category?.subcategories);
    const subEntries = Object.entries(subcategories);
    const directAttributes = safeArr(category?.attributes);
    const hasDirectField = subEntries.length === 0 && category?.fieldType;

    return (
      <div key={categoryKey} className="bq-step">
        <div className="bq-step-header">
          <span className="bq-step-number">{stepIndex + 1}.</span>
          <span className="bq-step-title">
            {category.displayName || categoryKey}
          </span>
        </div>

        <div className="bq-step-body">
          {subEntries.length === 0 &&
          directAttributes.length === 0 &&
          !hasDirectField ? (
            <span className="bq-no-opts">No fields configured yet.</span>
          ) : (
            <>
              {directAttributes.length > 0 && !hasDirectField && (
                <div
                  className="bq-field bq-field-full"
                  style={{ marginBottom: subEntries.length > 0 ? "20px" : "0" }}
                >
                  <label className="bq-label">
                    {category.displayName || categoryKey}
                    <span className="bq-optional">
                      {" "}
                      (Select all that apply)
                    </span>
                  </label>
                  <div className="bq-multiselect-wrap">
                    {directAttributes.map((opt) => (
                      <label key={opt} className="bq-chip-label">
                        <input
                          type="checkbox"
                          checked={safeArr(
                            formData[categoryKey] || [],
                          ).includes(opt)}
                          onChange={() => handleMultiCheck(categoryKey, opt)}
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {subEntries.length > 0 && (
                <div className="bq-row bq-row-4">
                  {subEntries.map(([subKey, subcat]) =>
                    renderField(categoryKey, subKey, subcat),
                  )}
                </div>
              )}

              {hasDirectField &&
                renderField(categoryKey, categoryKey, {
                  displayName: category.displayName || categoryKey,
                  fieldType: category.fieldType,
                  placeholder: category.placeholder,
                  required: category.required,
                  attributes: directAttributes,
                })}
            </>
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
          <p>We'll get back to you shortly with your business card quote.</p>
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
          Fill information as per your requirements to complete the steps and
          get your quote!
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
     MAIN FORM
  ───────────────────────────────────────── */
  return (
    <div className="bq-wrapper">
      <p className="bq-intro-text">
        Fill information as per your requirements to complete the steps and get
        your quote!
      </p>

      {/* Customer Information Section */}
      <div className="bq-step">
        <div className="bq-step-header">
          <span className="bq-step-number">1.</span>
          <span className="bq-step-title">Customer Information</span>
        </div>
        <div className="bq-step-body">
          <div className="bq-row bq-row-3">
            <div className="bq-field">
              <label className="bq-label">
                Your Name <span className="bq-req"> *</span>
              </label>
              <input
                className="bq-input"
                type="text"
                placeholder="Enter your name"
                value={customerDetails.name}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    name: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="bq-field">
              <label className="bq-label">
                Email Address <span className="bq-req"> *</span>
              </label>
              <input
                className="bq-input"
                type="email"
                placeholder="Enter your email"
                value={customerDetails.email}
                onChange={(e) =>
                  setCustomerDetails({
                    ...customerDetails,
                    email: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className="bq-field">
              <label className="bq-label">
                Country <span className="bq-optional"> (Optional)</span>
              </label>
              <CountrySelector
                value={customerDetails.country}
                onChange={(countryName) =>
                  setCustomerDetails({
                    ...customerDetails,
                    country: countryName,
                  })
                }
                placeholder="Select your country"
              />
            </div>
          </div>
          <div className="bq-row bq-row-3" style={{ marginTop: "16px" }}>
            <div className="bq-field">
              <label className="bq-label">Order Date</label>
              <input
                className="bq-input"
                type="text"
                value={
                  orderDate
                    ? new Date(orderDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "Auto-generated after filling details"
                }
                readOnly
                style={{
                  backgroundColor: orderDate ? "#f0f0ff" : "#f9f9f9",
                  cursor: "default",
                }}
              />
            </div>
            <div className="bq-field">
              <label className="bq-label">
                Expected Date <span className="bq-optional"> (Optional)</span>
              </label>
              <input
                className="bq-input"
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size Selector Section */}
      <div className="bq-step">
        <div className="bq-step-header">
          <span className="bq-step-number">2.</span>
          <span className="bq-step-title">Size Selection</span>
        </div>
        <div className="bq-step-body">
          <div className="bq-carousel-container">
            <button
              className="bq-carousel-arrow bq-carousel-prev"
              onClick={prevSlide}
              disabled={carouselIndex === 0}
              aria-label="Previous sizes"
            >
              ‹
            </button>

            <div
              className="bq-carousel-viewport"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              style={{ cursor: isDragging ? "grabbing" : "grab" }}
            >
              <div
                className="bq-carousel-track"
                style={{
                  transform: `translateX(-${carouselIndex * (100 / itemsToShow)}%)`,
                }}
              >
                {sizeOptions.map((size) => (
                  <div
                    key={size.label}
                    onClick={() => handleSizeSelect(size.label)}
                    className={`bq-size-item ${
                      selectedSize === size.label ? "bq-size-item-active" : ""
                    } ${size.label === "Custom" ? "bq-size-item-custom" : ""}`}
                  >
                    {size.label === "Custom" ? (
                      <>
                        <div className="bq-size-img-wrap">
                          <img
                            src={size.img}
                            alt={`${size.label} size card`}
                            className="bq-size-img"
                            loading="lazy"
                          />
                        </div>
                        <p className="bq-size-label">{size.label}</p>
                        {selectedSize === "Custom" && (
                          <div
                            className="bq-custom-inputs"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="text"
                              placeholder="W"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(e.target.value)}
                              className="bq-custom-input"
                            />
                            <input
                              type="text"
                              placeholder="H"
                              value={customHeight}
                              onChange={(e) => setCustomHeight(e.target.value)}
                              className="bq-custom-input"
                            />
                          </div>
                        )}
                        {selectedSize !== "Custom" && (
                          <p className="bq-size-dimensions">
                            {size.dimensions}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <div className="bq-size-img-wrap">
                          <img
                            src={size.img}
                            alt={`${size.label} size card`}
                            className="bq-size-img"
                            loading="lazy"
                          />
                        </div>
                        <p className="bq-size-label">{size.label}</p>
                        <p className="bq-size-dimensions">{size.dimensions}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <button
              className="bq-carousel-arrow bq-carousel-next"
              onClick={nextSlide}
              disabled={carouselIndex >= maxIndex}
              aria-label="Next sizes"
            >
              ›
            </button>
          </div>

          <div className="bq-carousel-indicators">
            {sizeOptions.map((_, index) => (
              <button
                key={index}
                className={`bq-carousel-dot ${
                  index >= carouselIndex && index < carouselIndex + itemsToShow
                    ? "bq-carousel-dot-active"
                    : ""
                }`}
                onClick={() => {
                  const newIndex = Math.min(index, maxIndex);
                  setCarouselIndex(newIndex);
                }}
                aria-label={`Go to size ${index + 1}`}
              />
            ))}
          </div>

          <div className="bq-size-text-input">
            <label className="bq-label">
              Additional Information{" "}
              <span className="bq-optional">(Optional)</span>
            </label>
            <input
              className="bq-input"
              type="text"
              placeholder="Enter any additional details about your size requirements"
              value={sizeText}
              onChange={(e) => setSizeText(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Dynamic Categories from Backend */}
      {Object.keys(categories).length === 0 ? (
        <div className="bq-no-data">
          <p>
            No configuration options available. Please add options from the
            admin panel.
          </p>
        </div>
      ) : (
        <>
          {Object.entries(categories).map(([catKey, category], index) =>
            renderStep(catKey, category, index + 2),
          )}

          {error && <p className="bq-error">{error}</p>}

          <div className="bq-footer">
            <h2 className="bq-allset">You're all set!</h2>
            <button
              className={`bq-submit-btn ${isFormValid() ? "bq-submit-btn--active" : ""}`}
              onClick={handleSubmit}
              disabled={!isFormValid() || loading}
            >
              {loading ? "Submitting..." : "Get Quote"}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BusinessCardQuote;
