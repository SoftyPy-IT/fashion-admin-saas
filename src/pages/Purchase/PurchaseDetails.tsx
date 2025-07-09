import { useParams } from "react-router-dom";
import { Descriptions, Card, Table, Skeleton, Typography, Badge } from "antd";
import { FaFilePdf, FaImage } from "react-icons/fa";
import moment from "moment";
import { useGetPurchaseByIdQuery } from "../../redux/features/purchase/purchase.api";
import Container from "../../ui/Container";
import { formatPrice } from "../../libs";

const { Title, Text } = Typography;

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchases", href: "/dashboard/purchases/manage", current: false },
  { name: "Manage", href: "/dashboard/purchases/manage", current: false },
  { name: "Details", href: "", current: true },
];

const PurchaseDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, error } = useGetPurchaseByIdQuery(id);

  if (isLoading) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Purchases"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Skeleton active />
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Purchases"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Text type="danger">Failed to load purchase details.</Text>
      </Container>
    );
  }

  const purchase = data?.data;

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
      pageTitle="Manage Purchases"
      pageHeadingHref="/dashboard/purchases/manage"
      pageHeadingButtonText="Go Back"
    >
      <Card title={<Title level={3}>Purchase Details</Title>} className="mb-6">
        <Descriptions
          bordered
          column={2}
          labelStyle={{ fontWeight: "bold", backgroundColor: "#fafafa" }}
          contentStyle={{ backgroundColor: "#ffffff" }}
        >
          <Descriptions.Item label="Reference">
            {purchase?.reference}
          </Descriptions.Item>
          <Descriptions.Item label="Date">
            {moment(purchase?.date).format("MMM Do YYYY")}
          </Descriptions.Item>
          <Descriptions.Item label="Supplier">
            <Text strong>{purchase?.supplier?.name}</Text>
            <br />
            <Text type="secondary">{purchase?.supplier?.company}</Text>
            <br />
            {purchase?.supplier?.email}
            <br />
            {purchase?.supplier?.phone}
            <br />
            {purchase?.supplier?.address}, {purchase?.supplier?.city},{" "}
            {purchase?.supplier?.state}, {purchase?.supplier?.postalCode},{" "}
            {purchase?.supplier?.country}
          </Descriptions.Item>
          <Descriptions.Item label="Status">
            <Badge status="processing" text={purchase?.status} />
          </Descriptions.Item>
          <Descriptions.Item label="Total">
            {formatPrice(purchase?.total)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Quantity">
            <Badge
              count={purchase?.total_quantity}
              style={{ backgroundColor: "#52c41a" }}
            />
          </Descriptions.Item>
          <Descriptions.Item label="Total Tax">
            {formatPrice(purchase?.total_tax)}
          </Descriptions.Item>
          <Descriptions.Item label="Total Discount">
            {formatPrice(purchase?.total_discount)}
          </Descriptions.Item>
          <Descriptions.Item label="Grand Total">
            <Text strong>{formatPrice(purchase?.grand_total)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Note">
            <Text>{purchase?.note || "No notes available"}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Attachment">
            {purchase?.attachDocument ? (
              <a
                href={purchase?.attachDocument.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                {getAttachmentIcon(purchase.attachDocument.url)}
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
          dataSource={purchase?.items}
          columns={columns}
          pagination={false}
          rowKey="id"
          footer={() => (
            <div className="flex justify-end mt-4">
              <div className="w-full max-w-sm p-4 border rounded-lg shadow-sm bg-gray-50">
                <div className="mb-2 text-lg font-semibold text-gray-700">
                  Summary
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Quantity:</span>
                  <span className="font-medium">
                    {purchase?.total_quantity}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-gray-600">
                  <span>Subtotal:</span>
                  <span className="font-medium">
                    {formatPrice(purchase?.total - purchase?.total_tax)}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-gray-600">
                  <span>Shipping:</span>
                  <span className="font-medium">
                    {formatPrice(purchase?.shipping)}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-gray-600">
                  <span>Discount:</span>
                  <span className="font-medium">
                    {formatPrice(purchase?.total_discount)}
                  </span>
                </div>
                <div className="flex justify-between mt-1 text-gray-600">
                  <span>Tax:</span>
                  <span className="font-medium">
                    {formatPrice(purchase?.total_tax)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 mt-3 text-gray-700 border-t">
                  <span className="text-base font-semibold">Grand Total:</span>
                  <span className="text-base font-semibold">
                    {formatPrice(purchase?.grand_total)}
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

export default PurchaseDetails;
