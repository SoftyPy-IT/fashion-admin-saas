import { ProColumns } from "@ant-design/pro-components";
import { Badge, Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteSectionMutation,
  useGetAllSectionsQuery,
  useUpdateSectionMutation,
} from "../../../redux/features/storefront/sections.api";
import { TQueryParam } from "../../../types";
import SectionDrawerDrawer from "./SectionDrawer";
import SectionDrawerWithImage from "./SectionDrawerWithImage";

const SectionsTable = () => {
  const [deleteSection] = useDeleteSectionMutation();
  const [updateSection] = useUpdateSectionMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisibleForImage, setModalVisibleForImage] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: sectionData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSectionsQuery([...params]) as any;

  // Map section data into table format
  const tableData = sectionData?.data?.map((section: any) => ({
    key: section._id,
    title: section.title,
    subTitle: section.subTitle,
    description: section.description,
    status: section.status,
    images: section.images, // Contain desktop and mobile images
    products: section.products, // Products array if available
    style: section.style,
    row: section.row,
    type: section.type,
  }));
  const metaData = sectionData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      const res = await deleteSection(id).unwrap();

      if (res.success === true) {
        toast.success("Section deleted successfully", {
          id: toastId,
          duration: 2000,
        });
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const toastId = toast.loading("Updating");
    try {
      const res = await updateSection({ id, status }).unwrap();

      if (res.success === true) {
        toast.success("Status updated successfully", {
          id: toastId,
          duration: 2000,
        });
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sub Title",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },

    {
      title: "Status",
      key: "status",
      render: (item: any) => {
        return (
          <Popconfirm
            placement="left"
            title={`Are you sure you want to ${
              item.status === "active" ? "deactivate" : "activate"
            } this section?`}
            className="cursor-pointer"
            onConfirm={() => {
              handleStatusChange(
                (item as { key?: string })?.key ?? "",
                item.status === "active" ? "inactive" : "active",
              );
            }}
            okText="Yes"
            cancelText="No"
          >
            {item.status === "active" ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </Popconfirm>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (item: any) => {
        return (
          <Space>
            <Link
              to={`/dashboard/storefront/sections/manage/${
                (item as { key?: string })?.key ?? ""
              }`}
            >
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>

            <Button
              type="dashed"
              size="small"
              icon={<FaEdit />}
              onClick={() => {
                if (item?.type === "banner") {
                  setInitialValues(item);
                  setNeedToUpdate(true);
                  setModalVisibleForImage(true);
                } else {
                  setInitialValues(item);
                  setNeedToUpdate(true);
                  setModalVisible(true);
                }
              }}
            >
              Update
            </Button>

            <Popconfirm
              placement="left"
              title="Are you sure you want to delete this section?"
              onConfirm={() =>
                handleDelete((item as { key?: string })?.key ?? "")
              }
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" size="small" danger icon={<FaTrash />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
      width: "1%",
    },
  ];

  return (
    <>
      <AppTable<any>
        columns={columns}
        dataSource={(tableData as unknown as any[]) || []}
        title="sections With Products"
        actionTitle="Add Section With Image"
        action={() => {
          setModalVisibleForImage(true);
          setInitialValues(null);
          setNeedToUpdate(false);
        }}
        refetch={refetch}
        loading={isLoading || isFetching}
        totalData={metaData?.total}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            { name: "limit", value: pageSize.toString() },
          ]);
        }}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          setModalVisible(true);
          setInitialValues(null);
          setNeedToUpdate(false);
        }}
      />

      {modalVisible && (
        <SectionDrawerDrawer
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          defaultValues={initialValues}
          needToUpdate={needToUpdate}
        />
      )}
      {modalVisibleForImage && (
        <SectionDrawerWithImage
          open={modalVisibleForImage}
          onClose={() => setModalVisibleForImage(false)}
          defaultValues={initialValues}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default SectionsTable;
