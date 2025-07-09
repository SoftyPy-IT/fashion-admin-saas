import { ProColumns } from "@ant-design/pro-components";
import { Avatar, Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import BrandsDrawer from "./BrandsDrawer";
import {
  useDeleteBrandMutation,
  useGetAllBrandsQuery,
} from "../../../redux/features/product/brand.api";

export type TTableData = {
  key: string;
  name: string;
  description: string;
  image: string;
};

const BrandsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteBrand] = useDeleteBrandMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: brandData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBrandsQuery([...params]);

  const tableData = brandData?.data?.map(
    ({ _id, name, description, image }) => ({
      key: _id,
      name,
      description,
      image,
    }),
  );
  const metaData = brandData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteBrand(id).unwrap();
      toast.success("Brand deleted successfull", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<TTableData>[] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      width: "1%",
      render: (image) => <Avatar src={image} shape="square" size={64} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Space>
            <Button
              type="dashed"
              size="small"
              icon={<FaEdit />}
              onClick={() => {
                setInitialValues(item);
                setModalVisible(true);
                setNeedToUpdate(true);
              }}
            >
              Update
            </Button>

            <Popconfirm
              placement="left"
              title="Are you sure you want to delete this category?"
              onConfirm={() =>
                handleDelete((item as unknown as TTableData)?.key)
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
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="brand"
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
          setInitialValues(null);
          setNeedToUpdate(false);
          setModalVisible(true);
        }}
      />

      {modalVisible && (
        <BrandsDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default BrandsTable;
