const NewsCard = () => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
      {/* Image area */}
      <div className="aspect-[16/9] bg-gray-200">
        {/* Real image will go here later */}
        {/* <img src={data.image} className="w-full h-full object-cover" /> */}
      </div>

      {/* Content area */}
      <div className="p-5">
        <h3 className="font-medium text-lg md:text-xl text-gray-900 leading-snug tracking-tight line-clamp-3">
          Sample News Title That Shows How The Layout Will Look
        </h3>

        <div className="text-[11px] md:text-xs text-gray-500 mt-3">
          Source Name · 2h ago
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
