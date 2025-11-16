import { useNavigate } from "react-router-dom";
import { useIsDesktop } from "../hooks/useIsDesktop";
import { useReaderStore } from "../store/useReaderStore";

const NewsCard = ({ article, index }) => {
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();
  const openReader = useReaderStore((s) => s.openReader);

  const handleClick = () => {
    if (isDesktop) {
      // Desktop → open the side panel
      openReader(article);
    } else {
      // Mobile/iPad → go to full page
      navigate(`/article/${index}`, { state: { article } });
    }
  };

  return (
    <div
      onClick={handleClick}
      className="cursor-pointer rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      {/* Image area */}
      <div className="aspect-video bg-gray-200">
        {article?.urlToImage && (
          <img
            src={article.urlToImage}
            alt=""
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
          {article?.title}
        </h3>

        <div className="text-[11px] md:text-xs text-gray-500 mt-3">
          {article?.source?.name} · {new Date(article.publishedAt).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
