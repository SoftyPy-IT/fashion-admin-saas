import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space, Tag } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit, FaEye } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import ComboDrawer from "./ComboDrawer";
import {
  useDeleteComboMutation,
  useGetAllComboQuery,
} from "../../../redux/features/combo/combo.api";

export type TTableData = {
  _id: string;
  name: string;
  code: string;
  slug: string;
  items: Array<{
    _id: string;
    name: string;
    code: string;
    price: number;
    stock: number;
  }>;
};

const ComboTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteCombo] = useDeleteComboMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: comboData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllComboQuery([...params]);

  const tableData = Array.isArray(comboData?.data)
    ? comboData.data.map((item: TTableData) => ({
        ...item,
      }))
    : [];

  const metaData = comboData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteCombo(id).unwrap();
      toast.success("Combo deleted successfully", {
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
      title: "Combo Code",
      dataIndex: "code",
      key: "code",
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
      title: "Slug",
      dataIndex: "slug",
      key: "slug",
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (_, record: TTableData) => {
        return (
          <Space direction="vertical">
            {record.items?.map((item) => (
              <Tag key={item._id} color="blue">
                {item.name} (${item.price})
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: "Total Items",
      key: "totalItems",
      render: (_, record: TTableData) => {
        return record.items?.length || 0;
      },
    },
    {
      title: "Action",
      key: "x",
      render: (_, item: TTableData) => {
        return (
          <Space>
            <Button
              type="dashed"
              size="small"
              icon={<FaEye />}
              onClick={() => {
                // Implement view details modal/drawer if needed
                console.log("View combo details:", item);
              }}
            >
              View
            </Button>

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
              title="Are you sure you want to delete this combo?"
              onConfirm={() => item && handleDelete(item._id)}
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
        title="Combo"
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
        <ComboDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default ComboTable;
