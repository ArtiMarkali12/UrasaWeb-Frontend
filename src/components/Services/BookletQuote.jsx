import React, { useState, useEffect, useCallback } from "react";
import "./BookletQuote.css";
import CountrySelector from "./CountrySelector";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
const safeArr = (v) => (Array.isArray(v) ? v : []);
const safeObj = (v) =>
  v && typeof v === "object" && !Array.isArray(v) ? v : {};

/* Determine field type based on backend configuration or fallback to patterns */
const getFieldTypeInfo = (categoryKey, subcategory) => {
  // First check if backend provided fieldType
  if (subcategory?.fieldType) {
    return {
      type: subcategory.fieldType,
      placeholder: subcategory.placeholder || "",
      required: subcategory.required || false,
    };
  }

  // Fallback to pattern matching for backward compatibility
  const catKey = categoryKey.toLowerCase();
  const subKey = (
    subcategory?.displayName ||
    subcategory?.subcategoryKey ||
    ""
  ).toLowerCase();

  // Customer details
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

  // General details
  if (catKey.includes("general")) {
    if (subKey.includes("quantity"))
      return { type: "number", placeholder: "e.g., 500", required: true };
    if (subKey.includes("size")) return { type: "select", required: false };
    if (subKey.includes("orientation"))
      return { type: "select", required: false };
  }

  // Cover related
  if (catKey.includes("cover")) {
    if (subKey.includes("flap")) return { type: "boolean", required: false };
    if (subKey.includes("finish")) return { type: "select", required: false };
    if (subKey.includes("grammage") || subKey.includes("weight"))
      return { type: "select", required: false };
  }

  // Interior
  if (catKey.includes("interior")) {
    if (subKey.includes("page") && subKey.includes("number"))
      return { type: "number", placeholder: "e.g., 48", required: true };
    if (subKey.includes("color")) return { type: "select", required: false };
    if (subKey.includes("grammage") || subKey.includes("weight"))
      return { type: "select", required: false };
    if (subKey.includes("type")) return { type: "select", required: false };
    if (subKey.includes("finish")) return { type: "select", required: false };
  }

  // Special finishing
  if (catKey.includes("special") || catKey.includes("finishing")) {
    if (subKey.includes("print")) return { type: "checkbox", required: false };
    if (subKey.includes("edge")) return { type: "select", required: false };
  }

  // Additional
  if (catKey.includes("additional") || catKey.includes("note")) {
    return { type: "textarea", required: false };
  }

  // Packaging
  if (catKey.includes("packaging")) {
    return { type: "checkbox", required: false };
  }

  // Default: select dropdown
  return { type: "select", placeholder: "Select option", required: false };
};

/* Check if field is required */
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

/* Build empty form from categories */
const buildEmptyForm = (categories) => {
  const form = {};

  Object.entries(categories).forEach(([catKey, category]) => {
    // Handle subcategories
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

    // Handle direct field type (for categories without subcategories like "Additional Notes")
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

    // Handle direct attributes (for categories like "Special Finishing", "Packaging")
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
const BookletQuote = () => {
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
    {
      label: "S",
      img: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=200&h=200&fit=crop",
      dimensions: "4x6 inches",
    },
    {
      label: "M",
      img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop",
      dimensions: "5x7 inches",
    },
    {
      label: "L",
      img: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&h=200&fit=crop",
      dimensions: "6x9 inches",
    },
    {
      label: "XL",
      img: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=200&h=200&fit=crop",
      dimensions: "8x10 inches",
    },
    {
      label: "XXL",
      img: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=200&h=200&fit=crop",
      dimensions: "8.5x11 inches",
    },
    {
      label: "A5",
      img: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200&h=200&fit=crop",
      dimensions: "5.8x8.3 inches",
    },
    {
      label: "A4",
      img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=200&h=200&fit=crop",
      dimensions: "8.3x11.7 inches",
    },
    {
      label: "Square",
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop",
      dimensions: "8x8 inches",
    },
    {
      label: "Landscape",
      img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=200&fit=crop",
      dimensions: "11x8.5 inches",
    },
    {
      label: "Square1",
      img: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=200&h=200&fit=crop",
      dimensions: "8x8 inches",
    },
    {
      label: "Landscape2",
      img: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=200&h=200&fit=crop",
      dimensions: "11x8.5 inches",
    },
    {
      label: "Custom",
      img: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=200&h=200&fit=crop",
      dimensions: "Your size",
    },
  ];

  // Carousel navigation
  const itemsToShow = 5;
  const maxIndex = Math.max(0, sizeOptions.length - itemsToShow);

  const nextSlide = () => {
    setCarouselIndex((prev) => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => Math.max(prev - 1, 0));
  };

  const visibleSizes = sizeOptions.slice(
    carouselIndex,
    carouselIndex + itemsToShow,
  );

  // Mouse drag state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Mouse drag handlers
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

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
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
    fetch(`${API_BASE_URL}/api/booklet-quote/options`)
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

  // Auto-generate order date when name and email are filled
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

  const handleSizeSubmit = () => {
    const finalSize = selectedSize === "Custom" ? customSize : selectedSize;

    if (!finalSize) {
      alert("Please select or enter a size");
      return;
    }

    // Size is saved - continue with form
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

    // Validate customer details (name and email required, country optional)
    if (!customerDetails.name || !customerDetails.name.trim()) return false;
    if (!customerDetails.email || !customerDetails.email.trim()) return false;

    // Validate size selection
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
    // Find the selected size object to get dimensions
    const selectedSizeObj = sizeOptions.find((s) => s.label === selectedSize);

    // Build the complete size string for backend - always include inches
    let finalBookSize = "";
    let widthValue = "";
    let heightValue = "";

    if (selectedSize === "Custom") {
      widthValue = customWidth || "";
      heightValue = customHeight || "";
      finalBookSize = `Custom (${widthValue} x ${heightValue} inches)`;
    } else if (selectedSizeObj) {
      // Extract dimensions from the size object (e.g., "5x7 inches" -> width: "5", height: "7")
      const dims = selectedSizeObj.dimensions.split(" ")[0].split("x");
      widthValue = dims[0] || "";
      heightValue = dims[1] || "";
      finalBookSize = `${selectedSize} (${selectedSizeObj.dimensions})`;
    }

    console.log("📦 Building payload with size data:", {
      selectedSize,
      widthInches: widthValue,
      heightInches: heightValue,
      bookSize: finalBookSize,
    });

    const payload = {
      // Required fields for backend validation
      bookSize: finalBookSize,
      quantity: formData["quantity"] || "1", // Default to 1 if not filled yet

      customerDetails: {
        name: customerDetails.name || "",
        email: customerDetails.email || "",
        country: customerDetails.country || "",
        phone: "",
        address: "",
      },
      timeline: {
        orderDate: orderDate || new Date().toISOString().split("T")[0],
        expectedDate: expectedDate || "",
      },

      // Additional size details for admin panel display
      sizeSpecifications: {
        selectedSize: selectedSize || "",
        widthInches: widthValue,
        heightInches: heightValue,
        additionalInfo: sizeText || "",
      },
    };

    Object.entries(categories).forEach(([catKey, category]) => {
      Object.entries(safeObj(category?.subcategories)).forEach(
        ([subKey, subcategory]) => {
          const value = formData[subKey];
          const subKeyLower = subKey.toLowerCase();

          // Map to appropriate structure
          if (subKeyLower.includes("quantity")) {
            payload.quantity = value;
          } else if (subKeyLower.includes("size")) {
            // Skip - we already set bookSize from our size selector
            // Only override if user manually entered a different size field
            if (!selectedSize) {
              payload.bookSize = value;
            }
          } else if (subKeyLower.includes("orientation")) {
            // Only set orientation if it has a valid value, convert to lowercase
            if (value && value !== "") {
              payload.orientation = value.toLowerCase();
            }
          } else if (
            subKeyLower.includes("binding") &&
            subKeyLower.includes("type")
          ) {
            payload.bindingStyle = payload.bindingStyle || {};
            payload.bindingStyle.bindingType = value;
          } else if (
            subKeyLower.includes("cover") &&
            subKeyLower.includes("style")
          ) {
            payload.bindingStyle = payload.bindingStyle || {};
            payload.bindingStyle.coverStyle = value;
          } else if (subKeyLower.includes("flap")) {
            payload.bindingStyle = payload.bindingStyle || {};
            // Send as boolean true/false from checkbox
            payload.bindingStyle.coverFlaps = !!value;
          } else if (
            subKeyLower.includes("page") &&
            subKeyLower.includes("number")
          ) {
            payload.interiorSpecifications =
              payload.interiorSpecifications || {};
            payload.interiorSpecifications.numberOfPages = value;
          } else if (subKeyLower.includes("color")) {
            payload.interiorSpecifications =
              payload.interiorSpecifications || {};
            payload.interiorSpecifications.printColor = value;
          } else if (
            subKeyLower.includes("weight") ||
            subKeyLower.includes("grammage")
          ) {
            payload.interiorSpecifications =
              payload.interiorSpecifications || {};
            payload.interiorSpecifications.paperWeight = value;
          } else if (
            subKeyLower.includes("type") &&
            !subKeyLower.includes("binding")
          ) {
            payload.interiorSpecifications =
              payload.interiorSpecifications || {};
            payload.interiorSpecifications.paperType = value;
          } else if (
            subKeyLower.includes("finish") &&
            !subKeyLower.includes("print")
          ) {
            payload.interiorSpecifications =
              payload.interiorSpecifications || {};
            payload.interiorSpecifications.coverFinish = value;
          } else if (
            subKeyLower.includes("print") &&
            subKeyLower.includes("finishing")
          ) {
            payload.specialFinishing = payload.specialFinishing || {};
            payload.specialFinishing.printFinishing = safeArr(value);
          } else if (
            subKeyLower.includes("finishing") &&
            !subKeyLower.includes("cover")
          ) {
            // Fallback for "Special Finishing" category
            payload.specialFinishing = payload.specialFinishing || {};
            payload.specialFinishing.printFinishing = safeArr(value);
          } else if (subKeyLower.includes("edge")) {
            payload.specialFinishing = payload.specialFinishing || {};
            payload.specialFinishing.pageEdges = value;
          } else if (subKeyLower.includes("packaging")) {
            payload.packaging = value;
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
          } else if (subKeyLower.includes("address")) {
            payload.customerDetails.address = value;
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

      const res = await fetch(`${API_BASE_URL}/api/booklet-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        setSubmitted(true);
        setFormData(buildEmptyForm(categories));
        // Reset size selector
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
     FIELD RENDERER - Shows subcategory as label, attributes as dropdown options
  ───────────────────────────────────────── */
  const renderField = (categoryKey, subcategoryKey, subcategory) => {
    const label = subcategory.displayName || subcategoryKey;
    const attributes = safeArr(subcategory.attributes);
    const fieldInfo = getFieldTypeInfo(categoryKey, subcategory);
    const value = formData[subcategoryKey] ?? "";
    const required =
      fieldInfo.required || isRequired(categoryKey, subcategoryKey);

    /* TEXTAREA */
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

    /* CHECKBOX (for multiple options like special finishing, packaging) */
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

    /* RADIO BUTTONS (for single selection from multiple options) */
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

    /* BOOLEAN - Checkbox (like "I agree" checkbox) */
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

    /* NUMBER */
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

    /* TEXT / EMAIL / TEL */
    if (["text", "email", "tel"].includes(fieldInfo.type)) {
      return (
        <div key={subcategoryKey} className="bq-field">
          <label className="bq-label">
            {label}
            {required && <span className="bq-req"> *</span>}
            {!required && <span className="bq-optional"> (Optional)</span>}
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

    /* DEFAULT — SELECT DROPDOWN with attributes from backend */
    // /////////////////////////////////////////////////////////////////////////////////////////////////////
    return (
      <div key={subcategoryKey} className="bq-field">
        <h1>Test</h1>
        <label className="bq-label">
          {label}
          {required && <span className="bq-req"> *</span>}
        </label>
        <div className="bq-select-wrap">
          <select
            className="form-control p-2 bg-danger"
            value={value}
            onChange={(e) => handleChange(subcategoryKey, e.target.value)}
            disabled={attributes.length === 0}
          >
            <option
              value=""
            >
              {attributes.length === 0
                ? "No options available"
                : `Select ${label}`}
            </option>
            {attributes.map((opt) => (
              <option
                key={opt}
                value={opt}
              >
                <div>{opt}</div>
              </option>
            ))}
          </select>
          {/* <span className="bq-select-arrow">▾</span> */}
        </div>
      </div>
    );
  };

  /* ─────────────────────────────────────────
     STEP RENDERER - Categories as steps, subcategories as fields
  ───────────────────────────────────────── */
  const renderStep = (categoryKey, category, stepIndex) => {
    const subcategories = safeObj(category?.subcategories);
    const subEntries = Object.entries(subcategories);
    const directAttributes = safeArr(category?.attributes);
    const colCount = Math.min(Math.max(subEntries.length, 1), 4);

    // Check if category has no subcategories but has field type configured
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
              {/* Render direct attributes as multi-check if any - SHOW FIRST */}
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

              {/* Render subcategory fields - SHOW AFTER direct attributes */}
              {subEntries.length > 0 && (
                <div className={`bq-row bq-row-${colCount}`}>
                  {subEntries.map(([subKey, subcat]) =>
                    renderField(categoryKey, subKey, subcat),
                  )}
                </div>
              )}

              {/* Render category as direct field if no subcategories (and no direct attributes) */}
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

      {/* Customer Information Section - Static */}
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

      {/* Size Selector Section - After Customer Information */}
      <div className="bq-step">
        <div className="bq-step-header">
          <span className="bq-step-number">2.</span>
          <span className="bq-step-title">Size Selection</span>
        </div>
        <div className="bq-step-body">
          {/* Size Carousel Container */}
          <div className="bq-carousel-container">
            {/* Previous Arrow */}
            <button
              className="bq-carousel-arrow bq-carousel-prev"
              onClick={prevSlide}
              disabled={carouselIndex === 0}
              aria-label="Previous sizes"
            >
              ‹
            </button>

            {/* Carousel Viewport */}
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
                            alt={`${size.label} size booklet`}
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
                              placeholder="Width (e.g., 5)"
                              value={customWidth}
                              onChange={(e) => setCustomWidth(e.target.value)}
                              className="bq-custom-input"
                            />
                            <input
                              type="text"
                              placeholder="Height (e.g., 7)"
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
                            alt={`${size.label} size booklet`}
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

            {/* Next Arrow */}
            <button
              className="bq-carousel-arrow bq-carousel-next"
              onClick={nextSlide}
              disabled={carouselIndex >= maxIndex}
              aria-label="Next sizes"
            >
              ›
            </button>
          </div>

          {/* Carousel Indicators */}
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

          {/* Text Input for Additional Size Information */}
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
              className={`bq-submit-btn ${
                isFormValid() ? "bq-submit-btn--active" : ""
              }`}
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

export default BookletQuote;
