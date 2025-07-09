import { ProColumns } from "@ant-design/pro-components";
import { Button, List, Popconfirm, Space, Typography } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteAttributeMutation,
  useGetAllAttributesQuery,
} from "../../../redux/features/product/attributes.api";
import VariantDrawer from "./AttributeDrawer";

const { Text } = Typography;

export type TTableData = {
  key: string;
  name: string;
  items: any;
};

const AttributesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteAttribute] = useDeleteAttributeMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: attributeData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllAttributesQuery([...params]);

  const tableData = attributeData?.data?.map(({ _id, name, items }) => ({
    key: _id,
    name,
    items,
  }));

  const metaData = attributeData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteAttribute(id).unwrap();
      toast.success("Attribute deleted success", {
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
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "10%",
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
      render: (name: any) => {
        return (
          <Space>
            <Text strong>{name}</Text>
          </Space>
        );
      },
    },
    {
      title: "Items",
      dataIndex: "items",
      key: "items",
      render: (items: any) => {
        return (
          <div
            id="scrollableDiv"
            style={{
              height: 300,
              overflow: "auto",
              padding: "0 16px",
              scrollbarWidth: "thin",
              scrollBehavior: "smooth",
              scrollbarColor: "rgba(0,0,0,0.1) rgba(0,0,0,0.05)",
            }}
          >
            <List
              dataSource={items}
              renderItem={(item: any) => (
                <List.Item key={item.name}>
                  <List.Item.Meta
                    title={<Text strong>{item.name}</Text>}
                    description={item.value}
                  />
                </List.Item>
              )}
            />
          </div>
        );
      },
    },
    {
      title: "Action",
      key: "x",
      render: (item: any) => {
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
              title="Are you sure you want to delete this attribute?"
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
        title="Attributes"
        refetch={refetch}
        loading={isLoading || isFetching}
        totalData={metaData?.total}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            {
              name: "limit",
              value: pageSize.toString(),
            },
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
        <VariantDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
          loading={isLoading}
        />
      )}
    </>
  );
};

export default AttributesTable;
