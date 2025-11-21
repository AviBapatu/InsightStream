import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import FilterBar from "../components/FilterBar";
import NewsGrid from "../components/NewsGrid";
import { fetchNews } from "../api/news";
import { useReaderStore } from "../store/useReaderStore";
import { useDebounce } from "../hooks/useDebounce";

const Home = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("General");
  const closeReader = useReaderStore((s) => s.closeReader);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 400);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showScroll, setShowScroll] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const loaderRef = useRef(null);

  // Search filters
  const [filters, setFilters] = useState({
    language: "",
    sortBy: "publishedAt",
    searchIn: "",
    from: "",
    to: "",
    sources: "",
    domains: "",
    excludeDomains: "",
  });

  // Debounce filters to prevent search on every keystroke
  const debouncedFilters = useDebounce(filters, 800);

  // Check if in search mode
  const isSearchMode = debouncedSearch.trim().length > 0;

  // Show scroll-to-top button when scrolled down
  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    closeReader(); // Always close when feed changes

    setLoading(true);
    setPage(1); // reset page
    setHasMore(true); // reset
    setArticles([]); // wipe old articles

    if (debouncedSearch.trim().length > 0) {
      // SEARCH MODE - use filters
      fetchNews({
        q: debouncedSearch,
        page: 1,
        ...debouncedFilters,
      }).then((data) => {
        setArticles(data.articles || []);
        setHasMore((data.articles?.length || 0) >= 20);
        setLoading(false);
      });
      return;
    }

    // TOP HEADLINES MODE - use category & country
    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
      page: 1,
    }).then((data) => {
      setArticles(data.articles || []);
      setHasMore((data.articles?.length || 0) >= 20);
      setLoading(false);
    });
  }, [activeCategory, debouncedSearch, debouncedFilters]);

  useEffect(() => {
    if (!loaderRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        console.log("Observer checking…", entries[0].isIntersecting);

        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((p) => p + 1);
        }
      },
      { threshold: 1 }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (page === 1) return;

    closeReader(); // rule A: reader should close on load more

    if (debouncedSearch.trim().length > 0) {
      // SEARCH MODE
      fetchNews({
        q: debouncedSearch,
        page,
        ...debouncedFilters,
      }).then((data) => {
        setArticles((prev) => [...prev, ...(data.articles || [])]);
        setHasMore((data.articles?.length || 0) >= 20);
      });
      return;
    }

    // TOP HEADLINES MODE
    fetchNews({
      country: "us",
      category:
        activeCategory.toLowerCase() === "top stories"
          ? undefined
          : activeCategory.toLowerCase(),
      page,
    }).then((data) => {
      setArticles((prev) => [...prev, ...(data.articles || [])]);
      setHasMore((data.articles?.length || 0) >= 20);
    });
  }, [page]);

  return (
    <>
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilterButton={true}
        onFilterToggle={() => setShowFilters((prev) => !prev)}
      />
      <CategoryBar
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        isSearchMode={isSearchMode}
        isOpen={showFilters}
      />
      <NewsGrid articles={articles} loading={loading} />

      {/* No articles found */}
      {!loading && articles.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-20 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            No Articles Found
          </h2>
          <p className="text-gray-500">
            {debouncedSearch
              ? `No results for "${debouncedSearch}". Try a different search term.`
              : `No articles available for ${activeCategory}. Try another category.`}
          </p>
        </div>
      )}

      {/* End of results message */}
      {!loading && articles.length > 0 && !hasMore && (
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 text-gray-500">
            <div className="h-px w-12 bg-gray-300"></div>
            <span className="text-sm">End of results</span>
            <div className="h-px w-12 bg-gray-300"></div>
          </div>
        </div>
      )}

      {/* Infinite scroll loader */}
      {hasMore && <div ref={loaderRef} className="h-10"></div>}

      {/* Scroll to top button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 bg-gold-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gold-800 transition-colors z-50"
        >
          ↑ Top
        </button>
      )}
    </>
  );
};

export default Home;
