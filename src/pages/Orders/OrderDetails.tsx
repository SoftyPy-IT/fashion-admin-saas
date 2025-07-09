import {
  Divider,
  Skeleton,
  Steps,
  Table,
  TableProps,
  Tag,
  Card,
  Descriptions,
  Typography,
  Tooltip,
} from "antd";
import { useParams } from "react-router-dom";
import { formatPrice } from "../../libs";
import { useGetOrderQuery } from "../../redux/features/orders/orders.api";
import { TOrderData } from "../../types";
import Container from "../../ui/Container";
import {
  UserOutlined,
  PhoneOutlined,
  CreditCardOutlined,
  CopyOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { toast } from "sonner";

const { Title, Text } = Typography;

const OrderDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isFetching } = useGetOrderQuery(id as string);

  const pages = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Orders", href: "/dashboard/orders", current: false },
    { name: "Order Details", href: "#", current: true },
  ];

  const order = data as TOrderData | undefined;

  if (isLoading || isFetching) {
    return (
      <Container
        pages={pages}
        pageTitle="Order Details"
        pageHeadingHref="/dashboard/orders/manage"
        pageHeadingButtonText="Manage Orders"
      >
        <div className="p-8 bg-white rounded-lg">
          <Skeleton active />
        </div>
      </Container>
    );
  }

  const orderItemsColumns: TableProps<any>["columns"] = [
    {
      title: "Product",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: any) => (
        <div className="flex items-center space-x-4">
          <img
            src={record.thumbnail}
            alt={text}
            className="object-cover w-16 h-16 rounded-lg sm:w-24 sm:h-24"
          />
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">Code: {record.code}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      align: "center" as const,
      render: (quantity: number) => (
        <Tag color="blue" className="text-sm font-medium">
          {quantity}
        </Tag>
      ),
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      align: "right" as const,
      render: (text: number) => (
        <div className="font-medium">{formatPrice(text)}</div>
      ),
    },
    {
      title: "Total",
      key: "total",
      align: "right" as const,
      render: (record: any) => (
        <div className="font-medium text-indigo-600">
          {formatPrice(record.price * record.quantity)}
        </div>
      ),
    },
  ];

  const orderStatusSteps = [
    { status: "pending", title: "Pending" },
    { status: "processing", title: "Processing" },
    { status: "shipped", title: "Shipped" },
    { status: "delivered", title: "Delivered" },
    { status: "cancelled", title: "Cancelled" },
    { status: "returned", title: "Returned" },
  ];

  const OrderStatus = ({ currentStatus }: { currentStatus: string }) => {
    const currentStepIndex = orderStatusSteps.findIndex(
      (step) => step.status === currentStatus,
    );

    return (
      <div className="mb-8">
        <Title level={5} className="mb-4">
          Order Status
        </Title>
        <Steps current={currentStepIndex} className="mb-6">
          {orderStatusSteps.map((step) => (
            <Steps.Step key={step.status} title={step.title} />
          ))}
        </Steps>
      </div>
    );
  };

  return (
    <Container
      pages={pages}
      pageTitle={`Order Details: ${order?._id}`}
      pageHeadingHref="/dashboard/orders/manage"
      pageHeadingButtonText="Manage Orders"
    >
      <div className="space-y-6">
        {/* Order Status Section */}
        <Card className="bg-white">
          <OrderStatus currentStatus={order?.status as string} />
        </Card>

        {/* Order Information Section */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card title="Order Information" className="bg-white">
            <Descriptions column={1}>
              <Descriptions.Item label="Order ID">
                <Tooltip title="Click to copy">
                  <span
                    className="flex gap-2 items-center cursor-pointer hover:text-blue-500"
                    onClick={() => {
                      navigator.clipboard.writeText(order?._id as string);
                      toast.success("Order ID copied to clipboard");
                    }}
                  >
                    {order?._id}
                    <CopyOutlined className="text-sm" />
                  </span>
                </Tooltip>
              </Descriptions.Item>
              <Descriptions.Item label="Order Date">
                {dayjs(order?.createdAt).format("MMMM D, YYYY h:mm A")}
              </Descriptions.Item>
              <Descriptions.Item label="Payment Method">
                <Tag color="green" icon={<CreditCardOutlined />}>
                  {order?.paymentMethod}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Checkout Type">
                <Tag color={order?.isGuestCheckout ? "orange" : "blue"}>
                  {order?.isGuestCheckout ? "Guest Checkout" : "User Checkout"}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>

          <Card title="Customer Information" className="bg-white">
            <Descriptions column={1}>
              <Descriptions.Item label="Name">
                <div className="flex items-center">
                  <UserOutlined className="mr-2" />
                  {order?.name}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <div className="flex items-center">
                  <PhoneOutlined className="mr-2" />
                  {order?.phone}
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Shipping Address">
                <div>
                  <p className="mt-1 text-sm font-medium text-gray-800">
                    {[
                      order?.shippingAddress?.line1,
                      order?.shippingAddress?.line2,
                      order?.shippingAddress?.upazila,
                      order?.shippingAddress?.district,
                      order?.shippingAddress?.division,
                      order?.shippingAddress?.country,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </div>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </div>

        {/* Products Section */}
        <Card title="Order Items" className="bg-white">
          <Table
            bordered
            columns={orderItemsColumns}
            dataSource={order?.orderItems}
            pagination={false}
            rowKey={(record) => record._id}
            className="order-items-table"
          />
        </Card>

        {/* Order Summary Section */}
        <Card title="Order Summary" className="bg-white">
          <div className="ml-auto max-w-lg">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Text>Subtotal</Text>
                <Text strong>{formatPrice(order?.subTotal as number)}</Text>
              </div>
              <div className="flex justify-between items-center">
                <Text>Shipping Charge</Text>
                <Text strong>
                  {formatPrice(order?.shippingCharge as number)}
                </Text>
              </div>
              {order?.hasCoupon && (
                <div className="flex justify-between items-center">
                  <Text>Discount</Text>
                  <Text type="danger">
                    -{formatPrice(order?.discount as number)}
                  </Text>
                </div>
              )}
              <Divider />
              <div className="flex justify-between items-center">
                <Text strong>Total Amount</Text>
                <Text strong className="text-xl text-indigo-600">
                  {formatPrice(order?.total as number)}
                </Text>
              </div>
            </div>
          </div>
        </Card>

        {/* Invoice Download Section */}
        <Card className="bg-white">
          <div className="flex justify-end">
            <a
              href={`${process.env.REACT_APP_API_URL}/order/invoice/${order?._id}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Download Invoice
            </a>
          </div>
        </Card>
      </div>
    </Container>
  );
};

export default OrderDetails;
