import { useState, useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import CategoryBar from "../components/CategoryBar";
import FilterBar from "../components/FilterBar";
import HeroArticle from "../components/HeroArticle";
import HighlightsScroller from "../components/HighlightsScroller";
import PremiumMagazineGrid from "../components/PremiumMagazineGrid";
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

  // Split articles for different sections
  const heroArticle = articles[0];
  const highlightArticles = articles.slice(1, 5);
  const gridArticles = articles.slice(5);

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

      {/* Hero Article Section */}
      {!loading && heroArticle && <HeroArticle article={heroArticle} />}

      {/* Highlights Scroller */}
      {!loading && highlightArticles.length > 0 && (
        <HighlightsScroller articles={highlightArticles} />
      )}

      {/* Premium Magazine Grid */}
      {gridArticles.length > 0 && (
        <PremiumMagazineGrid articles={gridArticles} loading={false} />
      )}

      {/* Loading State */}
      {loading && <PremiumMagazineGrid articles={[]} loading={true} />}

      {/* No articles found */}
      {!loading && articles.length === 0 && (
        <div className="max-w-6xl mx-auto px-4 mt-20 text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            No Stories Found
          </h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            {debouncedSearch
              ? "Try adjusting your search or filters to find what you're looking for."
              : `No articles available for ${activeCategory}. Try another category.`}
          </p>
          {(debouncedSearch || Object.values(filters).some((v) => v)) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setFilters({
                  language: "",
                  sortBy: "publishedAt",
                  searchIn: "",
                  from: "",
                  to: "",
                  sources: "",
                  domains: "",
                  excludeDomains: "",
                });
              }}
              className="
                px-6 py-2.5 
                bg-gold-600 text-white 
                rounded-full font-medium
                hover:bg-gold-700 
                transition-colors duration-200
                active:scale-95
              "
            >
              Clear Filters
            </button>
          )}
        </div>
      )}

      {/* End of results message */}
      {!loading && articles.length > 0 && !hasMore && (
        <div className="max-w-6xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-3 text-gray-400">
            <div className="h-px w-16 bg-gray-200"></div>
            <span className="text-sm font-medium">You've reached the end</span>
            <div className="h-px w-16 bg-gray-200"></div>
          </div>
        </div>
      )}

      {/* Infinite scroll loader */}
      {hasMore && <div ref={loaderRef} className="h-10"></div>}

      {/* Scroll to top button */}
      {showScroll && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="
            fixed bottom-6 right-6 
            bg-gold-600 text-white 
            w-12 h-12 
            rounded-full shadow-lg 
            hover:bg-gold-700 hover:shadow-xl
            active:scale-95
            transition-all duration-200 
            z-50
            flex items-center justify-center
          "
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </>
  );
};

export default Home;
