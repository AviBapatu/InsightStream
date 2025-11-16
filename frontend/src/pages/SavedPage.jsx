import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { useAuthStore } from "../store/useAuthStore";
import { useBookmarksStore } from "../store/useBookmarksStore";
import NewsCard from "../components/NewsCard";

const SavedPage = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const initForUser = useBookmarksStore((s) => s.initForUser);

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

        {/* Empty State */}
        {list.length === 0 && (
          <div className="mt-20 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <h2 className="text-xl font-medium text-gray-800 mt-4">
              No saved articles yet
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Save stories to read later.
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {list.map((item) => (
            <NewsCard key={item.id || item.article.url} article={item.article} mode="saved" savedData={item} />
          ))}
        </div>
      </div>
    </>
  );
};

export default SavedPage;
