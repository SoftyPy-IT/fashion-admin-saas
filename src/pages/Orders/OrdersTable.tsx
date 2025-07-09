import { ReactNode, useState } from "react";
import {
  Avatar,
  Button,
  Popconfirm,
  Space,
  Badge,
  Dropdown,
  Tooltip,
} from "antd";
import type { MenuProps } from "antd";
import {
  FaTrash,
  FaClock,
  FaSpinner,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaUndo,
  FaRegFilePdf,
} from "react-icons/fa";
import { toast } from "sonner";
import { TOrderData, TQueryParam } from "../../types";
import {
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useUpdateOrderMutation,
} from "../../redux/features/orders/orders.api";
import AppTable from "../../components/data-display/AppTable";
import { ProColumns } from "@ant-design/pro-components";
import moment from "moment";
import { Link } from "react-router-dom";
import { IoDocuments } from "react-icons/io5";
import { MenuInfo } from "rc-menu/lib/interface";
import { baseURL } from "../../redux/api/baseApi";
import { formatPrice } from "../../libs";

const OrdersTable = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);

  const {
    data: orderData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOrdersQuery([...params]);
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [updateOrderStatus, { isLoading: isUpdatingStatus }] =
    useUpdateOrderMutation();

  const tableData = orderData?.data?.map((order: TOrderData) => ({
    ...order,
    key: order._id,
  }));
  const metaData = orderData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteOrder(id).unwrap();
      toast.success("Order deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred while deleting order",
        { id: toastId, duration: 2000 },
      );
    }
  };

  const handleStatusUpdate = async (id: string, status: string) => {
    const toastId = toast.loading("Updating status");
    try {
      await updateOrderStatus({ id, status }).unwrap();
      toast.success(`Status updated to ${status}`, {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred while updating status",
        { id: toastId, duration: 2000 },
      );
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "#faad14"; // Yellow
      case "processing":
        return "#1890ff"; // Blue
      case "shipped":
        return "#13c2c2"; // Cyan
      case "delivered":
        return "#52c41a"; // Green
      case "cancelled":
        return "#f5222d"; // Red
      case "returned":
        return "#d46b08"; // Orange
      default:
        return "#d9d9d9"; // Grey
    }
  };

  const statusIcons: { [key: string]: JSX.Element } = {
    pending: <FaClock />,
    processing: <FaSpinner />,
    shipped: <FaTruck />,
    delivered: <FaCheckCircle />,
    cancelled: <FaTimesCircle />,
    returned: <FaUndo />,
  };

  const statusMenus = (id: string): MenuProps => ({
    items: [
      {
        label: "Pending",
        key: "pending",
        icon: statusIcons.pending,
      },
      {
        label: "Processing",
        key: "processing",
        icon: statusIcons.processing,
      },
      {
        label: "Shipped",
        key: "shipped",
        icon: statusIcons.shipped,
      },
      {
        label: "Delivered",
        key: "delivered",
        icon: statusIcons.delivered,
      },
      {
        label: "Cancelled",
        key: "cancelled",
        icon: statusIcons.cancelled,
        danger: true,
      },
      {
        label: "Returned",
        key: "returned",
        icon: statusIcons.returned,
        danger: true,
      },
    ],
    onClick: (e: MenuInfo) => handleStatusUpdate(id, e.key),
  });

  const columns: ProColumns<TOrderData>[] = [
    {
      title: "Order ID",
      dataIndex: "_id",
      key: "_id",
      width: 120,
      render: (_dom: ReactNode, record: TOrderData) => (
        <Tooltip title="Click to copy">
          <span
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
              navigator.clipboard.writeText(record._id);
              toast.success("Order ID copied to clipboard");
            }}
          >
            {record._id.slice(0, 8)}...
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Customer",
      dataIndex: "customer",
      key: "customer",
      width: 200,
      render: (_dom: ReactNode, record: TOrderData) => (
        <Space direction="vertical" size={0}>
          <div className="font-medium">{record?.name}</div>
          <div className="text-sm text-gray-500">{record?.email}</div>
          <div className="text-sm text-gray-500">{record?.phone}</div>
        </Space>
      ),
    },
    {
      title: "Items",
      dataIndex: "orderItems",
      key: "orderItems",
      width: 300,
      render: (items: any) => {
        const firstItem = items[0];
        const remainingItemsCount = items.length - 1;
        const totalItems = items.reduce(
          (sum: number, item: any) => sum + item.quantity,
          0,
        );

        return (
          <Space direction="vertical" size={2}>
            <div className="flex items-center space-x-2">
              <Avatar src={firstItem.thumbnail} size="small" />
              <div>
                <div className="text-sm font-medium">{firstItem.name}</div>
                <div className="text-xs text-gray-500">
                  Code: {firstItem.code} | Qty: {firstItem.quantity}
                </div>
              </div>
            </div>
            {remainingItemsCount > 0 && (
              <Tooltip
                title={items
                  .slice(1)
                  .map((item: any) => `${item.name} (Qty: ${item.quantity})`)
                  .join("\n")}
              >
                <div className="text-xs text-gray-500">
                  +{remainingItemsCount} more item
                  {remainingItemsCount > 1 ? "s" : ""} | Total Items:{" "}
                  {totalItems}
                </div>
              </Tooltip>
            )}
          </Space>
        );
      },
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (_dom: ReactNode, record: TOrderData) => (
        <Space direction="vertical" size={2}>
          <Badge
            className="capitalize"
            count={record.status}
            style={{ backgroundColor: getStatusBadgeColor(record.status) }}
          />
          <div className="text-xs text-gray-500">
            Last updated: {moment().fromNow()}
          </div>
        </Space>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      width: 120,
      render: (_dom: ReactNode, record: TOrderData) => (
        <div className="font-medium">{formatPrice(record.total)}</div>
      ),
    },
    {
      title: "Date & Time",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (_dom: ReactNode, record: TOrderData) => (
        <Space direction="vertical" size={0}>
          <div>{moment(record.createdAt).format("DD/MM/YYYY")}</div>
          <div className="text-xs text-gray-500">
            {moment(record.createdAt).format("hh:mm A")}
          </div>
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      fixed: "right",
      render: (_dom: ReactNode, item: TOrderData) => (
        <Space size="small">
          <Dropdown.Button
            key={item._id}
            menu={statusMenus(item._id)}
            trigger={["click"]}
            size="small"
            type="primary"
            disabled={isUpdatingStatus}
          >
            <div className="flex items-center space-x-1 capitalize">
              <span className="flex items-center">
                {statusIcons[item.status.toLowerCase()]}
              </span>
              <span className="flex items-center text-xs">{item.status}</span>
            </div>
          </Dropdown.Button>

          <Tooltip title="View Invoice">
            <Button type="dashed" size="small" icon={<FaRegFilePdf />}>
              <a
                href={`${baseURL}/order/invoice/${item._id}`}
                target="_blank"
                rel="noreferrer"
              >
                Invoice
              </a>
            </Button>
          </Tooltip>

          <Tooltip title="View Details">
            <Link to={`/dashboard/orders/manage/${item?._id}`}>
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>
          </Tooltip>

          <Popconfirm
            placement="left"
            title="Are you sure you want to delete this order?"
            onConfirm={() => handleDelete(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete Order">
              <Button
                type="dashed"
                size="small"
                danger
                icon={<FaTrash />}
                disabled={isDeleting}
                loading={isDeleting}
              >
                Delete
              </Button>
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <h2 className="text-xl font-semibold">Orders</h2>
      <AppTable<TOrderData>
        columns={columns}
        dataSource={tableData as any}
        title="Orders"
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

export default OrdersTable;
