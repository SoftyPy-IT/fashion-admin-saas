import { Button, Pagination, Popconfirm } from "antd";
import { useState } from "react";
import { FaEdit, FaFolderPlus, FaTrash } from "react-icons/fa";
import { FcOpenedFolder } from "react-icons/fc";
import Preloader from "../../../components/Preloader";
import {
  useDeleteFolderMutation,
  useGetFoldersQuery,
} from "../../../redux/features/gallery/gallery.api";
import { TMeta, TQueryParam } from "../../../types";
import Container from "../../../ui/Container";
import CreateFolderModal from "./_components/CreateFolderModal";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Products Folders", href: "#", current: true },
];

const ProductsFolders = () => {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [editingFolder, setEditingFolder] = useState(null);
  const [deleteFolder] = useDeleteFolderMutation();

  const { data, isLoading } = useGetFoldersQuery([
    {
      name: "type",
      value: "product",
    },
    ...params,
  ]);

  if (isLoading) {
    return <Preloader />;
  }

  const metaData = data?.meta as TMeta | undefined;
  const folders = data?.data;

  const handleDeleteFolder = async (folderId: string) => {
    const toastId = toast.loading("Creating folder...");
    try {
      await deleteFolder(folderId).unwrap();
      toast.success("Folder deleted successfully", {
        id: toastId,
        duration: 3000,
      });
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

  return (
    <Container
      pages={pages}
      pageTitle="Product Folders"
      pageHeadingButtonText=""
      pageHeadingHref=""
    >
      <div className="flex items-center justify-between mb-4">
        <Button
          type="primary"
          icon={<FaFolderPlus />}
          onClick={() => {
            setEditingFolder(null);
            setOpen(true);
          }}
        >
          Create Folder
        </Button>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {folders?.map((folder: any) => (
              <div
                key={folder.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <Link
                  to={`/dashboard/products/folders/${folder.id}`}
                  className="w-full"
                >
                  <div className="flex items-center">
                    <FcOpenedFolder className="w-10 h-10 mr-2" />
                    <span>
                      {folder.name}
                      <span className="text-xs text-gray-500">
                        {" "}
                        ({folder.totalProducts} products)
                      </span>
                    </span>
                  </div>
                </Link>
                <div className="flex space-x-2">
                  <Button
                    type="text"
                    icon={<FaEdit />}
                    onClick={() => {
                      setEditingFolder(folder);
                      setOpen(true);
                    }}
                  />
                  <Popconfirm
                    title="Are you sure you want to delete this folder?"
                    onConfirm={() => handleDeleteFolder(folder.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger icon={<FaTrash />} />
                  </Popconfirm>
                </div>
              </div>
            ))}
          </div>

          {metaData && (
            <div className="flex justify-center mt-6">
              <Pagination
                current={Number(metaData?.page)}
                total={metaData?.total}
                pageSize={metaData?.limit}
                onChange={(page, pageSize) => {
                  setParams((prev) => {
                    const newParams = prev.filter(
                      (param) =>
                        param.name !== "page" && param.name !== "limit",
                    );
                    return [
                      ...newParams,
                      { name: "page", value: page.toString() },
                      { name: "limit", value: pageSize.toString() },
                    ];
                  });
                }}
                showSizeChanger={false}
                showTotal={(total, range) =>
                  `${range[0]}-${range[1]} of ${total} folders`
                }
              />
            </div>
          )}
        </>
      )}

      {open && (
        <CreateFolderModal
          visible={open}
          onClose={() => {
            setOpen(false);
            setEditingFolder(null);
          }}
          initialData={editingFolder}
        />
      )}
    </Container>
  );
};

export default ProductsFolders;
