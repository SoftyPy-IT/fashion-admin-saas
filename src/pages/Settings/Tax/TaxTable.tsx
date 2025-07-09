import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteTaxMutation,
  useGetAllTaxesQuery,
} from "../../../redux/features/settings/tax.api";
import TaxesDrawer from "./TaxDrawer";

export type TTableData = {
  key: string;
  name: string;
  code: string;
  rate: number;
  type: string;
};

const TaxesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteTax] = useDeleteTaxMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: taxData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllTaxesQuery([...params]);

  const tableData = taxData?.data?.map(({ _id, name, code, rate, type }) => ({
    key: _id,
    name,
    code,
    rate,
    type,
  }));
  const metaData = taxData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteTax(id).unwrap();
      toast.success("Tax deleted successfully", {
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
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      sorter: (a, b) => a.rate - b.rate,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Action",
      key: "action",
      render: (item: any) => (
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
            title="Are you sure you want to delete this tax?"
            onConfirm={() => handleDelete(item?.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" size="small" danger icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Taxes"
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
        <TaxesDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default TaxesTable;
