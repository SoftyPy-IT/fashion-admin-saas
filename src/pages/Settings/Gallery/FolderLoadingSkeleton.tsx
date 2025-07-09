const FolderLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-8 mt-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
        <div
          key={index}
          className="flex flex-col items-center justify-center p-4 bg-gray-100 rounded-lg"
        >
          <div className="w-32 h-32 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-1/2 h-4 mt-4 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
      ))}
    </div>
  );
};

export default FolderLoadingSkeleton;
