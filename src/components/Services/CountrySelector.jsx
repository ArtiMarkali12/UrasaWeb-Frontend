import React, { useState, useRef, useEffect, useMemo } from "react";
import ReactCountryFlag from "react-country-flag";
import "./CountrySelector.css";

const COUNTRIES = [
  { code: "AF", name: "Afghanistan" },
  { code: "AL", name: "Albania" },
  { code: "DZ", name: "Algeria" },
  { code: "AD", name: "Andorra" },
  { code: "AO", name: "Angola" },
  { code: "AG", name: "Antigua and Barbuda" },
  { code: "AR", name: "Argentina" },
  { code: "AM", name: "Armenia" },
  { code: "AU", name: "Australia" },
  { code: "AT", name: "Austria" },
  { code: "AZ", name: "Azerbaijan" },
  { code: "BS", name: "Bahamas" },
  { code: "BH", name: "Bahrain" },
  { code: "BD", name: "Bangladesh" },
  { code: "BB", name: "Barbados" },
  { code: "BY", name: "Belarus" },
  { code: "BE", name: "Belgium" },
  { code: "BZ", name: "Belize" },
  { code: "BJ", name: "Benin" },
  { code: "BT", name: "Bhutan" },
  { code: "BO", name: "Bolivia" },
  { code: "BA", name: "Bosnia and Herzegovina" },
  { code: "BW", name: "Botswana" },
  { code: "BR", name: "Brazil" },
  { code: "BN", name: "Brunei" },
  { code: "BG", name: "Bulgaria" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "CV", name: "Cabo Verde" },
  { code: "KH", name: "Cambodia" },
  { code: "CM", name: "Cameroon" },
  { code: "CA", name: "Canada" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "CL", name: "Chile" },
  { code: "CN", name: "China" },
  { code: "CO", name: "Colombia" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (Democratic Republic)" },
  { code: "CR", name: "Costa Rica" },
  { code: "HR", name: "Croatia" },
  { code: "CU", name: "Cuba" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czechia" },
  { code: "DK", name: "Denmark" },
  { code: "DJ", name: "Djibouti" },
  { code: "DM", name: "Dominica" },
  { code: "DO", name: "Dominican Republic" },
  { code: "EC", name: "Ecuador" },
  { code: "EG", name: "Egypt" },
  { code: "SV", name: "El Salvador" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "EE", name: "Estonia" },
  { code: "SZ", name: "Eswatini" },
  { code: "ET", name: "Ethiopia" },
  { code: "FJ", name: "Fiji" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GE", name: "Georgia" },
  { code: "DE", name: "Germany" },
  { code: "GH", name: "Ghana" },
  { code: "GR", name: "Greece" },
  { code: "GD", name: "Grenada" },
  { code: "GT", name: "Guatemala" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "GY", name: "Guyana" },
  { code: "HT", name: "Haiti" },
  { code: "HN", name: "Honduras" },
  { code: "HU", name: "Hungary" },
  { code: "IS", name: "Iceland" },
  { code: "IN", name: "India" },
  { code: "ID", name: "Indonesia" },
  { code: "IR", name: "Iran" },
  { code: "IQ", name: "Iraq" },
  { code: "IE", name: "Ireland" },
  { code: "IL", name: "Israel" },
  { code: "IT", name: "Italy" },
  { code: "JM", name: "Jamaica" },
  { code: "JP", name: "Japan" },
  { code: "JO", name: "Jordan" },
  { code: "KZ", name: "Kazakhstan" },
  { code: "KE", name: "Kenya" },
  { code: "KI", name: "Kiribati" },
  { code: "KP", name: "North Korea" },
  { code: "KR", name: "South Korea" },
  { code: "XK", name: "Kosovo" },
  { code: "KW", name: "Kuwait" },
  { code: "KG", name: "Kyrgyzstan" },
  { code: "LA", name: "Laos" },
  { code: "LV", name: "Latvia" },
  { code: "LB", name: "Lebanon" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "MY", name: "Malaysia" },
  { code: "MV", name: "Maldives" },
  { code: "ML", name: "Mali" },
  { code: "MT", name: "Malta" },
  { code: "MH", name: "Marshall Islands" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MX", name: "Mexico" },
  { code: "FM", name: "Micronesia" },
  { code: "MD", name: "Moldova" },
  { code: "MC", name: "Monaco" },
  { code: "MN", name: "Mongolia" },
  { code: "ME", name: "Montenegro" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "MM", name: "Myanmar" },
  { code: "NA", name: "Namibia" },
  { code: "NR", name: "Nauru" },
  { code: "NP", name: "Nepal" },
  { code: "NL", name: "Netherlands" },
  { code: "NZ", name: "New Zealand" },
  { code: "NI", name: "Nicaragua" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "MK", name: "North Macedonia" },
  { code: "NO", name: "Norway" },
  { code: "OM", name: "Oman" },
  { code: "PK", name: "Pakistan" },
  { code: "PW", name: "Palau" },
  { code: "PA", name: "Panama" },
  { code: "PG", name: "Papua New Guinea" },
  { code: "PY", name: "Paraguay" },
  { code: "PE", name: "Peru" },
  { code: "PH", name: "Philippines" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "QA", name: "Qatar" },
  { code: "RO", name: "Romania" },
  { code: "RU", name: "Russia" },
  { code: "RW", name: "Rwanda" },
  { code: "KN", name: "Saint Kitts and Nevis" },
  { code: "LC", name: "Saint Lucia" },
  { code: "VC", name: "Saint Vincent and the Grenadines" },
  { code: "WS", name: "Samoa" },
  { code: "SM", name: "San Marino" },
  { code: "ST", name: "Sao Tome and Principe" },
  { code: "SA", name: "Saudi Arabia" },
  { code: "SN", name: "Senegal" },
  { code: "RS", name: "Serbia" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SG", name: "Singapore" },
  { code: "SK", name: "Slovakia" },
  { code: "SI", name: "Slovenia" },
  { code: "SB", name: "Solomon Islands" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "ES", name: "Spain" },
  { code: "LK", name: "Sri Lanka" },
  { code: "SD", name: "Sudan" },
  { code: "SR", name: "Suriname" },
  { code: "SE", name: "Sweden" },
  { code: "CH", name: "Switzerland" },
  { code: "SY", name: "Syria" },
  { code: "TW", name: "Taiwan" },
  { code: "TJ", name: "Tajikistan" },
  { code: "TZ", name: "Tanzania" },
  { code: "TH", name: "Thailand" },
  { code: "TL", name: "Timor-Leste" },
  { code: "TG", name: "Togo" },
  { code: "TO", name: "Tonga" },
  { code: "TT", name: "Trinidad and Tobago" },
  { code: "TN", name: "Tunisia" },
  { code: "TR", name: "Turkey" },
  { code: "TM", name: "Turkmenistan" },
  { code: "TV", name: "Tuvalu" },
  { code: "UG", name: "Uganda" },
  { code: "UA", name: "Ukraine" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "UY", name: "Uruguay" },
  { code: "UZ", name: "Uzbekistan" },
  { code: "VU", name: "Vanuatu" },
  { code: "VA", name: "Vatican City" },
  { code: "VE", name: "Venezuela" },
  { code: "VN", name: "Vietnam" },
  { code: "YE", name: "Yemen" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const CountrySelector = ({
  value,
  onChange,
  placeholder = "Select a country",
}) => {
  const [search, setSearch] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [dropdownPos, setDropdownPos] = useState({
    top: 0,
    left: 0,
    width: 300,
  });
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  const searchRef = useRef(null);

  const filteredCountries = useMemo(() => {
    if (!search) return COUNTRIES;
    const lower = search.toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        c.name.toLowerCase().includes(lower) ||
        c.code.toLowerCase().includes(lower),
    );
  }, [search]);

  // Calculate dropdown position below the trigger
  const updatePosition = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      const isMobile = window.innerWidth <= 480;

      if (isMobile) {
        // On mobile: center it with margins
        const screenWidth = window.innerWidth;
        const dropdownWidth = Math.min(screenWidth - 24, 380);
        const leftOffset = (screenWidth - dropdownWidth) / 2;
        const topOffset = Math.max(rect.bottom + 6, 0);

        setDropdownPos({
          top: topOffset,
          left: leftOffset,
          width: dropdownWidth,
        });
      } else {
        // On desktop: align with trigger
        setDropdownPos({
          top: rect.bottom + 6,
          left: rect.left,
          width: Math.max(rect.width, 320),
        });
      }
    }
  };

  // Close on outside click + reposition on scroll/resize + body scroll lock (all screens)
  useEffect(() => {
    if (isOpen) {
      // Lock body scroll
      const scrollY = window.scrollY;
      wrapperRef.current._savedScroll = scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      // Initial position
      updatePosition();
    } else {
      // Unlock body scroll
      const savedScroll = wrapperRef.current?._savedScroll ?? 0;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, savedScroll);
    }

    if (!isOpen) return;

    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearch("");
        setHighlightedIndex(-1);
      }
    };
    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (
      highlightedIndex >= 0 &&
      listRef.current &&
      listRef.current.children[highlightedIndex]
    ) {
      const item = listRef.current.children[highlightedIndex];
      const list = listRef.current;
      const itemTop = item.offsetTop;
      const itemBottom = itemTop + item.offsetHeight;
      const scrollTop = list.scrollTop;
      const listHeight = list.clientHeight;

      if (itemTop < scrollTop) {
        list.scrollTop = itemTop;
      } else if (itemBottom > scrollTop + listHeight) {
        list.scrollTop = itemBottom - listHeight;
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (country) => {
    onChange(country.name);
    setIsOpen(false);
    setSearch("");
    setHighlightedIndex(-1);
  };

  const handleToggle = (e) => {
    e.preventDefault();
    if (isOpen) {
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
    } else {
      setSearch("");
      setHighlightedIndex(-1);
      setIsOpen(true);
      // Position after render
      requestAnimationFrame(() => updatePosition());
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredCountries[highlightedIndex]) {
        handleSelect(filteredCountries[highlightedIndex]);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
      setSearch("");
      setHighlightedIndex(-1);
    }
  };

  const selectedCountry = COUNTRIES.find((c) => c.name === value);

  return (
    <div className="country-selector" ref={wrapperRef}>
      {/* Trigger */}
      <div
        className={`country-selector-input ${isOpen ? "country-selector-input-open" : ""}`}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
      >
        {selectedCountry ? (
          <div className="country-selector-selected">
            <ReactCountryFlag
              countryCode={selectedCountry.code}
              svg
              className="country-selector-flag"
              title={selectedCountry.name}
            />
            <span className="country-selector-selected-name">
              {selectedCountry.name}
            </span>
          </div>
        ) : (
          <span className="country-selector-placeholder">{placeholder}</span>
        )}
        <span className="country-selector-arrow">&#9660;</span>
      </div>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="country-selector-backdrop"
          onClick={() => {
            setIsOpen(false);
            setSearch("");
            setHighlightedIndex(-1);
          }}
        />
      )}

      {/* Dropdown */}
      {isOpen && (
        <div
          className="country-selector-dropdown"
          style={{
            top: `${dropdownPos.top}px`,
            left: `${dropdownPos.left}px`,
            width: `${dropdownPos.width}px`,
          }}
        >
          <div className="country-selector-search-wrap">
            <span className="country-selector-search-icon">&#128269;</span>
            <input
              ref={searchRef}
              type="text"
              className="country-selector-search"
              placeholder="Search country..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightedIndex(-1);
              }}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button
                type="button"
                className="country-selector-clear"
                onClick={() => {
                  setSearch("");
                  setHighlightedIndex(-1);
                  if (searchRef.current) searchRef.current.focus();
                }}
              >
                &times;
              </button>
            )}
          </div>

          <ul className="country-selector-list" ref={listRef}>
            {filteredCountries.length === 0 ? (
              <li className="country-selector-no-result">No countries found</li>
            ) : (
              filteredCountries.map((country, index) => (
                <li
                  key={country.code}
                  className={`country-selector-item ${
                    index === highlightedIndex
                      ? "country-selector-item-highlighted"
                      : ""
                  } ${selectedCountry?.code === country.code ? "country-selector-item-selected" : ""}`}
                  onClick={() => handleSelect(country)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <ReactCountryFlag
                    countryCode={country.code}
                    svg
                    className="country-selector-flag"
                    title={country.name}
                  />
                  <span className="country-selector-item-name">
                    {country.name}
                  </span>
                </li>
              ))
            )}
          </ul>

          <div className="country-selector-footer">
            {filteredCountries.length}{" "}
            {filteredCountries.length === 1 ? "country" : "countries"} available
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
export { COUNTRIES };
