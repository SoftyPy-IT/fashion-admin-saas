import {
  DeleteOutlined,
  FileImageOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { ProColumns } from "@ant-design/pro-components";
import {
  Badge,
  Button,
  Divider,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment, { MomentInput } from "moment";
import { ReactNode, useState } from "react";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteAdjustmentMutation,
  useGetAllAdjustmentsQuery,
} from "../../../redux/features/inventory/quantity-adjustments.api";
import { TQueryParam } from "../../../types";

const { Text, Title } = Typography;

export interface TAdjustmentData {
  date: Date;
  referenceNo: string;
  attachDocument?: string;
  products: {
    productId: string;
    productName: string;
    productCode: string;
    type: "Subtraction" | "Addition";
    quantity: number;
    serialNumber?: string;
    variant?: { name: string; value: string };
  }[];
  note: string;
}

const AdjustmentsTable = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllAdjustmentsQuery([
    ...params,
  ]);
  const [handleDelete, { isLoading: isDeleting }] =
    useDeleteAdjustmentMutation();

  const tableData = data?.data?.map((adjustment: any) => ({
    ...adjustment,
    key: adjustment._id,
  }));

  const metaData = data?.meta;

  const getAttachmentIcon = (attachmentUrl: string) => {
    const extension = attachmentUrl.split(".").pop()?.toLowerCase();
    if (extension === "pdf") {
      return <FilePdfOutlined className="text-lg text-red-500" />;
    } else if (
      ["jpg", "jpeg", "png", "gif", "webp"].includes(extension || "")
    ) {
      return <FileImageOutlined className="text-lg text-blue-500" />;
    }
    return <FileTextOutlined className="text-lg text-gray-500" />;
  };

  const columns: ProColumns<TAdjustmentData>[] = [
    {
      title: (
        <div className="flex items-center">
          <span>Date</span>
          <Tooltip title="Date of inventory adjustment">
            <InfoCircleOutlined className="ml-1 text-gray-400" />
          </Tooltip>
        </div>
      ),
      dataIndex: "date",
      key: "date",
      width: 120,
      render: (date: any) => (
        <Tooltip
          title={moment(date as MomentInput).format("MMMM Do YYYY, h:mm:ss a")}
        >
          <Text>
            {moment(date as MomentInput).format("MMMM Do YYYY, h:mm a")}
          </Text>
        </Tooltip>
      ),
      sorter: (a: any, b: any) =>
        moment(a.date).valueOf() - moment(b.date).valueOf(),
    },
    {
      title: "Reference No",
      dataIndex: "referenceNo",
      key: "referenceNo",
      width: 150,
      render: (text: any) => (
        <Text copyable className="font-medium">
          {text}
        </Text>
      ),
    },
    {
      title: "Products",
      dataIndex: "products",
      key: "products",
      render: (products: any) => (
        <Space
          direction="vertical"
          size="small"
          split={<Divider className="my-1" />}
        >
          {products.map(
            (product: {
              productId: string;
              productName: string;
              productCode: string;
              type: "Subtraction" | "Addition";
              quantity: number;
              serialNumber?: string;
              variant?: { name: string; value: string };
            }) => (
              <div key={product.productId} className="flex items-start">
                <div className="mt-1 mr-2">
                  {product.type === "Addition" ? (
                    <Badge
                      count={<PlusOutlined style={{ color: "#52c41a" }} />}
                    />
                  ) : (
                    <Badge
                      count={<MinusOutlined style={{ color: "#ff4d4f" }} />}
                    />
                  )}
                </div>
                <div className="flex-1">
                  <Text strong className="text-blue-600">
                    {product.productName}
                  </Text>
                  <div className="flex items-center mt-1 text-xs">
                    <Tag
                      color={product.type === "Addition" ? "success" : "error"}
                      className="mr-2"
                    >
                      {product.quantity}{" "}
                      {product.type === "Addition" ? "added" : "removed"}
                    </Tag>
                    <Text type="secondary" className="mr-2">
                      Code: {product.productCode}
                    </Text>
                    {product.variant && (
                      <Tag color="blue">
                        {product.variant.name}: {product.variant.value}
                      </Tag>
                    )}
                    {product.serialNumber && (
                      <Text type="secondary" className="text-xs">
                        S/N: {product.serialNumber}
                      </Text>
                    )}
                  </div>
                </div>
              </div>
            ),
          )}
        </Space>
      ),
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      width: 200,
      ellipsis: true,
      render: (note: any) => (
        <Tooltip title={note} placement="topLeft">
          <Text type="secondary" className="text-sm">
            {note || "—"}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: "Attachment",
      key: "attachDocument",
      width: 100,
      align: "center",
      render: (item: any) =>
        item.attachDocument ? (
          <Tooltip title="View attachment">
            <a
              href={item.attachDocument}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-500"
            >
              {getAttachmentIcon(item.attachDocument)}
            </a>
          </Tooltip>
        ) : (
          <Text type="secondary" className="text-xs">
            No attachment
          </Text>
        ),
    },
    {
      title: "Action",
      key: "action",
      width: 100,
      align: "center",
      render: (_dom: ReactNode, item: any) => (
        <Popconfirm
          title="Delete this adjustment?"
          description="This action cannot be undone."
          onConfirm={() => handleDelete(item._id)}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            size="small"
            danger
            icon={<DeleteOutlined />}
            loading={isDeleting}
            className="hover:bg-red-50"
          >
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <Title level={4} className="mb-4">
        Inventory Adjustments
      </Title>
      <AppTable<TAdjustmentData>
        title="Adjustments"
        columns={columns}
        dataSource={tableData as any}
        loading={isLoading || isFetching}
        totalData={metaData?.total}
        refetch={refetch}
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
    </div>
  );
};

export default AdjustmentsTable;
