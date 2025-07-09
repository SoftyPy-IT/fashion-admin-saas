import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import UnitsDrawer from "./UnitsDrawer";
import {
  useDeleteUnitMutation,
  useGetAllUnitsQuery,
} from "../../../redux/features/product/units.api";

export type TTableData = {
  key: string;
  name: string;
  unit_code: string;
  base_unit: { name: string } | null;
  operator: string;
  operation_value: string;
};

const UnitsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteUnit] = useDeleteUnitMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: unitsData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUnitsQuery([...params]);

  const tableData = unitsData?.data?.map(
    ({ _id, name, unit_code, base_unit, operator, operation_value }) => ({
      key: _id,
      name,
      unit_code,
      base_unit,
      operator,
      operation_value,
    }),
  );
  const metaData = unitsData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteUnit(id).unwrap();
      toast.success("Unit deleted success", {
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
      title: "Unit Code",
      dataIndex: "unit_code",
      key: "unit_code",
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
      title: "Base Unit",
      dataIndex: "base_unit",
      key: "base_unit",
      render: (base_unit: any) => {
        return base_unit?.name || "N/A";
      },
    },
    {
      title: "Operator",
      dataIndex: "operator",
      key: "operator",
      render: (operator: any) => {
        return operator ? operator : "N/A";
      },
    },
    {
      title: "Operation Value",
      dataIndex: "operation_value",
      key: "operation_value",
      render: (operation_value: any) => {
        return operation_value ? operation_value : "N/A";
      },
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
              title="Are you sure you want to delete this unit?"
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
        title="Unit"
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
        <UnitsDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
          units={unitsData?.data || []}
          isLoadingUnits={isLoading || isFetching}
        />
      )}
    </>
  );
};

export default UnitsTable;
