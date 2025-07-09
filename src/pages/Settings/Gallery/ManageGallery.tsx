import { useState } from "react";
import { useGetFoldersQuery } from "../../../redux/features/gallery/gallery.api";
import Container from "../../../ui/Container";
import { TQueryParam } from "../../../types";
import { GalleryFolder } from "./GalleryFolder";
import { Empty, Pagination } from "antd";
import FolderLoadingSkeleton from "./FolderLoadingSkeleton";
import CreateFolder from "./CreateFolder";
import { Input } from "antd";
const { Search } = Input;

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Gallery", href: "/dashboard/gallery/manage", current: true },
];

const ManageGallery = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: foldersData,
    isLoading,
    isFetching,
  } = useGetFoldersQuery([...params]) as any;

  const metaData = foldersData?.meta;
  const folders = foldersData?.data;

  return (
    <Container
      pages={pages}
      pageTitle="Manage your gallery here"
      pageHeadingHref="/dashboard"
      pageHeadingButtonText="Go back to dashboard"
    >
      {isLoading || isFetching ? (
        <FolderLoadingSkeleton />
      ) : (
        <>
          <div
            className="flex items-center justify-between w-full space-x-5"
            style={{ maxWidth: "600px" }}
          >
            <CreateFolder />
            <Search
              className=""
              placeholder="input search text"
              enterButton="Search"
              size="large"
              autoFocus
              defaultValue={params
                .find((p) => p.name === "searchTerm")
                ?.value?.toString()}
              onSearch={(value) =>
                setParams([{ name: "searchTerm", value: value }])
              }
              loading={isFetching}
            />
          </div>
          {folders?.length === 0 && <Empty />}
          <div className="grid grid-cols-1 gap-8 mt-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5">
            {folders?.map((folder: any) => (
              <GalleryFolder key={folder._id} folder={folder} />
            ))}
          </div>
          <div>
            <Pagination
              total={metaData?.total || 0}
              current={metaData?.page}
              pageSize={metaData?.limit || 1}
              showSizeChanger={false}
              onChange={(page, pageSize) =>
                setParams([
                  { name: "page", value: page },
                  { name: "limit", value: pageSize },
                ])
              }
              className="mt-10"
            />
          </div>
        </>
      )}
    </Container>
  );
};

export default ManageGallery;
