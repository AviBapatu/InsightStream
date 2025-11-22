/**
 * SavedPage Component
 *
 * Displays user's saved/bookmarked articles with advanced filtering and sorting.
 * Features:
 * - Grid and list view toggle
 * - Search functionality with debouncing
 * - Filter by source
 * - Sort by date or alphabetically
 * - Responsive design
 * - Smooth animations
 * - Scroll to top button
 *
 * Uses the new modular component library for consistent styling.
 */

import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useReaderStore } from "../store/useReaderStore";
import NewsCard from "../components/NewsCard";
import {
  Button,
  Input,
  Dropdown,
  Card,
  Badge,
  Spinner,
} from "../components/common";
import {
  FiFilter,
  FiRepeat,
  FiGrid,
  FiList,
  FiSearch,
  FiChevronDown,
} from "react-icons/fi";

const DEBOUNCE_MS = 250;

// Animation variants for layout switching
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 },
  },
};

const SavedPage = () => {
  const navigate = useNavigate();
  const openReader = useReaderStore((s) => s.openReader);

  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const loading = useBookmarksStore((s) => s.loading);
  const initForUser = useBookmarksStore((s) => s.initForUser);

  // UI States
  const [view, setView] = useState("grid"); // grid | list
  const [sortBy, setSortBy] = useState("recent"); // recent | oldest | az | za
  const [filterSource, setFilterSource] = useState("all"); // source name or 'all'
  const [rawSearch, setRawSearch] = useState("");
  const [search, setSearch] = useState("");
  const [showScroll, setShowScroll] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  // debounce search
  useEffect(() => {
    const t = setTimeout(() => setSearch(rawSearch.trim()), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [rawSearch]);

  // show scroll-to-top
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (!e.target.closest(".filter-dropdown")) setShowFilter(false);
    };
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  useEffect(() => {
    // Wait until both user and token are ready
    if (user?.id && token) {
      initForUser(user.id, token);
      return;
    }

    // Guest mode (no server sync)
    if (!user?.id) {
      initForUser(null, null);
    }
  }, [user?.id, token]);

  // derived set of valid sources (safe, filtered)
  const sources = useMemo(() => {
    return [
      ...new Set(bookmarks.map((b) => b.article.source?.name).filter(Boolean)),
    ];
  }, [bookmarks]);

  // displayed list with search/filter/sort
  const displayed = useMemo(() => {
    let list = [...bookmarks];

    // search
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (b) =>
          (b.article.title || "").toLowerCase().includes(q) ||
          (b.article.description || "").toLowerCase().includes(q)
      );
    }

    // filter by source
    if (filterSource !== "all") {
      list = list.filter((b) => b.article.source?.name === filterSource);
    }

    // sort
    if (sortBy === "recent") {
      list.sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
    } else if (sortBy === "oldest") {
      list.sort((a, b) => new Date(a.savedAt) - new Date(b.savedAt));
    } else if (sortBy === "az") {
      list.sort((a, b) =>
        (a.article.title || "").localeCompare(b.article.title || "")
      );
    } else if (sortBy === "za") {
      list.sort((a, b) =>
        (b.article.title || "").localeCompare(a.article.title || "")
      );
    }

    return list;
  }, [bookmarks, search, filterSource, sortBy]);

  // click handler used for list-row (keeps behavior consistent)
  const handleOpenArticle = (article) => {
    const desktopNow = window.matchMedia("(min-width: 1024px)").matches;
    if (desktopNow) {
      openReader(article);
    } else {
      const safeId = encodeURIComponent(
        article.url || article.title || "article"
      );
      navigate(`/article/${safeId}`, { state: { article } });
    }
  };

  // helper: cycle sort (small UX convenience)
  const cycleSort = () => {
    setSortBy((prev) => {
      if (prev === "recent") return "az";
      if (prev === "az") return "za";
      if (prev === "za") return "oldest";
      return "recent";
    });
  };

  // safe toggle filter: if no sources available do nothing
  const toggleFilter = () => {
    if (sources.length === 0) return;
    setFilterSource((prev) => (prev === "all" ? sources[0] : "all"));
  };

  return (
    <>
      <Navbar
        showFilterButton={true}
        onFilterToggle={() => setShowFilter((prev) => !prev)}
      />

      <main
        className="min-h-screen pb-12"
        style={{ backgroundColor: "var(--color-background)" }}
      >
        <div className="max-w-6xl mx-auto px-4 pt-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl md:text-3xl font-semibold tracking-tight"
                style={{ color: "var(--color-text-primary)" }}
              >
                Saved Articles
              </h1>
              <p
                className="text-sm mt-1"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Your saved stories across sessions.
              </p>
            </div>

            {/* top-right small meta */}
            <div className="hidden sm:flex flex-col items-end text-right">
              <span
                className="text-xs"
                style={{ color: "var(--color-text-secondary)" }}
              >
                Saved
              </span>
              <span
                className="font-medium"
                style={{ color: "var(--color-text-primary)" }}
              >
                {bookmarks.length}
              </span>
            </div>
          </div>

          {/* controls */}
          <div className="mt-6 flex items-center justify-between gap-3">
            {/* left: search */}
            <div className="flex items-center gap-3 flex-1">
              <div className="relative w-full max-w-md">
                <Input
                  type="text"
                  placeholder="Search saved articles..."
                  value={rawSearch}
                  onChange={(e) => setRawSearch(e.target.value)}
                  leftIcon={<FiSearch className="text-gray-400" />}
                />
              </div>

              {/* Reset button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setRawSearch("");
                  setSearch("");
                  setFilterSource("all");
                  setSortBy("recent");
                }}
                leftIcon={<FiRepeat />}
                className="hidden sm:inline-flex"
              >
                <span className="hidden sm:inline">Reset</span>
              </Button>
            </div>

            {/* right: icons cluster */}
            <div className="flex items-center gap-3">
              {/* Sort button */}
              <button
                onClick={cycleSort}
                title={`Sort: ${sortBy}`}
                className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
                style={{ color: "var(--color-text-primary)" }}
              >
                <FiChevronDown className="text-lg" />
              </button>

              {/* Filter dropdown using new Dropdown component */}
              <Dropdown
                trigger={
                  <button
                    className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
                    title="Filter by source"
                    style={{ color: "var(--color-text-primary)" }}
                  >
                    <FiFilter className="text-lg" />
                  </button>
                }
                align="right"
                items={[
                  {
                    label: "All Sources",
                    onClick: () => setFilterSource("all"),
                  },
                  ...(sources.length > 0 ? [{ divider: true }] : []),
                  ...sources.map((src) => ({
                    label: src,
                    onClick: () => setFilterSource(src),
                  })),
                ]}
              />

              {/* View toggles */}
              <button
                onClick={() => setView("grid")}
                title="Grid view"
                className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
                style={{
                  color:
                    view === "grid"
                      ? "var(--color-primary-700)"
                      : "var(--color-text-primary)",
                }}
              >
                <FiGrid className="text-lg" />
              </button>

              <button
                onClick={() => setView("list")}
                title="List view"
                className="p-2 rounded-md hover:bg-gray-50 active:scale-95 transition"
                style={{
                  color:
                    view === "list"
                      ? "var(--color-primary-700)"
                      : "var(--color-text-primary)",
                }}
              >
                <FiList className="text-lg" />
              </button>
            </div>
          </div>

          {/* content */}
          <section className="mt-6">
            {/* skeleton loader */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <Card padding="md" className="h-44">
                      <div
                        className="h-full rounded-lg"
                        style={{ backgroundColor: "var(--color-muted)" }}
                      />
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* empty state */}
            {!loading && displayed.length === 0 && (
              <Card padding="xl" className="mt-20 text-center">
                <div className="text-5xl mb-4">
                  {bookmarks.length === 0 ? "📁" : "🔍"}
                </div>
                <h2
                  className="text-xl font-medium"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {bookmarks.length === 0
                    ? "No Saved Articles"
                    : "No Results Found"}
                </h2>
                <p
                  className="mt-2"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  {bookmarks.length === 0
                    ? "Bookmark news stories and they'll appear here."
                    : search
                    ? `No articles match "${search}". Try a different search.`
                    : filterSource !== "all"
                    ? `No articles from ${filterSource}. Try another filter.`
                    : "No articles match your filters."}
                </p>
              </Card>
            )}

            {/* grid */}
            <AnimatePresence mode="wait">
              {!loading && displayed.length > 0 && view === "grid" && (
                <motion.div
                  key="grid-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
                >
                  {displayed.map((item) => (
                    <motion.div
                      key={item.id || item.article.url}
                      variants={itemVariants}
                      layout
                    >
                      <NewsCard
                        article={item.article}
                        mode="saved"
                        savedData={item}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* list */}
            <AnimatePresence mode="wait">
              {!loading && displayed.length > 0 && view === "list" && (
                <motion.div
                  key="list-view"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-col gap-4"
                >
                  {displayed.map((item) => (
                    <motion.div
                      key={item.id || item.article.url}
                      variants={itemVariants}
                      layout
                      className="flex gap-4 rounded-xl p-4 hover:shadow transition cursor-pointer"
                      style={{
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-card)",
                      }}
                      onClick={() => handleOpenArticle(item.article)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                    >
                      <div
                        className="w-36 h-24 shrink-0 rounded-lg overflow-hidden"
                        style={{ backgroundColor: "var(--color-muted)" }}
                      >
                        {item.article.urlToImage ? (
                          <img
                            src={item.article.urlToImage}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-xs"
                            style={{ color: "var(--color-text-secondary)" }}
                          >
                            No Image
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-semibold text-lg line-clamp-2"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {item.article.title}
                        </h3>
                        <div
                          className="mt-2 text-xs"
                          style={{ color: "var(--color-text-secondary)" }}
                        >
                          {item.article.source?.name || "Unknown Source"} •{" "}
                          {new Date(item.savedAt).toLocaleDateString()}
                        </div>
                        <p
                          className="mt-3 text-sm line-clamp-3"
                          style={{ color: "var(--color-text-primary)" }}
                        >
                          {item.article.description}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* scroll to top */}
          {showScroll && (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                variant="primary"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="shadow-lg"
              >
                ↑ Top
              </Button>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default SavedPage;
