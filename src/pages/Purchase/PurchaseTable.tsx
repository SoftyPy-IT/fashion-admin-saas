import { ReactNode, useState } from "react";
import { Button, Popconfirm, Space } from "antd";
import { FaFilePdf, FaImage, FaRegFilePdf, FaTrash } from "react-icons/fa";
import moment, { MomentInput } from "moment";
import { ProColumns } from "@ant-design/pro-components";
import { IoDocuments } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  useDeletePurchaseMutation,
  useGetAllPurchasesQuery,
} from "../../redux/features/purchase/purchase.api";
import { TQueryParam } from "../../types";
import { baseURL } from "../../redux/api/baseApi";
import AppTable from "../../components/data-display/AppTable";

export interface TPurchaseData {
  date: Date;
  reference: string;
  attachDocument?: {
    url: string;
    publicId: string;
  };
  items: {
    product_id: string;
    product_name: string;
    product_code: string;
    quantity: number;
    unit_price: number;
    discount: number;
    tax: number;
    sub_total: number;
  }[];
  note: string;
}

const PurchaseTable = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllPurchasesQuery([
    ...params,
  ]);
  const [handleDelete, { isLoading: isDeleting }] = useDeletePurchaseMutation();

  const tableData = data?.data?.map((purchase: any) => ({
    ...purchase,
    key: purchase._id,
  }));

  const metaData = data?.meta;

  const getAttachmentIcon = (attachmentUrl: string) => {
    const extension = attachmentUrl.split(".").pop();
    if (extension === "pdf") {
      return <FaFilePdf size={20} />;
    }
    return <FaImage size={20} />;
  };

  const columns: ProColumns<TPurchaseData>[] = [
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
      title: "Products",
      dataIndex: "items",
      key: "items",
      render: (items: any) => (
        <Space direction="vertical">
          {items.map(
            (item: {
              product_id: string;
              product_name: string;
              product_code: string;
              quantity: number;
              unit_price: number;
              discount: number;
              tax: number;
              sub_total: number;
            }) => (
              <div
                key={item.product_id}
                className="flex items-center space-x-2"
              >
                <div>
                  <div className="font-medium">{item.product_name}</div>
                  <div className="text-gray-500">
                    Code: {item.product_code}, Quantity: {item.quantity}, Unit
                    Price: ${item.unit_price}
                  </div>
                  <div className="text-gray-500">
                    Discount: ${item.discount}, Tax: ${item.tax}
                  </div>
                  <div className="text-gray-500">
                    Subtotal: ${item.sub_total.toFixed(2)}
                  </div>
                </div>
              </div>
            )
          )}
        </Space>
      ),
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
          <Link to={`/dashboard/purchases/manage/${item._id}`}>
            <Button type="dashed" size="small" icon={<IoDocuments />}>
              Details
            </Button>
          </Link>
          <Button type="dashed" size="small" icon={<FaRegFilePdf />}>
            <a
              href={`${baseURL}/purchase/pdf/${item._id}`}
              target="_blank"
              rel="noreferrer"
            >
              PDF
            </a>
          </Button>
          <Popconfirm
            title="Are you sure to delete this purchase?"
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
      <h2 className="text-xl font-semibold">Purchases</h2>
      <AppTable<TPurchaseData>
        columns={columns}
        dataSource={tableData as any}
        title="Purchases"
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

export default PurchaseTable;
