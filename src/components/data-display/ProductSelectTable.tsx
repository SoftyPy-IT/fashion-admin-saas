import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Avatar, Button } from "antd";
import React, { useEffect, useState } from "react";
import { formatPrice } from "../../libs";
import { IProduct } from "../../types";
import ErrorMessage from "../ErrorMessage";

interface ProductSelectTableProps {
  data: IProduct[];
  total: number;
  onSelect: (selectedProducts: string[]) => void;
  loading: boolean;
  error?: any;
  refetch: () => void;
  onSearch: (searchTerm: string) => void;
  onPageChange: (page: number, pageSize: number) => void;
  onUpdateClick?: (id: string) => void;
  showUpdateButton?: boolean;
  defaultSelected?: string[]; // Add defaultSelected prop
  page?: number; // Current page number
  pageSize?: number; // Number of items per page
}

const ProductSelectTable: React.FC<ProductSelectTableProps> = ({
  data,
  total,
  onSelect,
  loading,
  error,
  refetch,
  onSearch,
  onPageChange,

  defaultSelected = [],
  page = 1, // Default to page 1
  pageSize = 10, // Default to 10 items per page
}) => {
  const [selectedProducts, setSelectedProducts] =
    useState<string[]>(defaultSelected);

  const columns: ProColumns<IProduct>[] = [
    {
      title: "S.N.",
      key: "sn",
      width: 50,
      align: "center",
      render: (_: any, __: any, index: number) => {
        return <span>{(page - 1) * pageSize + index + 1}</span>;
      },
    },
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      width: "1%",
      render: (thumbnail) => (
        <Avatar src={thumbnail} shape="square" size={64} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code) => <span>{code}</span>,
    },

    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => <span>{formatPrice(price as number)}</span>,
      sorter: (a, b) => a.price - b.price,
    },

    {
      title: "Discount Price",
      dataIndex: "discount_price",
      key: "discount_price",
      render: (discount_price) =>
        discount_price && Number(discount_price) > 0 ? (
          <span>{formatPrice(discount_price as number)}</span>
        ) : (
          <span>N/A</span>
        ),
    },
    {
      title: "Product Cost",
      dataIndex: "productCost",
      key: "productCost",
    },
  ];

  useEffect(() => {
    onSelect(selectedProducts);
  }, [selectedProducts, onSelect]);

  return (
    <div>
      {error && <ErrorMessage errorMessage={error.message} />}

      <ProTable<IProduct>
        columns={columns}
        dataSource={data || []}
        cardBordered
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedProducts,
          onChange: (selectedRowKeys) => {
            setSelectedProducts(selectedRowKeys as string[]);
          },
        }}
        bordered
        rowKey="key"
        dateFormatter="string"
        toolbar={{
          search: {
            onSearch: (value) => onSearch(value),
          },
        }}
        options={{
          setting: { listsHeight: 400 },
          fullScreen: true,
          reload: refetch,
        }}
        search={false}
        pagination={{
          showTotal: (total) => `Total ${total} items`,
          pageSize: 10,
          size: "default",
          total: total,
          itemRender(_page, type, element) {
            if (type === "prev") {
              return <Button>Previous</Button>;
            }
            if (type === "next") {
              return <Button>Next</Button>;
            }
            return element;
          },
          onChange: (page, pageSize) => onPageChange(page, pageSize),
        }}
      />
    </div>
  );
};

export default ProductSelectTable;
