import { useLocation, useNavigate } from "react-router-dom";

const ArticlePage = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const article = state?.article;

  // If user refreshes or comes without state, redirect to home
  if (!article) {
    navigate("/home");
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top Bar */}
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 text-sm hover:text-gray-900 transition"
        >
          ← Back
        </button>

        <span className="text-xs text-gray-400 pr-2">Mobile Reader</span>
      </div>

      {/* Hero Image */}
      {article.urlToImage && (
        <div className="aspect-video bg-gray-200">
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Title Block */}
      <div className="px-4 py-6 space-y-3">
        <h1 className="text-2xl font-semibold leading-tight text-gray-900">
          {article.title}
        </h1>

        <div className="text-sm text-gray-500">
          {article.source?.name} ·{" "}
          {new Date(article.publishedAt).toLocaleString()}
        </div>
      </div>

      {/* Description */}
      <div className="px-4">
        <p className="text-gray-800 leading-relaxed text-[15px]">
          {article.description || "No description available."}
        </p>
      </div>

      {/* Read Original */}
      <div className="p-4">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-block mt-6 text-gold-700 
            border border-gold-700 
            px-4 py-2 rounded-lg 
            hover:bg-gold-700 hover:text-white
            transition-all duration-200
          "
        >
          Read Full Article →
        </a>
      </div>
    </div>
  );
};

export default ArticlePage;
