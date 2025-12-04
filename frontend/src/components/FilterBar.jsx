import { useState, useEffect } from "react";
import { FiFilter, FiX, FiSearch } from "react-icons/fi";
import { IoSearchOutline } from "react-icons/io5";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { motion, AnimatePresence } from "framer-motion";
import DraggableBottomSheet from "./modals/DraggableBottomSheet";

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

  const filterControls = (
    <>
      {/* Language */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Language</label>
        <select
          value={filters.language || ""}
          onChange={(e) => handleFilterChange("language", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
        >
          <option value="">All Languages</option>
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="it">Italian</option>
          <option value="pt">Portuguese</option>
          <option value="ru">Russian</option>
          <option value="ar">Arabic</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Sort By */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Sort By</label>
        <select
          value={filters.sortBy || "publishedAt"}
          onChange={(e) => handleFilterChange("sortBy", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
        >
          <option value="publishedAt">Latest</option>
          <option value="relevancy">Relevancy</option>
          <option value="popularity">Popularity</option>
        </select>
      </div>

      {/* Date Range */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Date Range</label>
        <select
          onChange={(e) => {
            const value = e.target.value;
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
          }}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
        >
          <option value="">Any Time</option>
          <option value="today">Today</option>
          <option value="24h">Past 24 Hours</option>
          <option value="7d">Past 7 Days</option>
          <option value="30d">Past 30 Days</option>
        </select>
      </div>

      {/* Search In */}
      <div className="flex flex-col gap-1">
        <label className="text-xs text-gray-600 font-medium">Search In</label>
        <div className="flex gap-3 items-center px-3 py-2 border border-gray-200 rounded-lg bg-white">
          <label className="flex items-center gap-1 text-sm cursor-pointer">
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
              className="rounded text-gold-700 focus:ring-gold-500"
            />
            Title
          </label>
          <label className="flex items-center gap-1 text-sm cursor-pointer">
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
              className="rounded text-gold-700 focus:ring-gold-500"
            />
            Desc
          </label>
        </div>
      </div>

      {/* Domains */}
      <div className="flex flex-col gap-1 col-span-2">
        <label className="text-xs text-gray-600 font-medium">
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
