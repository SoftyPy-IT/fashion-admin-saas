import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import ExpenseCategoryDrawer from "./ExpenseCategoryDrawer";
import {
  useDeleteExpenseCategoryMutation,
  useGetAllExpenseCategoriesQuery,
} from "../../../redux/features/purchase/expense-category.api";
import { Link } from "react-router-dom";
import { IoDocuments } from "react-icons/io5";

export type TExpenseCategoryData = {
  key: string;
  name: string;
  code: string;
  image?: string;
  description?: string;
};

const ExpenseCategoriesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteExpenseCategory] = useDeleteExpenseCategoryMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: expenseCategoryData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllExpenseCategoriesQuery([...params]);

  const tableData = expenseCategoryData?.data?.map(
    ({ _id, name, code, expenses }) => ({
      key: _id,
      name,
      code,
      expenses,
    })
  );
  const metaData = expenseCategoryData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteExpenseCategory(id).unwrap();
      toast.success("Expense category deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<TExpenseCategoryData>[] = [
    {
      title: "SL",
      key: "sl",
      render: (_item, _record, index) => index + 1,
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
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Expenses Count",
      dataIndex: "expenses",
      key: "expenses",
      render: (expenses: any) => expenses?.length || 0,
    },

    {
      title: "Action",
      key: "action",
      render: (item: any) => {
        return (
          <Space>
            <Link to={`/dashboard/purchases/expense-categories/${item.key}`}>
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>

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
              onConfirm={() => handleDelete(item.key)}
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
      <AppTable<TExpenseCategoryData>
        columns={columns}
        dataSource={tableData || []}
        title="Expense Categories"
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
        <ExpenseCategoryDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default ExpenseCategoriesTable;
