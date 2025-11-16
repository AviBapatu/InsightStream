const NewsCard = ({ article }) => {
  const image = article?.urlToImage;
  const title = article?.title || "Untitled Article";
  const source = article?.source?.name || "Unknown";
  const time = article?.publishedAt
    ? new Date(article.publishedAt).toLocaleTimeString()
    : "";

  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      
      <div className="aspect-video bg-gray-200">
        {image ? (
          <img src={image} className="w-full h-full object-cover" />
        ) : null}
      </div>

      <div className="p-5">
        <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
          {title}
        </h3>

        <div className="text-[11px] md:text-xs text-gray-500 mt-3">
          {source} · {time}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
