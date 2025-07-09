import { ReactNode, useState } from "react";
import { Button, Popconfirm, Space, Badge, Tooltip } from "antd";
import { FaFileCsv } from "react-icons/fa";
import {
  useDeleteStockMutation,
  useGetAllStocksQuery,
} from "../../../redux/features/inventory/stock.api";
import { TQueryParam } from "../../../types";
import moment from "moment";
import AppTable from "../../../components/data-display/AppTable";
import { ProColumns } from "@ant-design/pro-components";
import { FaTrash } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { Link } from "react-router-dom";

export interface TStockData {
  startDate: Date;
  endDate: Date;
  reference: string;
  type: string;
  isFinalCalculation: boolean;
  counts: {
    no: number;
    description: string;
    expected: number;
    counted: number;
    difference: number;
    cost: number;
  }[];
  initialStockCSV: {
    url: string;
    publicId: string;
  };
  finalStockCSV: {
    url: string;
    publicId: string;
  };
}

const StockTable = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const { data, isLoading, isFetching, refetch } = useGetAllStocksQuery([
    ...params,
  ]);
  const [deleteStock, { isLoading: isDeleting }] = useDeleteStockMutation();

  const tableData = data?.data?.map((stock: any) => ({
    ...stock,
    key: stock._id,
  }));

  const metaData = data?.meta;

  const columns: ProColumns<TStockData>[] = [
    {
      title: "Date",
      key: "date",
      render: (item: any) =>
        `${moment(item.startDate).format("MMM Do YY")} - ${moment(
          item.endDate,
        ).format("MMM Do YY")}`,
      width: 200,
    },
    {
      title: "Reference",
      dataIndex: "reference",
      key: "reference",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (type: any) => {
        return (
          <Badge
            style={{ backgroundColor: type === "Full" ? "#f50" : "#87d068" }}
            count={type}
          />
        );
      },
    },
    {
      title: "Brand",
      dataIndex: "brands",
      key: "brands",
      render: (brand: any) => (
        <ul>
          {brand?.map((b: any) => (
            <li key={b._id}>{b.name}</li>
          ))}
        </ul>
      ),
    },
    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories: any) => (
        <>
          <ul>
            {categories?.map((category: any) => (
              <li key={category._id}>{category.name}</li>
            ))}
          </ul>
        </>
      ),
    },
    {
      title: "File",
      key: "initialStockCSV",
      render: (item: any) => (
        <Space>
          <Tooltip title="Download Initial Stock CSV">
            <a
              href={item?.initialStockCSV?.url}
              target="_blank"
              download
              rel="noopener noreferrer"
            >
              <FaFileCsv size={20} />
            </a>
          </Tooltip>
          {item?.finalStockCSV && (
            <Tooltip title="Download Final Stock CSV">
              <a
                href={item?.finalStockCSV?.url}
                target="_blank"
                download
                rel="noopener noreferrer"
              >
                <FaFileCsv size={20} />
              </a>
            </Tooltip>
          )}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_dom: ReactNode, item: any) => (
        <Space>
          {item.isFinalCalculation ? (
            <Link
              to={`/dashboard/inventory/manage-stock/view-count/${item._id}`}
            >
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>
          ) : (
            <Link
              to={`/dashboard/inventory/manage-stock/finalize-count/${item._id}`}
            >
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Finalize
              </Button>
            </Link>
          )}

          <Popconfirm
            title="Are you sure to delete this adjustment?"
            onConfirm={() => deleteStock(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              id={`delete-${item._id}`}
              type="dashed"
              size="small"
              danger
              icon={<FaTrash />}
              disabled={isDeleting}
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
      <h2 className="text-xl font-semibold">Stocks</h2>
      <AppTable<TStockData>
        columns={columns}
        dataSource={tableData as any}
        title="Stocks"
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

export default StockTable;
