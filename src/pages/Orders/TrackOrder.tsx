import { useEffect, useState } from "react";
import {
  useTrackOrderQuery,
  useUpdateOrderMutation,
} from "../../redux/features/orders/orders.api";
import Container from "../../ui/Container";
import { TOrderData } from "../../types";
import {
  Avatar,
  Divider,
  Empty,
  Input,
  Skeleton,
  Steps,
  Card,
  Tag,
  Typography,
  Alert,
  Button,
  Row,
  Col,
  Badge,
  Descriptions,
} from "antd";
import { formatPrice } from "../../libs";
import { toast } from "sonner";
import moment from "moment";
import {
  ShoppingOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RollbackOutlined,
  CarOutlined,
  DownOutlined,
  UpOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const TrackOrder = () => {
  const [orderId, setOrderId] = useState<string>("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [expandedOrders, setExpandedOrders] = useState<string[]>([]);

  const { data, isLoading, isFetching, refetch, error } = useTrackOrderQuery(
    submittedId as string,
    {
      skip: !submittedId,
    },
  );
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [updateOrderStatus] = useUpdateOrderMutation();

  const pages = [
    { name: "Home", href: "/", current: false },
    { name: "Track Order", href: "#", current: true },
  ];
  const orders = (Array.isArray(data) ? data : []) as TOrderData[];

  const handleSearch = () => {
    if (!orderId.trim()) {
      toast.error("Please enter an order ID");
      return;
    }
    setSubmittedId(orderId);
    refetch();
  };

  useEffect(() => {
    if (error) {
      setFetchError("No order found for the provided ID");
      setOrderId("");
      setSubmittedId(null);
    } else {
      setFetchError(null);
    }
  }, [error]);

  const orderStatusSteps = [
    {
      status: "pending",
      title: "Order Placed",
      icon: <ClockCircleOutlined />,
      description: "Your order has been received",
    },
    {
      status: "processing",
      title: "Processing",
      icon: <ShoppingOutlined />,
      description: "We're preparing your order",
    },
    {
      status: "shipped",
      title: "Shipped",
      icon: <CarOutlined />,
      description: "Your order is on the way",
    },
    {
      status: "delivered",
      title: "Delivered",
      icon: <CheckCircleOutlined />,
      description: "Order delivered successfully",
    },
    {
      status: "cancelled",
      title: "Cancelled",
      icon: <CloseCircleOutlined />,
      description: "Order has been cancelled",
    },
    {
      status: "returned",
      title: "Returned",
      icon: <RollbackOutlined />,
      description: "Order has been returned",
    },
  ];

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: "orange",
      processing: "blue",
      shipped: "cyan",
      delivered: "green",
      cancelled: "red",
      returned: "purple",
    };
    return statusMap[status] || "default";
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const toastId = toast.loading("Updating status");
    try {
      await updateOrderStatus({ id, status }).unwrap();
      toast.success(`Status updated to ${status}`, {
        id: toastId,
        duration: 2000,
      });
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred while updating status",
        { id: toastId, duration: 2000 },
      );
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId],
    );
  };

  const OrderCard = ({ order }: { order: TOrderData }) => {
    const isExpanded = expandedOrders.includes(order._id);
    const currentStepIndex = orderStatusSteps.findIndex(
      (step) => step.status === order.status,
    );

    const handleStepChange = async (current: number) => {
      const selectedStatus = orderStatusSteps[current].status;
      if (selectedStatus !== order.status) {
        await handleStatusUpdate(order._id, selectedStatus);
      }
    };

    return (
      <div className="mb-4">
        <Card>
          <Row gutter={[16, 16]} align="middle">
            <Col xs={24} sm={12} md={8}>
              <div className="flex gap-4 items-center">
                <ShoppingCartOutlined className="text-xl" />
                <div>
                  <Text strong>#{order._id.slice(-8)}</Text>
                  <Text type="secondary" className="block text-sm">
                    {moment(order.createdAt).format("MMM DD, YYYY • h:mm A")}
                  </Text>
                </div>
              </div>
            </Col>

            <Col xs={24} sm={12} md={8}>
              <div className="text-center">
                <Tag color={getStatusColor(order.status)}>{order.status}</Tag>
              </div>
            </Col>

            <Col xs={24} sm={24} md={8}>
              <div className="text-right">
                <Text strong className="text-lg">
                  {formatPrice(order.total)}
                </Text>
                <Text type="secondary" className="block">
                  {order.orderItems.length} items
                </Text>
              </div>
            </Col>
          </Row>

          <div className="mt-4">
            <Steps
              current={currentStepIndex}
              onChange={handleStepChange}
              items={orderStatusSteps
                .filter(
                  (step) =>
                    !["cancelled", "returned"].includes(step.status) ||
                    step.status === order.status,
                )
                .map((step) => ({
                  title: step.title,
                  description: step.description,
                  icon: step.icon,
                  status:
                    step.status === order.status
                      ? "process"
                      : currentStepIndex >
                        orderStatusSteps.findIndex(
                          (s) => s.status === step.status,
                        )
                      ? "finish"
                      : "wait",
                }))}
            />
          </div>

          <div className="mt-4 text-center">
            <Button
              type="link"
              icon={isExpanded ? <UpOutlined /> : <DownOutlined />}
              onClick={() => toggleOrderExpansion(order._id)}
            >
              {isExpanded ? "Hide Details" : "View Details"}
            </Button>
          </div>
        </Card>

        {isExpanded && (
          <Card className="mt-4">
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Title level={5}>Order Items</Title>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {order.orderItems.map((item, index) => (
                    <Card key={index} size="small">
                      <div className="flex gap-3 items-start">
                        <Avatar
                          src={item.thumbnail}
                          alt={item.name}
                          size={48}
                        />
                        <div className="flex-1">
                          <Text strong className="block">
                            {item.name}
                          </Text>
                          <div className="flex justify-between items-center mt-2">
                            <Badge count={item.quantity} />
                            <Text strong>{formatPrice(item.price)}</Text>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Shipping Address" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Name">
                      {order.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Phone">
                      {order.phone}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {order?.email}
                    </Descriptions.Item>

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
                  </Descriptions>
                </Card>
              </Col>

              <Col xs={24} lg={12}>
                <Card title="Order Summary" size="small">
                  <div className="ml-auto max-w-lg">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <Text>Subtotal</Text>
                        <Text strong>
                          {formatPrice(order?.subTotal as number)}
                        </Text>
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
              </Col>
            </Row>
          </Card>
        )}
      </div>
    );
  };

  return (
    <Container
      pages={pages}
      pageTitle="Track Order"
      pageHeadingHref="/dashboard/orders/manage"
      pageHeadingButtonText="Manage Orders"
    >
      <div className="w-full">
        <div className="mb-8">
          <div className="mx-auto max-w-2xl text-center">
            <Title level={2}>Track Your Order</Title>
            <Text className="block mb-6">
              Enter your order ID to track your order status
            </Text>
            <Input.Search
              placeholder="Enter your order ID"
              enterButton="Track Order"
              size="large"
              onSearch={handleSearch}
              onChange={(e) => setOrderId(e.target.value)}
              value={orderId}
              className="max-w-lg"
            />
          </div>
        </div>

        {isLoading || isFetching ? (
          <Card>
            <Skeleton active paragraph={{ rows: 4 }} />
          </Card>
        ) : fetchError ? (
          <div className="py-8 text-center">
            <Alert
              message="Order Not Found"
              description="We couldn't find any order with the provided ID. Please check your order ID and try again."
              type="error"
              showIcon
              className="mx-auto max-w-md"
            />
          </div>
        ) : orders.length > 0 ? (
          <div>
            {orders.length > 1 && (
              <Alert
                message={`Found ${orders.length} Orders`}
                description="Multiple orders found for the provided ID."
                type="info"
                showIcon
                className="mb-4"
              />
            )}
            {orders.map((order) => (
              <OrderCard key={order._id} order={order} />
            ))}
          </div>
        ) : (
          submittedId && (
            <div className="py-8 text-center">
              <Empty
                description="No orders found. Please check your order ID and try again."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            </div>
          )
        )}
      </div>
    </Container>
  );
};

export default TrackOrder;
