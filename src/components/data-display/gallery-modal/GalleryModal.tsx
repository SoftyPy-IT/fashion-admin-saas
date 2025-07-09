import {
  Button,
  Card,
  Drawer,
  Empty,
  Image,
  Pagination,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { BsTrash } from "react-icons/bs";
import { FaFileCsv, FaFilePdf } from "react-icons/fa";
import { IoRefresh } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import CreateFolder from "../../../pages/Settings/Gallery/CreateFolder";
import ImageLoadingSkeleton from "../../../pages/Settings/Gallery/ImageLoadingSkeleton";
import {
  useDeleteImageMutation,
  useGetAllImagesQuery,
  useGetFoldersQuery,
} from "../../../redux/features/gallery/gallery.api";
import UploadImagePopover from "./UploadImagePopover";

interface Props {
  open: boolean;
  onClose: (
    e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,
  ) => any;
  setSelectedImage: any;
  mode: "single" | "multiple";
  selectedImage: string | string[] | null;
  isSelectThumbnail?: boolean;
}

interface Image {
  _id: string;
  name: string;
  url: string;
  thumbnail_url?: string;
  public_id: string;
  folders: {
    _id: string;
    name: string;
    images: string[];
  };
}

interface Folder {
  _id: string;
  name: string;
  images: string[];
}

// Pre-defined file icons for better performance
const fileIcons: Record<string, JSX.Element> = {
  pdf: <FaFilePdf className="text-6xl text-red-600" />,
  csv: <FaFileCsv className="text-6xl text-green-600" />,
  default: <FaFileCsv className="text-6xl text-gray-600" />,
};

// Image type detection function - defined outside component to avoid recreation
const getFileType = (url: string): string => {
  if (!url) return "default";
  const extension = url.split(".").pop()?.toLowerCase();
  return extension === "jpg" ||
    extension === "jpeg" ||
    extension === "png" ||
    extension === "webp" ||
    extension === "gif"
    ? "image"
    : extension || "default";
};

// Filter function for Select component - defined outside to avoid recreation
const filterOption = (
  input: string,
  option?: { label: string; value: string },
) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const GalleryModal = ({
  open,
  onClose,
  selectedImage,
  setSelectedImage,
  mode,
  isSelectThumbnail = false,
}: Props) => {
  // State management
  const [currentFolder, setCurrentFolder] = useState<string | undefined>();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  // Refs for cleanup
  const mountedRef = useRef(true);

  // Debounced search term for folder search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Create params from state variables
  const params = useMemo(() => {
    const result: { name: string; value: string | number }[] = [];
    if (currentFolder) result.push({ name: "folder", value: currentFolder });
    if (currentPage > 1) result.push({ name: "page", value: currentPage });
    return result;
  }, [currentFolder, currentPage]);

  // Folder search params with debouncing
  const folderParams = useMemo(() => {
    const result: { name: string; value: string }[] = [];
    if (debouncedSearchTerm.trim()) {
      result.push({ name: "searchTerm", value: debouncedSearchTerm.trim() });
    }
    return result;
  }, [debouncedSearchTerm]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!open) {
      setSelectedImages([]);
      setCurrentPage(1);
      setSearchTerm("");
    } else if (open && selectedImage) {
      // Initialize selected images when modal opens
      if (mode === "single" && typeof selectedImage === "string") {
        setSelectedImages([selectedImage]);
      } else if (mode === "multiple" && Array.isArray(selectedImage)) {
        setSelectedImages(selectedImage);
      }
    }
  }, [open, selectedImage, mode]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Optimized data fetching with better error handling
  const {
    data: imagesData,
    isLoading: imagesLoading,
    isFetching: imagesFetching,
    refetch: refetchImages,
    error: imagesError,
  } = useGetAllImagesQuery(params, {
    skip: !open,
    refetchOnMountOrArgChange: true,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  const [deleteImage, { isLoading: isDeletingImage }] =
    useDeleteImageMutation();

  const {
    data: foldersData,
    isLoading: foldersLoading,
    isFetching: foldersFetching,
    error: foldersError,
  } = useGetFoldersQuery(folderParams, {
    skip: !open,
    refetchOnMountOrArgChange: false,
    refetchOnFocus: false,
    refetchOnReconnect: false,
  });

  // Memoized data with error handling
  const folders = useMemo(() => {
    if (foldersError) return [];
    return foldersData?.data || [];
  }, [foldersData, foldersError]);

  const images = useMemo(() => {
    if (imagesError) return [];
    return imagesData?.data || [];
  }, [imagesData, imagesError]);

  const metaData = imagesData?.meta;

  // Optimized handlers with minimal dependencies
  const handleSelectImage = useCallback(
    (imageUrl: string) => {
      if (!imageUrl) return;

      if (mode === "single") {
        setSelectedImages([imageUrl]);
      } else {
        setSelectedImages((prev) =>
          prev.includes(imageUrl)
            ? prev.filter((img) => img !== imageUrl)
            : [...prev, imageUrl],
        );
      }
    },
    [mode],
  );

  const handleRemoveSelected = useCallback((imageUrl: string) => {
    setSelectedImages((prev) => prev.filter((img) => img !== imageUrl));
  }, []);

  const handleFolderChange = useCallback((value: string | undefined) => {
    setCurrentFolder(value);
    setCurrentPage(1); // Reset to first page when changing folders
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleOk = useCallback(() => {
    try {
      if (mode === "single") {
        setSelectedImage(selectedImages[0] || null);
      } else {
        setSelectedImage(selectedImages.length > 0 ? selectedImages : null);
      }
      onClose(false as any);
    } catch (error) {
      console.error("Error setting selected image:", error);
    }
  }, [mode, selectedImages, setSelectedImage, onClose]);

  const handleDeleteImage = useCallback(
    async (public_id: string, id: string) => {
      if (!public_id || !id) return;

      const imageToDelete = images.find((img: Image) => img._id === id) as
        | Image
        | undefined;

      try {
        // Optimistically remove from selected images
        if (imageToDelete) {
          setSelectedImages((prev) =>
            prev.filter((url) => url !== imageToDelete.url),
          );
        }

        await deleteImage({ public_id, id }).unwrap();
      } catch (error) {
        console.error("Error deleting image:", error);
        // Revert optimistic update if deletion failed
        if (imageToDelete) {
          setSelectedImages((prev) => [...prev, imageToDelete.url]);
        }
      }
    },
    [deleteImage, images],
  );

  const handleFolderSearch = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  // Memoized components for better performance
  const SelectedImagesPreview = useMemo(() => {
    if (selectedImages.length === 0) return null;

    return (
      <Card
        title={`Selected Images (${selectedImages.length})`}
        className="mb-4"
        size="small"
      >
        <div className="flex flex-wrap gap-2 overflow-y-auto max-h-32">
          {selectedImages.map((url) => (
            <div key={url} className="relative flex-shrink-0 w-32 h-32 group">
              {getFileType(url) === "image" ? (
                <Image
                  src={url}
                  alt="Selected"
                  className="w-full h-full rounded"
                  preview={true}
                  style={{ aspectRatio: "1/1" }}
                  loading="lazy"
                  placeholder={
                    <div className="w-full h-full bg-gray-200 rounded animate-pulse" />
                  }
                />
              ) : (
                <div className="flex items-center justify-center w-full h-full text-xs bg-gray-100 rounded">
                  {fileIcons[getFileType(url)] || fileIcons.default}
                </div>
              )}
              <button
                onClick={() => handleRemoveSelected(url)}
                className="absolute p-1 text-xs text-red-500 transition-all bg-white rounded-full opacity-0 -top-0 -right-0 hover:bg-red-500 hover:text-white group-hover:opacity-100"
                aria-label="Remove selected image"
              >
                <MdClose size={12} />
              </button>
            </div>
          ))}
        </div>
      </Card>
    );
  }, [selectedImages, handleRemoveSelected]);

  const ImageGrid = useMemo(() => {
    if (images.length === 0) {
      if (imagesError) {
        return (
          <Empty
            description="Failed to load images. Please try refreshing."
            className="mt-8"
          />
        );
      }
      return (
        <Empty description="No images found in this folder" className="mt-8" />
      );
    }

    return (
      <div className="gap-4 p-4 columns-2 sm:columns-3 lg:columns-5 xl:columns-6 ">
        {images.map((image: Image) => {
          const fileType = getFileType(image.url);
          const isSelected = selectedImages.includes(
            isSelectThumbnail ? image.thumbnail_url || image.url : image.url,
          );
          const imageUrl = isSelectThumbnail
            ? image.thumbnail_url || image.url
            : image.url;

          return (
            <div
              key={image._id}
              className="relative mb-2 group break-inside-avoid"
            >
              <div
                className={`block w-full p-1 overflow-hidden bg-gray-100 rounded-lg 
                cursor-pointer transition-all duration-200 hover:shadow-md ${
                  isSelected
                    ? "border-2 border-blue-500 shadow-lg transform scale-[1.02]"
                    : "border border-transparent hover:border-gray-300"
                }`}
                onClick={() => handleSelectImage(imageUrl)}
                role="button"
                aria-pressed={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleSelectImage(imageUrl);
                  }
                }}
              >
                <div className="relative flex items-center justify-center w-full bg-gray-100 rounded">
                  {fileType === "image" ? (
                    <Image
                      preview={false}
                      src={image.thumbnail_url || image.url}
                      alt={image.name || "Image"}
                      className="object-cover w-full h-auto rounded"
                      loading="lazy"
                      placeholder={
                        <div className="w-full bg-gray-200 rounded aspect-square animate-pulse" />
                      }
                      fallback="https://placehold.co/128x128?text=No+Image&font=roboto&style=bold&font-size=14"
                      style={{
                        minHeight: "120px",
                        maxHeight: "300px",
                        display: "block",
                      }}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-full h-32 min-h-[120px]">
                      {fileIcons[fileType] || fileIcons.default}
                    </div>
                  )}
                </div>

                {/* Delete button - only show on hover */}
                <Popconfirm
                  title="Delete this file?"
                  description="This action cannot be undone."
                  onConfirm={() =>
                    handleDeleteImage(image.public_id, image._id)
                  }
                  okText="Delete"
                  cancelText="Cancel"
                  placement="topRight"
                >
                  <button
                    className="absolute p-1.5 text-red-500 transition-all duration-200 bg-white rounded-full opacity-0 top-2 right-2 hover:bg-red-500 hover:text-white group-hover:opacity-100 shadow-sm z-10"
                    aria-label={`Delete ${image.name || "image"}`}
                    onClick={(e) => e.stopPropagation()}
                    disabled={isDeletingImage}
                  >
                    <BsTrash size={12} />
                  </button>
                </Popconfirm>

                {/* Selection indicator */}
                {isSelected && (
                  <div className="absolute z-10 flex items-center justify-center w-6 h-6 bg-blue-500 rounded-full shadow-md top-2 left-2">
                    <span className="text-xs font-bold text-white">✓</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }, [
    images,
    selectedImages,
    handleSelectImage,
    handleDeleteImage,
    isSelectThumbnail,
    isDeletingImage,
    imagesError,
  ]);

  // Derived loading states
  const isLoading = imagesLoading || imagesFetching;
  const isFoldersLoading = foldersLoading || foldersFetching;

  // Footer buttons
  const footerButtons = useMemo(
    () => (
      <Space>
        <Button onClick={onClose} size="large">
          Cancel
        </Button>
        <Button
          type="primary"
          onClick={handleOk}
          disabled={selectedImages.length === 0}
          size="large"
        >
          {mode === "single"
            ? "Select Image"
            : `Select ${selectedImages.length} Image${
                selectedImages.length !== 1 ? "s" : ""
              }`}
        </Button>
      </Space>
    ),
    [onClose, handleOk, selectedImages.length, mode],
  );

  return (
    <Drawer
      title="Select Image from Gallery"
      size="large"
      width="70%"
      open={open}
      onClose={onClose}
      footer={footerButtons}
      destroyOnClose
      className="gallery-modal"
    >
      <div className="flex flex-col h-full">
        {/* Loading State */}
        {isLoading ? (
          <ImageLoadingSkeleton />
        ) : (
          <>
            <Card
              title="Select a folder to view images"
              className="mb-4"
              size="small"
            >
              <Space size="middle" className="flex-wrap mb-2">
                <Select
                  style={{ width: 300 }}
                  size="large"
                  placeholder="Search and select a folder"
                  onChange={handleFolderChange}
                  loading={isFoldersLoading}
                  value={currentFolder}
                  showSearch
                  filterOption={filterOption}
                  onSearch={handleFolderSearch}
                  allowClear
                  notFoundContent={
                    foldersError ? "Failed to load folders" : "No folders found"
                  }
                  options={folders.map((folder: Folder) => ({
                    label: `${folder.name} (${
                      folder.images?.length || 0
                    } images)`,
                    value: folder._id,
                  }))}
                />
                <Button
                  type="primary"
                  onClick={() => refetchImages()}
                  icon={<IoRefresh />}
                  loading={isLoading}
                  size="large"
                >
                  Refresh
                </Button>
                <UploadImagePopover />
                <CreateFolder />
              </Space>
            </Card>
            {selectedImages.length > 0 && SelectedImagesPreview}

            {/* Image Grid */}
            <div
              className={`flex-1  ${
                isLoading && images.length > 0
                  ? "opacity-60 pointer-events-none"
                  : ""
              }`}
            >
              {ImageGrid}
              {images.length > 0 &&
                metaData &&
                metaData.total > metaData.limit && (
                  <div className="flex items-center justify-between px-4 py-2 bg-white border-t">
                    <div className="py-4 text-sm text-gray-600">
                      <Pagination
                        total={metaData.total || 0}
                        showTotal={(total, range) =>
                          `${range[0]}-${range[1]} of ${total} items`
                        }
                        pageSize={metaData.limit || 12}
                        current={metaData.page || 1}
                        onChange={handlePageChange}
                        disabled={isLoading}
                        showSizeChanger={false}
                        size="default"
                      />
                    </div>
                  </div>
                )}
            </div>

            {/* Pagination */}
          </>
        )}
      </div>
    </Drawer>
  );
};

export default GalleryModal;
