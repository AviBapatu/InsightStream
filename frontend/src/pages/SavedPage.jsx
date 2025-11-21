import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import NewsCard from "../components/NewsCard";

const SavedPage = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const loading = useBookmarksStore((s) => s.loading);
  const initForUser = useBookmarksStore((s) => s.initForUser);

  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    const fn = () => setShowScroll(window.scrollY > 300);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Load saved items on mount
  useEffect(() => {
    if (user?.id) {
      initForUser(user.id, token);
    } else {
      initForUser(null, null); // guest mode
    }
  }, [user]);

  const list = bookmarks;

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 mt-6">
        <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-gray-900">
          Saved Articles
        </h1>

        <p className="text-gray-500 text-sm mt-1">
          Your saved stories across sessions.
        </p>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10 mt-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl overflow-hidden bg-gray-200 h-40"></div>
                <div className="h-4 bg-gray-200 mt-3 rounded"></div>
                <div className="h-3 bg-gray-200 mt-2 w-2/3 rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && bookmarks.length === 0 && (
          <div className="mt-16 text-center text-gray-500">
            <div className="text-4xl mb-4">📁</div>
            <h2 className="text-xl font-medium text-gray-800">
              No Saved Articles
            </h2>
            <p className="text-gray-500 mt-1">
              Bookmark news stories and they’ll appear here.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((item, index) => (
            <NewsCard
              key={item.id || item.article.url}
              article={item.article}
              index={index}
              mode="saved"
              savedData={item}
              fromSaved={true}
            />
          ))}
        </div>

        {showScroll && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="fixed bottom-6 right-6 bg-gold-700 text-white px-4 py-2 rounded-full shadow-lg hover:bg-gold-800 transition-colors"
          >
            ↑ Top
          </button>
        )}
      </div>
    </>
  );
};

export default SavedPage;
