import { ProColumns } from "@ant-design/pro-components";
import {
  Button,
  Image,
  Popconfirm,
  Space,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { FaCopy, FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { formatPrice } from "../../libs";
import { useCreateProductMutation } from "../../redux/features/product/product.api";
import { IProduct } from "../../types";
import AppTable from "./AppTable";

interface ProductTableProps {
  data: IProduct[];
  loading: boolean;
  refetch: () => void;
  totalData: number;
  onPageChange: (page: number, pageSize: number) => void;
  onSearch: (value: string) => void;
  onCreateClick?: () => void;
  titleText?: string;
  onDelete?: (id: string) => Promise<void>;
  showUpdate?: boolean;
  showDelete?: boolean;
  deleteText?: string;
  showVariants?: boolean;
  showDuplicate?: boolean;
  page?: number;
  pageSize?: number;
}

const { Text } = Typography;

const ProductTable: React.FC<ProductTableProps> = ({
  data,
  loading,
  refetch,
  totalData,
  onPageChange,
  onSearch,
  onCreateClick,
  onDelete,
  deleteText,
  showUpdate = false,
  showDelete = false,
  titleText,
  showVariants = true,
  showDuplicate = false,
  page = 1,
  pageSize = 10,
}) => {
  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      if (onDelete) {
        await onDelete(id);
      }
      toast.success("Product deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };
  const navigate = useNavigate();
  const [createProduct] = useCreateProductMutation();
  const handleEdit = (id: string) => {
    navigate(`/dashboard/products/manage/update/${id}`, {
      state: { folderId: id },
    });
  };

  const handleDuplicate = (data: any) => {
    const toastId = toast.loading("Duplicating");

    // Extract only the IDs from nested objects and clean up the data
    const cleanedData = {
      ...data,
      // Convert nested objects to their ID strings
      mainCategory:
        data.mainCategory?.id || data.mainCategory?._id || data.mainCategory,
      category: data.category?.id || data.category?._id || data.category,
      subCategory:
        data.subCategory?.id || data.subCategory?._id || data.subCategory,

      name: `${data.name} (Copy)`,
      code: `${data.code} (Copy)`,

      // Remove fields that shouldn't be duplicated
      _id: undefined,
      id: undefined,
      createdAt: undefined,
      updatedAt: undefined,

      // Reset counters
      total_sale: 0,
      rating: 0,
      total_reviews: 0,
      reviews: [],
    };

    createProduct(cleanedData)
      .unwrap()
      .then((res) => {
        if (res.success) {
          toast.success("Product duplicated successfully", {
            id: toastId,
            duration: 2000,
          });
          refetch();
        }
      })
      .catch((err) => {
        console.error("Duplication error:", err);
        toast.error("Something went wrong", {
          id: toastId,
          duration: 2000,
        });
      });
  };

  // Render variants and their quantities
  const renderVariants = (record: IProduct) => {
    if (
      !record.hasVariants ||
      !record.variants ||
      record.variants.length === 0
    ) {
      return <Text type="secondary">No variants</Text>;
    }

    return (
      <div>
        {record.variants.map((variant, idx) => (
          <div key={idx} style={{ marginBottom: 8 }}>
            <Text strong>{variant.name}: </Text>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "4px",
                marginTop: 4,
              }}
            >
              {variant.values.map((value: any, vidx) => (
                <Tooltip
                  key={vidx}
                  title={`${value.name}: ${value.quantity} in stock`}
                  placement="top"
                >
                  <Tag color={value.quantity > 0 ? "green" : "red"}>
                    {value.name}: {value.quantity}
                  </Tag>
                </Tooltip>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const columns = [
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
      title: "Image",
      dataIndex: "thumbnail",
      key: "thumbnail",
      align: "center",
      width: 80,
      render: (thumbnail: string) => (
        <Image
          src={thumbnail}
          alt="Product Thumbnail"
          width={80}
          height={80}
          className="object-cover w-full h-full rounded-lg"
          preview={true}
          style={{ aspectRatio: "1/1" }}
          loading="lazy" // Use lazy loading
        />
      ),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <span>{code}</span>, // Product code
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: IProduct, b: IProduct) => a.name.localeCompare(b.name),
      render: (name: string, record: IProduct) => (
        <Link to={`/dashboard/products/manage/${record._id}`}>{name}</Link>
      ),
    },
    {
      title: "Main Category",
      dataIndex: ["mainCategory", "name"],
      key: "mainCategory",
      render: (mainCategory: string) => <span>{mainCategory || "N/A"}</span>, // Main category name
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
      render: (category: string) => <span>{category || "N/A"}</span>, // Category name
    },
    {
      title: "Cost",
      dataIndex: "productCost",
      key: "productCost",
      render: (productCost: number) => <span>{formatPrice(productCost)}</span>, // Product cost
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => <span>{formatPrice(price)}</span>, // Product price
    },
    {
      title: "Total Quantity",
      dataIndex: "quantity",
      key: "quantity",
      sorter: (a: IProduct, b: IProduct) => a.quantity - b.quantity,
      render: (quantity: number) => (
        <span
          style={{ color: quantity > 0 ? "green" : "red", fontWeight: "bold" }}
        >
          {quantity || 0}
        </span>
      ), // Stock quantity
    },
    ...(showVariants
      ? [
          {
            title: "Variants & Stock",
            key: "variants",
            width: 250,
            render: (record: IProduct) => renderVariants(record),
          },
        ]
      : []),
    {
      title: "Status",
      key: "status",
      width: 120,
      render: (record: IProduct) => (
        <Space>
          {record.is_available ? (
            <Tag color="green">Available</Tag>
          ) : (
            <Tag color="red">Unavailable</Tag>
          )}
          {record.is_featured && <Tag color="blue">Featured</Tag>}
          {record.is_stockout && <Tag color="red">Out of Stock</Tag>}
        </Space>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      render: (_: any, record: IProduct) => (
        <Space>
          <Link to={`/dashboard/products/manage/${record._id}`}>
            <Button type="dashed" size="small" icon={<IoDocuments />}>
              Details
            </Button>
          </Link>
          {showUpdate && (
            <Button
              type="dashed"
              size="small"
              icon={<FaEdit />}
              onClick={() => handleEdit(record._id)}
            >
              Edit
            </Button>
          )}
          {showDelete && (
            <Popconfirm
              title={`Are you sure you want to ${
                deleteText || "delete"
              } this product?`}
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" size="small" danger icon={<FaTrash />}>
                {deleteText || "Delete"}
              </Button>
            </Popconfirm>
          )}
          {showDuplicate && (
            <Button
              type="dashed"
              size="small"
              onClick={() => handleDuplicate(record)}
              icon={<FaCopy />}
            >
              Duplicate
            </Button>
          )}
        </Space>
      ), // Action buttons
    },
  ];

  return (
    <AppTable<IProduct>
      columns={columns as ProColumns<IProduct>[]}
      dataSource={data}
      title={titleText || ""}
      refetch={refetch}
      loading={loading}
      totalData={totalData}
      onPageChange={onPageChange}
      onSearch={onSearch}
      onCreateClick={onCreateClick}
    />
  );
};

export default ProductTable;
