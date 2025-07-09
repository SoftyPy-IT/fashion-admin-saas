import { useParams } from "react-router-dom";
import { useGetQuotationByIdQuery } from "../../../redux/features/quotaions/quotaions.api";
import Container from "../../../ui/Container";
import { Descriptions, Card, Table, Skeleton, Typography, Badge } from "antd";
import { FaFilePdf, FaImage } from "react-icons/fa";
import moment from "moment";
import { formatPrice } from "../../../libs";

const { Title, Text } = Typography;

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Quotations", href: "/dashboard/quotations/manage", current: false },
  { name: "Manage", href: "/dashboard/quotations/manage", current: false },
  { name: "Details", href: "", current: true },
];

const QuotationsDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetQuotationByIdQuery(id);

  if (isLoading) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Quotations"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Skeleton active />
      </Container>
    );
  }

  const quotation = data?.data;

  const getAttachmentIcon = (attachmentUrl: string) => {
    const extension = attachmentUrl.split(".").pop();
    if (extension === "pdf") {
      return <FaFilePdf size={20} />;
    }
    return <FaImage size={20} />;
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: "product_name",
      key: "product_name",
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: "Product Code",
      dataIndex: "product_code",
      key: "product_code",
      render: (text: string) => <Text type="secondary">{text}</Text>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      render: (text: number) => (
        <Badge count={text} style={{ backgroundColor: "#52c41a" }} />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      key: "unit_price",
      render: (text: number) => <Text>{formatPrice(text)}</Text>,
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (text: number) => <Text>{formatPrice(text)}</Text>,
    },
    {
      title: "Tax",
      dataIndex: "tax",
      key: "tax",
      render: (text: number) => <Text>{formatPrice(text)}</Text>,
    },
    {
      title: "Subtotal",
      dataIndex: "sub_total",
      key: "sub_total",
      render: (text: number) => <Text>{formatPrice(text)}</Text>,
    },
  ];

  return (
    <Container
      pages={pages}
      pageTitle="Manage Quotations"
      pageHeadingHref="/dashboard/quotations/manage"
      pageHeadingButtonText="Go Back"
    >
      <Card title={<Title level={3}>Quotation Details</Title>} className="mb-6">
        <Descriptions
          bordered
          column={2}
          labelStyle={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
          contentStyle={{ backgroundColor: "#ffffff" }}
        >
          <Descriptions.Item label="Reference">
            {quotation?.reference}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {moment(quotation?.date).format("MMM Do YY")}
          </Descriptions.Item>
          <Descriptions.Item label="Biller">
            <Text strong>{quotation?.biller.name}</Text> (
            {quotation?.biller.company})
          </Descriptions.Item>
          <Descriptions.Item label="Customer">
            <Text strong>{quotation?.customer.name}</Text> (
            {quotation?.customer.company})
          </Descriptions.Item>
          <Descriptions.Item label="Supplier">
            <Text strong>{quotation?.supplier.name}</Text> (
            {quotation?.supplier.company})
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="processing" text={quotation?.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            {formatPrice(quotation?.total)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Quantity">
            <Badge
              count={quotation?.total_quantity}
              style={{ backgroundColor: "#52c41a" }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Total Tax">
            {formatPrice(quotation?.total_tax)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Discount">
            {formatPrice(quotation?.total_discount)}
          </Descriptions.Item>
          <Descriptions.Item label="Grand Total">
            <Text strong>{formatPrice(quotation?.grand_total)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Note">
            <Text>{quotation?.note}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Attachment">
            {quotation?.attachDocument ? (
              <a
                href={quotation?.attachDocument.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getAttachmentIcon(quotation.attachDocument.url)}
              </a>
            ) : (
              "No attachment"
            )}
          </Descriptions.Item>
        </Descriptions>
      </Card>

      <Card title={<Title level={4}>Products</Title>} className="mb-6">
        <Table
          bordered
          dataSource={quotation?.items}
          columns={columns}
          pagination={false}
          rowKey="id"
          footer={() => (
            <div className="flex justify-end mt-4">
              <div className="bg-gray-50 border rounded-lg p-4 shadow-sm max-w-sm w-full">
                <div className="text-lg font-semibold text-gray-700 mb-2">
                  Summary
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quantity:</span>
                  <span className="font-medium">
                    {quotation?.total_quantity}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatPrice(quotation?.total - quotation?.total_tax)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Shipping:</span>
                  <span className="font-medium">
                    {formatPrice(quotation?.shipping)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Discount:</span>
                  <span className="font-medium">
                    {formatPrice(quotation?.total_discount)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600 mt-1">
                  <span>Tax:</span>
                  <span className="font-medium">
                    {formatPrice(quotation?.total_tax)}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700 mt-3 border-t pt-3">
                  <span className="font-semibold text-base">Grand Total:</span>
                  <span className="font-semibold text-base">
                    {formatPrice(quotation?.grand_total)}
                  </span>
                </div>
              </div>
            </div>
          )}
        />
      </Card>
    </Container>
  );
};

export default QuotationsDetails;
