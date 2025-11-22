import { useState, useEffect } from "react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { motion, AnimatePresence } from "framer-motion";
import DraggableBottomSheet from "./modals/DraggableBottomSheet";
import { CustomDropdown } from "./common";

// Language options for filter
const LANGUAGE_OPTIONS = [
  { code: "", name: "All Languages", flag: "🌐" },
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "es", name: "Spanish", flag: "🇪🇸" },
  { code: "fr", name: "French", flag: "🇫🇷" },
  { code: "de", name: "German", flag: "🇩🇪" },
  { code: "it", name: "Italian", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", flag: "🇵🇹" },
  { code: "ru", name: "Russian", flag: "🇷🇺" },
  { code: "ar", name: "Arabic", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", flag: "🇨🇳" },
];

// Sort options
const SORT_OPTIONS = [
  { code: "publishedAt", name: "Latest", flag: "🕒" },
  { code: "relevancy", name: "Relevancy", flag: "🎯" },
  { code: "popularity", name: "Popularity", flag: "🔥" },
];

// Date range options
const DATE_OPTIONS = [
  { code: "", name: "Any Time", flag: "📅" },
  { code: "today", name: "Today", flag: "📆" },
  { code: "24h", name: "Past 24 Hours", flag: "⏰" },
  { code: "7d", name: "Past 7 Days", flag: "📊" },
  { code: "30d", name: "Past 30 Days", flag: "📈" },
];

const FilterBar = ({
  filters,
  onFilterChange,
  isSearchMode,
  isOpen,
  onClose,
}) => {
  const isDesktop = useIsDesktop();

  // Local state for domains input
  const [domainsInput, setDomainsInput] = useState(filters.domains || "");
  const [excludeDomainsInput, setExcludeDomainsInput] = useState(
    filters.excludeDomains || ""
  );

  // Only update local state when filters are reset (empty) or first mount
  useEffect(() => {
    // Only sync if the filter was cleared/reset
    if (filters.domains === "" && domainsInput !== "") {
      setDomainsInput("");
    }
    if (filters.excludeDomains === "" && excludeDomainsInput !== "") {
      setExcludeDomainsInput("");
    }
  }, [filters.domains, filters.excludeDomains]);

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDomainsSearch = () => {
    handleFilterChange("domains", domainsInput.trim());
  };

  const handleExcludeDomainsSearch = () => {
    handleFilterChange("excludeDomains", excludeDomainsInput.trim());
  };

  const handleDomainsKeyPress = (e) => {
    if (e.key === "Enter") {
      handleDomainsSearch();
    }
  };

  const handleExcludeDomainsKeyPress = (e) => {
    if (e.key === "Enter") {
      handleExcludeDomainsSearch();
    }
  };

  const handleReset = () => {
    setDomainsInput("");
    setExcludeDomainsInput("");
    onFilterChange({
      language: "",
      sortBy: "publishedAt",
      searchIn: "",
      from: "",
      to: "",
      sources: "",
      domains: "",
      excludeDomains: "",
    });
  };

  // Render filter controls as JSX directly to avoid re-creating components
  const filterControls = (
    <>
      {/* Language */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Language
        </label>
        <CustomDropdown
          value={filters.language || ""}
          options={LANGUAGE_OPTIONS}
          onChange={(value) => handleFilterChange("language", value)}
          placeholder="All Languages"
        />
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Sort By
        </label>
        <CustomDropdown
          value={filters.sortBy || "publishedAt"}
          options={SORT_OPTIONS}
          onChange={(value) => handleFilterChange("sortBy", value)}
          placeholder="Sort By"
        />
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Date Range
        </label>
        <CustomDropdown
          value={filters.dateRange || ""}
          options={DATE_OPTIONS}
          onChange={(value) => {
            const today = new Date();
            let from = "";
            let to = today.toISOString().split("T")[0];

            if (value === "today") {
              from = to;
            } else if (value === "24h") {
              from = new Date(today.setDate(today.getDate() - 1))
                .toISOString()
                .split("T")[0];
            } else if (value === "7d") {
              from = new Date(today.setDate(today.getDate() - 7))
                .toISOString()
                .split("T")[0];
            } else if (value === "30d") {
              from = new Date(today.setDate(today.getDate() - 30))
                .toISOString()
                .split("T")[0];
            }

            handleFilterChange("from", from);
            handleFilterChange("to", value ? to : "");
            handleFilterChange("dateRange", value); // Store selected value
          }}
          placeholder="Any Time"
        />
      </div>

      {/* Search In */}
      <div className="flex flex-col gap-1">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Search In
        </label>
        <div
          className="flex gap-3 items-center px-3 py-2 border rounded-lg"
          style={{
            backgroundColor: "var(--color-card)",
            borderColor: "var(--color-border)",
          }}
        >
          <label
            className="flex items-center gap-1 text-sm cursor-pointer"
            style={{ color: "var(--color-text-primary)" }}
          >
            <input
              type="checkbox"
              checked={filters.searchIn?.includes("title")}
              onChange={(e) => {
                const current =
                  filters.searchIn?.split(",").filter(Boolean) || [];
                const updated = e.target.checked
                  ? [...current, "title"]
                  : current.filter((s) => s !== "title");
                handleFilterChange("searchIn", updated.join(","));
              }}
              className="rounded focus:ring-2"
              style={{ accentColor: "var(--color-primary-600)" }}
            />
            Title
          </label>
          <label
            className="flex items-center gap-1 text-sm cursor-pointer"
            style={{ color: "var(--color-text-primary)" }}
          >
            <input
              type="checkbox"
              checked={filters.searchIn?.includes("description")}
              onChange={(e) => {
                const current =
                  filters.searchIn?.split(",").filter(Boolean) || [];
                const updated = e.target.checked
                  ? [...current, "description"]
                  : current.filter((s) => s !== "description");
                handleFilterChange("searchIn", updated.join(","));
              }}
              className="rounded focus:ring-2"
              style={{ accentColor: "var(--color-primary-600)" }}
            />
            Desc
          </label>
        </div>
      </div>

      {/* Domains */}
      <div className="flex flex-col gap-1 col-span-2">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Domains (comma-separated, press Enter)
        </label>
        <div className="relative flex gap-2">
          <input
            type="text"
            value={domainsInput}
            onChange={(e) => setDomainsInput(e.target.value)}
            onKeyPress={handleDomainsKeyPress}
            placeholder="e.g. bbc.com, cnn.com"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
          />
          <button
            onClick={handleDomainsSearch}
            className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors flex items-center gap-2 text-sm font-medium active:scale-95"
            title="Apply domains filter"
          >
            <IoSearchOutline className="text-lg" />
            {isDesktop && <span>Apply</span>}
          </button>
        </div>
      </div>

      {/* Exclude Domains */}
      <div className="flex flex-col gap-1 col-span-2">
        <label className="text-xs text-gray-600 font-medium">
          Exclude Domains (comma-separated, press Enter)
        </label>
        <div className="relative flex gap-2">
          <input
            type="text"
            value={excludeDomainsInput}
            onChange={(e) => setExcludeDomainsInput(e.target.value)}
            onKeyPress={handleExcludeDomainsKeyPress}
            placeholder="e.g. tabloid.com"
            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
          />
          <button
            onClick={handleExcludeDomainsSearch}
            className="px-4 py-2 bg-gold-600 text-white rounded-lg hover:bg-gold-700 transition-colors flex items-center gap-2 text-sm font-medium active:scale-95"
            title="Apply exclude domains filter"
          >
            <IoSearchOutline className="text-lg" />
            {isDesktop && <span>Apply</span>}
          </button>
        </div>
      </div>
    </>
  );

  // Desktop Layout
  if (isDesktop) {
    return (
      <AnimatePresence mode="wait">
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              opacity: { duration: 0.2 },
            }}
            className="bg-white border-b border-gray-200 overflow-hidden"
          >
            <div className="py-3">
              <div className="max-w-6xl mx-auto px-4">
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-between mb-3"
                >
                  <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FiFilter className="text-gold-700" />
                    Advanced Filters
                  </h3>
                  <button
                    onClick={handleReset}
                    className="text-xs text-gray-500 hover:text-gold-700 transition"
                  >
                    Reset All
                  </button>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-4 gap-3"
                >
                  {filterControls}
                </motion.div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // Mobile Layout
  return (
    <DraggableBottomSheet isOpen={isOpen} onClose={onClose} maxHeight="85vh">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <FiFilter className="text-gold-600" />
            Filters
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <FiX className="text-2xl text-gray-600" />
          </button>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-col gap-4">{filterControls}</div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => {
              handleReset();
            }}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 active:scale-95 transition-all touch-manipulation"
          >
            Reset All
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 bg-gold-600 text-white font-medium rounded-xl hover:bg-gold-700 active:scale-95 transition-all touch-manipulation"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </DraggableBottomSheet>
  );
};

export default FilterBar;
