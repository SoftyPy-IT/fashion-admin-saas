import { ReactNode, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import { FaFilePdf, FaImage, FaTrash } from "react-icons/fa";
import moment, { MomentInput } from "moment";
import { ProColumns } from "@ant-design/pro-components";
// import { IoDocuments } from "react-icons/io5";
// import { Link } from "react-router-dom";
import { TQueryParam } from "../../../types";
import {
  useDeleteExpenseMutation,
  useGetAllExpensesQuery,
} from "../../../redux/features/purchase/expense.api";
import AppTable from "../../../components/data-display/AppTable";

import { formatPrice } from "../../../libs";

export interface TExpenseData {
  date: Date;
  reference: string;
  attachDocument?: {
    url: string;
    publicId: string;
  };
  amount: number;
  note: string;
}

const ExpenseTable = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllExpensesQuery([
    ...params,
  ]);
  const [handleDelete, { isLoading: isDeleting }] = useDeleteExpenseMutation();

  const tableData = data?.data?.map((expense: any) => ({
    ...expense,
    key: expense._id,
  }));

  const metaData = data?.meta;

  const getAttachmentIcon = (attachmentUrl: string) => {
    const extension = attachmentUrl.split(".").pop();
    if (extension === "pdf") {
      return <FaFilePdf size={20} />;
    }
    return <FaImage size={20} />;
  };

  const columns: ProColumns<TExpenseData>[] = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: any) => moment(date as MomentInput).format("MMM Do YY"),
    },
    {
      title: "Reference No",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: any) => formatPrice(amount),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
    {
      title: "Attachment",
      key: "attachDocument",
      render: (item: any) =>
        item.attachDocument ? (
          <a
            href={item?.attachDocument.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            {getAttachmentIcon(item?.attachDocument.url)}
          </a>
        ) : (
          <span>No attachment</span>
        ),
    },
    {
      title: "Action",
      key: "action",
      render: (_dom: ReactNode, item: any) => (
        <Space>
          {/* <Link to={`/dashboard/expenses/manage/${item._id}`}>
            <Button type="dashed" size="small" icon={<IoDocuments />}>
              Details
            </Button>
          </Link> */}
          <Popconfirm
            title="Are you sure to delete this expense?"
            onConfirm={() => handleDelete(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="dashed"
              size="small"
              danger
              icon={<FaTrash />}
              loading={isDeleting}
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold">Expenses</h2>
      <AppTable<TExpenseData>
        columns={columns}
        dataSource={tableData as any}
        title="Expenses"
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
      />
    </>
  );
};

export default ExpenseTable;
