import { Link, useParams } from "react-router-dom";
import Container from "../../../ui/Container";
import { useGetExpenseCategoryByIdQuery } from "../../../redux/features/purchase/expense-category.api";
import { Card, Spin, Table } from "antd";
import { useMemo } from "react";
import moment from "moment";
import { formatPrice } from "../../../libs";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchase", current: false },
  {
    name: "Manage Expense Categories",
    href: "/dashboard/purchases/expense-categories",
    current: true,
  },
];

const ExpenseCategoryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetExpenseCategoryByIdQuery(id);

  // Define table columns for expenses
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) => moment(date).format("MMM Do YYYY"),
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => formatPrice(amount),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
    },
  ];

  // Calculate total amount
  const totalAmount = useMemo(() => {
    return (
      data?.data.expenses.reduce(
        (acc: number, expense: any) => acc + expense.amount,
        0
      ) || 0
    );
  }, [data]);

  if (isLoading) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Expense Categories"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <div className="flex items-center justify-center h-64">
          <Spin size="large" />
        </div>
      </Container>
    );
  }

  return (
    <Container
      pages={pages}
      pageTitle="Manage Expense Categories"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <Card
        title="Expense Category Details"
        extra={<Link to="/dashboard/purchases/expense-categories">Back</Link>}
      >
        <div className="p-6 bg-white rounded-lg ">
          <h2 className="mb-4 text-2xl font-semibold">
            Name: {data?.data.name}
          </h2>
          <p className="mb-2 text-gray-600">Code: {data?.data.code}</p>
          <p className="mb-4 text-gray-600">
            Total Expenses: {formatPrice(totalAmount)}
          </p>

          <Table
            bordered
            columns={columns}
            dataSource={data?.data.expenses.map((expense: any) => ({
              ...expense,
              key: expense._id,
            }))}
            pagination={false}
          />
        </div>
      </Card>
    </Container>
  );
};

export default ExpenseCategoryDetails;
