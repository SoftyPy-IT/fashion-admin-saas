import { Skeleton } from "antd";

const ImageLoadingSkeleton = () => {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-6 xl:gap-x-8">
      {Array(9)
        .fill(0)
        .map((_, index) => (
          <li key={index} className="relative">
            <div className="block w-full p-4 mx-auto overflow-hidden bg-gray-100 rounded-lg group aspect-h-7 aspect-w-10 ">
              <Skeleton
                className="object-cover w-full h-full mx-auto "
                active
              />
            </div>
          </li>
        ))}
    </div>
  );
};

export default ImageLoadingSkeleton;
