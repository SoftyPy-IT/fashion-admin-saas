import { useLocation } from "react-router-dom";
import Container from "../../../ui/Container";
import { BsTrash } from "react-icons/bs";
import { Button, Card, Image, Pagination, Popconfirm } from "antd";
import { TQueryParam } from "../../../types";
import { useState } from "react";
import {
  useDeleteImageMutation,
  useGetImagesByFolderQuery,
  useUploadImageMutation,
} from "../../../redux/features/gallery/gallery.api";
import { toast } from "sonner";
import AppForm from "../../../components/form/AppForm";
import AppSelectFile from "../../../components/form/AppSelectFile";
import ImageLoadingSkeleton from "./ImageLoadingSkeleton";
import { handleDelete } from "./utils";
import { FaFilePdf, FaFileCsv } from "react-icons/fa"; // Importing file icons

const fileIcons: Record<string, JSX.Element> = {
  pdf: <FaFilePdf className="text-6xl text-red-600" />,
  csv: <FaFileCsv className="text-6xl text-green-600" />,
};

const GalleryImages = () => {
  const {
    state: { folder },
  } = useLocation();

  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: imagesData,
    isLoading,
    isFetching,
  } = useGetImagesByFolderQuery([
    ...params,
    { name: "folder", value: folder ? folder : "" },
    { name: "limit", value: 24 },
  ]) as any;

  const images = imagesData?.data?.images;
  const metaData = imagesData?.data?.meta;

  const [deleteImage] = useDeleteImageMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();

  const handleUpload = async (data: any) => {
    const toastId = toast.loading("Uploading image");
    try {
      const formData = new FormData();
      data.images.forEach((file: any) => {
        formData.append("images", file.originFileObj);
      });
      formData.append("folder", folder);

      await uploadImage(formData).unwrap();
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred. Please try again.",
        {
          id: toastId,
          duration: 3000,
        },
      );
    }
  };

  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      "webp"
      ? "image"
      : extension;
  };

  const pages = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Gallery", href: "/dashboard/settings/gallery", current: false },
    {
      name: `Manage ${imagesData?.data?.folder} Images`,
      href: "#",
      current: true,
    },
  ];

  return (
    <Container
      pages={pages}
      pageTitle={`Manage ${imagesData?.data?.folder} Images`}
      pageHeadingHref="/dashboard/settings/gallery"
      pageHeadingButtonText="Go back"
    >
      {isLoading || isFetching ? (
        <ImageLoadingSkeleton />
      ) : (
        <>
          <Card style={{ width: 300, marginBottom: "20px" }}>
            <AppForm onSubmit={handleUpload}>
              <AppSelectFile label="Upload Image" name="images" />
              <Button
                className="w-full btn"
                loading={isUploading}
                disabled={isUploading}
                htmlType="submit"
              >
                Upload
              </Button>
            </AppForm>
          </Card>
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 2xl:grid-cols-6 xl:gap-x-8"
          >
            {images?.map((image: any) => {
              const fileType = getFileType(image.url);
              return (
                <li key={image._id} className="relative">
                  <div className="block w-full p-2 overflow-hidden bg-gray-100 rounded-lg group">
                    <div className="flex items-center justify-center ">
                      {fileType === "image" ? (
                        <Image
                          src={image.thumbnail_url}
                          alt={image.name}
                          width={250}
                          height={250}
                        />
                      ) : (
                        <a
                          href={image.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {fileIcons[fileType as any] || (
                            <FaFileCsv className="text-6xl text-gray-600" />
                          )}
                        </a>
                      )}
                    </div>
                    <Popconfirm
                      title="Are you sure to delete this file?"
                      onConfirm={() =>
                        handleDelete(image.public_id, image._id, deleteImage)
                      }
                    >
                      <button className="absolute p-1 text-red-500 transition-colors duration-300 ease-in-out bg-white rounded-full top-2 right-2 hover:bg-red-500 hover:text-white">
                        <BsTrash />
                      </button>
                    </Popconfirm>
                  </div>
                </li>
              );
            })}
          </ul>

          <Pagination
            total={metaData?.total || 0}
            showTotal={
              metaData?.total ? (total) => `Total ${total} items` : undefined
            }
            pageSize={metaData?.limit}
            current={metaData?.page}
            showSizeChanger={false}
            onChange={(page) => setParams([{ name: "page", value: page }])}
            className="mt-10"
          />
        </>
      )}
    </Container>
  );
};

export default GalleryImages;
