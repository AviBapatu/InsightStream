import React, { useState, useRef, useEffect } from "react";

const CustomDropdown = ({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.code === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleSelect = (optionCode) => {
    onChange(optionCode);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-2.5 bg-white border rounded-full flex items-center justify-between focus:outline-none transition-all duration-200 ${
          isOpen
            ? "border-gold-600 ring-2 ring-gold-600 shadow-md"
            : "border-gray-300 hover:border-gold-400"
        }`}
      >
        <span className="flex items-center gap-2.5">
          {selectedOption?.flag && (
            <span className="text-lg">{selectedOption.flag}</span>
          )}
          <span className="text-gray-900 font-medium text-sm">
            {selectedOption?.name || placeholder}
          </span>
        </span>
        <svg
          className={`w-5 h-5 transition-all duration-300 ${
            isOpen ? "rotate-180 text-gold-600" : "text-gray-400"
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-2xl max-h-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="overflow-y-auto max-h-64 py-1">
            {options.map((option, index) => (
              <button
                key={option.code}
                type="button"
                onClick={() => handleSelect(option.code)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-all duration-150 text-left relative ${
                  value === option.code ? "bg-gold-50" : "hover:bg-gray-50"
                } ${index !== 0 ? "border-t border-gray-100" : ""}`}
              >
                {/* Active Indicator Bar */}
                {value === option.code && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold-600" />
                )}

                {option.flag && (
                  <span className="text-xl ml-2">{option.flag}</span>
                )}
                <span
                  className={`font-medium text-sm flex-1 ${
                    value === option.code ? "text-gold-700" : "text-gray-900"
                  }`}
                >
                  {option.name}
                </span>
                {value === option.code && (
                  <svg
                    className="w-5 h-5 text-gold-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;
