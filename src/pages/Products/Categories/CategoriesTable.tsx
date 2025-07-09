import {
  Button,
  Input,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  Typography,
} from "antd";
import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaEdit,
  FaSearch,
  FaTrash,
} from "react-icons/fa";
import { toast } from "sonner";
import {
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../redux/features/product/category.api";
import CategoryDrawer from "./CategoryDrawer";

const { Title, Text } = Typography;

export type TTableData = {
  _id: string;
  name: string;
  slug: string;
  isActive: boolean;
  mainCategory: {
    _id: string;
    name: string;
    slug: string;
  };
  subCategories?: Array<{
    subCategory: {
      _id: string;
      name: string;
      slug: string;
    };
    serial: number;
    _id: string;
  }>;
};

const CategoriesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>(
    {},
  );

  // API hooks
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory, { isLoading: isLoadingUpdate }] =
    useUpdateCategoryMutation();
  const {
    data: categoryData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCategoriesQuery([]);

  // Process raw data into structured format for the table
  const processedData = useMemo(() => {
    if (!categoryData?.data) return [];

    const processed: any[] = [];
    const mainCategories = Object.keys(categoryData.data);

    mainCategories.forEach((mainCategoryKey) => {
      const categoriesInThisMainCategory =
        (categoryData.data as unknown as Record<string, any[]>)[
          mainCategoryKey
        ] || [];

      if (
        Array.isArray(categoriesInThisMainCategory) &&
        categoriesInThisMainCategory.length > 0
      ) {
        categoriesInThisMainCategory.forEach((category: any, index: number) => {
          processed.push({
            ...category,
            isFirstRow: index === 0,
            mainCategoryRowSpan:
              index === 0 ? categoriesInThisMainCategory.length : 0,
            // Use the main category name from the data when available, otherwise use the key
            mainCategoryName: category.mainCategory?.name || mainCategoryKey,
          });
        });
      }
    });

    return processed;
  }, [categoryData]);

  // Initialize expanded state when data changes
  useEffect(() => {
    if (categoryData?.data) {
      const mainCategories = Object.keys(categoryData.data);
      const initialExpandedState: Record<string, boolean> = {};
      mainCategories.forEach((mainCat) => {
        initialExpandedState[mainCat] = true; // Default to expanded
      });
      setExpandedGroups(initialExpandedState);
    }
  }, [categoryData]);

  // Filter data based on search text
  const filteredData = useMemo(() => {
    if (searchText.trim() === "") {
      return processedData;
    }

    const lowerSearch = searchText.toLowerCase();

    // First, identify which categories match the search
    const matchingCategories = processedData.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerSearch) ||
        item.slug?.toLowerCase().includes(lowerSearch) ||
        item.mainCategoryName.toLowerCase().includes(lowerSearch) ||
        item.subCategories?.some((subCat: any) =>
          subCat.subCategory?.name.toLowerCase().includes(lowerSearch),
        ),
    );

    // Group by main category to recalculate row spans
    const mainCategoryGroups: Record<string, any[]> = {};

    matchingCategories.forEach((category) => {
      const mainCatName = category.mainCategoryName;
      if (!mainCategoryGroups[mainCatName]) {
        mainCategoryGroups[mainCatName] = [];
      }
      mainCategoryGroups[mainCatName].push({
        ...category,
        mainCategoryRowSpan: 0, // Reset for recalculation
      });
    });

    // Recalculate row spans and create the filtered data array
    const finalFilteredData: any[] = [];

    Object.keys(mainCategoryGroups).forEach((mainCatName) => {
      const categories = mainCategoryGroups[mainCatName];

      categories.forEach((category, index) => {
        finalFilteredData.push({
          ...category,
          isFirstRow: index === 0,
          mainCategoryRowSpan: index === 0 ? categories.length : 0,
        });
      });
    });

    return finalFilteredData;
  }, [searchText, processedData]);

  // Group data by main category
  const groupedData = useMemo(() => {
    return filteredData.reduce((acc: Record<string, any[]>, item) => {
      const mainCat = item.mainCategoryName;
      if (!acc[mainCat]) {
        acc[mainCat] = [];
      }
      acc[mainCat].push(item);
      return acc;
    }, {});
  }, [filteredData]);

  // Create a flattened array based on expanded state
  const tableData = useMemo(() => {
    return Object.entries(groupedData).flatMap(([mainCat, items]) => {
      // Always include the main category header
      const mainCatHeader = {
        _id: `header-${mainCat}`,
        isHeader: true,
        mainCategoryName: mainCat,
        name: "",
        itemCount: items.length,
        isExpanded: expandedGroups[mainCat] || false,
      };

      // Only include the items if the category is expanded
      return [mainCatHeader, ...(expandedGroups[mainCat] ? items : [])];
    });
  }, [groupedData, expandedGroups]);

  // Handler functions
  const handleDelete = useCallback(
    async (id: string) => {
      const toastId = toast.loading("Deleting");
      try {
        await deleteCategory(id).unwrap();
        toast.success("Category deleted successfully", {
          id: toastId,
          duration: 2000,
        });
        refetch();
      } catch (error: any) {
        toast.error(
          error.data?.message || "An error occurred while deleting category",
          { id: toastId, duration: 2000 },
        );
      }
    },
    [deleteCategory, refetch],
  );

  const handleStatusChange = useCallback(
    async (id: string, isActive: boolean) => {
      const toastId = toast.loading("Updating status");
      try {
        await updateCategory({
          id,
          data: {
            isActive: !isActive,
            isUpdateStatus: true,
          },
        }).unwrap();
        toast.success(
          `Category ${!isActive ? "activated" : "deactivated"} successfully`,
          { id: toastId, duration: 2000 },
        );
        refetch();
      } catch (error: any) {
        toast.error(
          error.data?.message || "An error occurred while updating status",
          { id: toastId, duration: 2000 },
        );
      }
    },
    [updateCategory, refetch],
  );

  const toggleMainCategoryExpand = useCallback((mainCategory: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [mainCategory]: !prev[mainCategory],
    }));
  }, []);

  const expandAll = useCallback(() => {
    const newExpandedState = Object.keys(expandedGroups).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedGroups(newExpandedState);
  }, [expandedGroups]);

  const collapseAll = useCallback(() => {
    const newExpandedState = Object.keys(expandedGroups).reduce((acc, key) => {
      acc[key] = false;
      return acc;
    }, {} as Record<string, boolean>);
    setExpandedGroups(newExpandedState);
  }, [expandedGroups]);

  const handleEditCategory = useCallback((record: any) => {
    setInitialValues(record);
    setModalVisible(true);
    setNeedToUpdate(true);
  }, []);

  const handleCreateNewCategory = useCallback(() => {
    setInitialValues(null);
    setNeedToUpdate(false);
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  // Table columns definition
  const columns = useMemo(
    () => [
      {
        title: "Main Category",
        dataIndex: "mainCategoryName",
        key: "mainCategoryName",
        render: (text: string, record: any) => {
          if (record.isHeader) {
            return (
              <div
                className="flex items-center cursor-pointer"
                onClick={() => toggleMainCategoryExpand(text)}
              >
                <span className="mr-2">
                  {record.isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                </span>
                <Text strong>{text}</Text>
                <span className="ml-2 text-gray-500">({record.itemCount})</span>
              </div>
            );
          }
          return <Text>{text}</Text>;
        },
        width: "15%",
      },
      {
        title: "Category Name",
        dataIndex: "name",
        key: "name",
        width: "30%",
        render: (text: string, record: any) => {
          if (record.isHeader) return null;

          return (
            <div className="flex flex-col">
              <Text strong className="text-base">
                {text || "N/A"}
              </Text>
              {record.subCategories?.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {record.subCategories.map((item: any) => (
                    <Tag key={item.subCategory?._id} color="blue">
                      {item.subCategory?.name || "N/A"}
                    </Tag>
                  ))}
                </div>
              )}
            </div>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "isActive",
        key: "isActive",
        width: "10%",
        render: (isActive: boolean, record: any) => {
          if (record.isHeader) return null;

          return (
            <div className="flex items-center">
              <Switch
                checked={isActive}
                onChange={() => handleStatusChange(record._id, isActive)}
                checkedChildren="Active"
                unCheckedChildren="Inactive"
                id={`status-switch-${record._id}`}
              />
              <span className="ml-2">
                {isActive ? (
                  <Tag color="success">Active</Tag>
                ) : (
                  <Tag color="error">Inactive</Tag>
                )}
              </span>
            </div>
          );
        },
      },
      {
        title: "Action",
        key: "action",
        width: "20%",
        render: (_: ReactNode, record: any) => {
          if (record.isHeader) return null;

          return (
            <Space>
              <Button
                type="primary"
                size="small"
                icon={<FaEdit />}
                onClick={() => handleEditCategory(record)}
              >
                Edit
              </Button>
              <Popconfirm
                placement="left"
                title="Are you sure you want to delete this category?"
                description="This action cannot be undone."
                onConfirm={() => handleDelete(record._id)}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ danger: true }}
              >
                <Button danger size="small" icon={<FaTrash />}>
                  Delete
                </Button>
              </Popconfirm>
            </Space>
          );
        },
      },
    ],
    [
      toggleMainCategoryExpand,
      handleStatusChange,
      handleEditCategory,
      handleDelete,
      isLoadingUpdate,
    ],
  );

  return (
    <div className="space-y-6">
      <div className="p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <Title level={4} className="m-0">
            Categories
          </Title>
          <Button type="primary" size="large" onClick={handleCreateNewCategory}>
            Create New Category
          </Button>
        </div>

        <div className="flex items-center justify-between mb-6">
          <Input
            placeholder="Search categories by name, slug, or main category..."
            prefix={<FaSearch className="text-gray-400" />}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            className="max-w-lg"
            allowClear
          />
          <div>
            <Button type="default" onClick={expandAll} className="mr-2">
              Expand All
            </Button>
            <Button type="default" onClick={collapseAll}>
              Collapse All
            </Button>
          </div>
        </div>

        <div className="overflow-hidden border border-gray-200 rounded-md">
          <Table
            columns={columns}
            dataSource={tableData}
            rowKey="_id"
            loading={isLoading || isFetching}
            bordered
            pagination={false}
            className="categories-table"
            rowClassName={(record) =>
              `${record.isHeader ? "bg-gray-100" : "hover:bg-gray-50"} ${
                record.isHeader ? "cursor-pointer" : ""
              }`
            }
            locale={{ emptyText: "No categories found" }}
            scroll={{ y: 500, x: 800 }}
          />
        </div>
      </div>

      {modalVisible && (
        <CategoryDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={handleCloseModal}
          needToUpdate={needToUpdate}
          isLoadingCategories={isLoading || isFetching}
        />
      )}
    </div>
  );
};

export default CategoriesTable;
