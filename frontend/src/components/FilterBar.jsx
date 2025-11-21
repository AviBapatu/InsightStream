import { useState, useEffect, useRef } from "react";
import { FiFilter, FiX } from "react-icons/fi";
import { useIsDesktop } from "../hooks/useIsDesktop";

const FilterBar = ({ filters, onFilterChange, isSearchMode, isOpen }) => {
  const isDesktop = useIsDesktop();
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Use refs to track the actual input values without causing re-renders
  const domainsRef = useRef(filters.domains || "");
  const excludeDomainsRef = useRef(filters.excludeDomains || "");
  const domainsTimerRef = useRef(null);
  const excludeDomainsTimerRef = useRef(null);

  // Update refs when filters change externally (e.g., from reset)
  useEffect(() => {
    domainsRef.current = filters.domains || "";
    excludeDomainsRef.current = filters.excludeDomains || "";
  }, [filters.domains, filters.excludeDomains]);

  // Don't show if not opened manually
  if (!isOpen) return null;

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleDomainsChange = (e) => {
    const value = e.target.value;
    domainsRef.current = value;

    // Clear existing timer
    if (domainsTimerRef.current) {
      clearTimeout(domainsTimerRef.current);
    }

    // Set new timer to update parent after 800ms
    domainsTimerRef.current = setTimeout(() => {
      handleFilterChange("domains", value);
    }, 800);
  };

  const handleExcludeDomainsChange = (e) => {
    const value = e.target.value;
    excludeDomainsRef.current = value;

    // Clear existing timer
    if (excludeDomainsTimerRef.current) {
      clearTimeout(excludeDomainsTimerRef.current);
    }

    // Set new timer to update parent after 800ms
    excludeDomainsTimerRef.current = setTimeout(() => {
      handleFilterChange("excludeDomains", value);
    }, 800);
  };

  const handleReset = () => {
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

  const FilterControls = () => (
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
          Domains (comma-separated)
        </label>
        <input
          type="text"
          defaultValue={filters.domains || ""}
          onChange={handleDomainsChange}
          placeholder="e.g. bbc.com, cnn.com"
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-gold-500 focus:border-gold-500 focus:outline-none"
          key={`domains-${filters.domains}`}
        />
      </div>
    </>
  );

  // Desktop Layout
  if (isDesktop) {
    return (
      <div className="bg-white border-b border-gray-200 py-3">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
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
          </div>
          <div className="grid grid-cols-4 gap-3">
            <FilterControls />
          </div>
        </div>
      </div>
    );
  }

  // Mobile Layout
  return (
    <>
      <button
        onClick={() => setShowMobileFilters(true)}
        className="fixed bottom-20 right-6 bg-gold-700 text-white p-3 rounded-full shadow-lg z-40 flex items-center gap-2"
      >
        <FiFilter />
      </button>

      {/* Mobile Bottom Sheet */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="bg-white rounded-t-2xl w-full max-h-[80vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
              <button onClick={() => setShowMobileFilters(false)}>
                <FiX className="text-2xl text-gray-600" />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <FilterControls />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={handleReset}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="flex-1 px-4 py-2 bg-gold-700 text-white rounded-lg hover:bg-gold-800"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FilterBar;
