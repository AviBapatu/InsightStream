import { useEffect } from "react";
import { useBookmarksStore } from "../store/useBookmarksStore";
import { useAuthStore } from "../store/useAuthStore";
import NewsCard from "../components/NewsCard";
import { useNavigate } from "react-router-dom";

const Saved = () => {
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);

  const initForUser = useBookmarksStore((s) => s.initForUser);
  const bookmarks = useBookmarksStore((s) => s.bookmarks);
  const loading = useBookmarksStore((s) => s.loading);

  useEffect(() => {
    if (user?.id) initForUser(user.id, token);
  }, [user]);

  if (!user) return <div className="p-6">Please login to see saved articles.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Saved Articles</h2>
      {loading ? (
        <div>Loading...</div>
      ) : bookmarks.length === 0 ? (
        <div className="text-gray-500">You have no saved articles.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookmarks.map((b) => (
            <div key={b.id || b.article.url}>
              {/* render a small card; reuse NewsCard by passing article; but NewsCard wraps click to reader; that's fine */}
              <NewsCard article={b.article} />
              <div className="text-xs text-gray-400 mt-2">Saved at: {new Date(b.savedAt).toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Saved;
