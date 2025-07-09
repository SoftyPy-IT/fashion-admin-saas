import React from "react";
import { useParams } from "react-router-dom";
import {
  Descriptions,
  Table,
  Alert,
  Card,
  Row,
  Col,
  Space,
  Tooltip,
  Skeleton,
} from "antd";
import Container from "../../../ui/Container";
import { useGetStockQuery } from "../../../redux/features/inventory/stock.api";
import { IStock } from "../../../types/stock.types";
import { formatPrice } from "../../../libs";
import moment from "moment";
import { FaFileCsv } from "react-icons/fa6";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Manage Stock", href: "#", current: true },
];

const ViewCount: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetStockQuery(id as string);

  if (isLoading) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Stock"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Skeleton active />
      </Container>
    );
  }

  if (isError || !data) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Stock"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Alert
          message="Error"
          description="Failed to load stock data."
          type="error"
          showIcon
        />
      </Container>
    );
  }

  const stock = data as unknown as IStock;

  // Calculate totals
  const totals = stock.counts.reduce(
    (acc, item) => {
      acc.expected += item.expected;
      acc.counted += item.counted;
      acc.difference += item.difference;
      acc.cost += item.cost;
      acc.costAmountC += item.cost * item.counted;
      acc.costAmountE += item.cost * item.expected;
      acc.costAmountD += item.cost * item.difference;
      return acc;
    },
    {
      expected: 0,
      counted: 0,
      difference: 0,
      cost: 0,
      costAmountC: 0,
      costAmountE: 0,
      costAmountD: 0,
    }
  );

  const columns = [
    {
      title: "No",
      dataIndex: "no",
      key: "no",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Expected",
      dataIndex: "expected",
      key: "expected",
    },
    {
      title: "Counted",
      dataIndex: "counted",
      key: "counted",
    },
    {
      title: "Difference",
      dataIndex: "difference",
      key: "difference",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
    },
    {
      title: "Cost Amount(C)",
      key: "subtotal",
      render: (record: any) => formatPrice(record.cost * record.counted),
    },
    {
      title: "Cost Amount(E)",
      key: "subtotal",
      render: (record: any) => formatPrice(record.cost * record.expected),
    },
    {
      title: "Cost Amount(D)",
      key: "subtotal",
      render: (record: any) => formatPrice(record.cost * record.difference),
    },
  ];

  return (
    <Container
      pages={pages}
      pageTitle="Manage Stock"
      pageHeadingHref="/dashboard/inventory/manage-stock"
      pageHeadingButtonText="Go back"
    >
      <Card className="mb-6">
        <Descriptions title="Stock Information" bordered column={2}>
          <Descriptions.Item label="Start Date">
            {moment(stock.startDate).format("MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
          <Descriptions.Item label="End Date">
            {moment(stock.endDate).format("MMMM Do YYYY, h:mm:ss a")}
          </Descriptions.Item>
          <Descriptions.Item label="Reference">
            {stock.reference}
          </Descriptions.Item>
          <Descriptions.Item label="Type">{stock.type}</Descriptions.Item>
          {stock.brands && (
            <Descriptions.Item label="Brand">
              {stock?.brands?.map((brand) => brand.name).join(", ")}
            </Descriptions.Item>
          )}
          {stock.categories && (
            <Descriptions.Item label="Categories">
              {stock?.categories?.map((category) => category.name).join(", ")}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Is Final Calculation">
            {stock.isFinalCalculation ? "Yes" : "No"}
          </Descriptions.Item>
          <Descriptions.Item label="Download CSV">
            <Space>
              <Tooltip title="Download Initial Stock CSV">
                <a
                  href={stock?.initialStockCSV?.url}
                  target="_blank"
                  download
                  rel="noopener noreferrer"
                >
                  <FaFileCsv size={30} />
                </a>
              </Tooltip>
              {stock?.finalStockCSV && (
                <Tooltip title="Download Final Stock CSV">
                  <a
                    href={stock?.finalStockCSV?.url}
                    target="_blank"
                    download
                    rel="noopener noreferrer"
                  >
                    <FaFileCsv size={30} />
                  </a>
                </Tooltip>
              )}
            </Space>
          </Descriptions.Item>
          <Descriptions.Item label="Note">{stock.note}</Descriptions.Item>
        </Descriptions>
      </Card>

      <Card>
        <Table
          bordered
          columns={columns}
          dataSource={stock.counts}
          pagination={false}
          rowKey="_id"
          footer={() => (
            <Row
              justify="space-between"
              className="p-4 font-semibold bg-gray-100 rounded-md"
            >
              <Col>
                <div>Total Expected: {totals.expected}</div>
              </Col>
              <Col>
                <div>Total Counted: {totals.counted}</div>
              </Col>
              <Col>
                <div>Total Difference: {totals.difference}</div>
              </Col>
              <Col>
                <div>
                  Total Cost Amount (C): {formatPrice(totals.costAmountC)}
                </div>
              </Col>
              <Col>
                <div>
                  Total Cost Amount (E): {formatPrice(totals.costAmountE)}
                </div>
              </Col>
              <Col>
                <div>
                  Total Cost Amount (D): {formatPrice(totals.costAmountD)}
                </div>
              </Col>
            </Row>
          )}
        />
      </Card>
    </Container>
  );
};

export default ViewCount;
