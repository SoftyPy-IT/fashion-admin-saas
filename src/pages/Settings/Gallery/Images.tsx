import { useState } from "react";
import { TQueryParam } from "../../../types";
import Container from "../../../ui/Container";
import {
  useDeleteImageMutation,
  useGetAllImagesQuery,
  useGetFoldersQuery,
} from "../../../redux/features/gallery/gallery.api";
import {
  Button,
  Card,
  Image,
  Pagination,
  Popconfirm,
  Select,
  Space,
} from "antd";
import { BsTrash } from "react-icons/bs";
import { IoRefresh } from "react-icons/io5";
import { FaFilePdf, FaFileCsv } from "react-icons/fa";
import UploadImagePopover from "../../../components/data-display/gallery-modal/UploadImagePopover";
import CreateFolder from "./CreateFolder";
import ImageLoadingSkeleton from "./ImageLoadingSkeleton";
import { handleDelete } from "./utils";

const fileIcons: Record<string, JSX.Element> = {
  pdf: <FaFilePdf className="text-6xl text-red-600" />,
  csv: <FaFileCsv className="text-6xl text-green-600" />,
};

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Images", href: "/dashboard/gallery/images", current: true },
];

const Images = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: imagesData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllImagesQuery([...params]) as any;
  const [deleteImage] = useDeleteImageMutation();
  const {
    data: foldersData,
    isLoading: foldersIsLoading,
    isFetching: foldersIsFetching,
  } = useGetFoldersQuery([{ name: "limit", value: 200 }]) as any;

  const folders = foldersData?.data;
  const metaData = imagesData?.meta;
  const images = imagesData?.data;

  const filterOption = (
    input: string,
    option?: { label: string; value: string },
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getFileType = (url: string) => {
    const extension = url.split(".").pop()?.toLowerCase();
    return extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "webp"
      ? "image"
      : extension;
  };

  return (
    <Container
      pages={pages}
      pageTitle="Manage your images here"
      pageHeadingHref="/dashboard"
      pageHeadingButtonText="Go back to dashboard"
    >
      {isLoading || isFetching ? (
        <ImageLoadingSkeleton />
      ) : (
        <>
          <Card title="Select a folder to view images" className="mb-3">
            <Space size="middle">
              <Select
                style={{ width: 300 }}
                size="large"
                placeholder="Select a folder"
                onChange={(value) => setParams([{ name: "folder", value }])}
                loading={foldersIsLoading || foldersIsFetching}
                defaultValue={
                  params.find((param) => param.name === "folder")?.value
                }
                showSearch
                filterOption={filterOption}
              >
                {folders?.map((folder: any) => (
                  <Select.Option key={folder._id} value={folder._id}>
                    {folder.name}
                  </Select.Option>
                ))}
              </Select>

              <Button
                type="primary"
                onClick={() => refetch()}
                icon={<IoRefresh />}
              >
                Refresh
              </Button>
              <UploadImagePopover />
              <CreateFolder />
            </Space>
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

export default Images;
