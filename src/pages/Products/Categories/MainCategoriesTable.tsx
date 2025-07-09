import { ProColumns } from "@ant-design/pro-components";
import { Avatar, Button, Popconfirm, Space, Tag, Table } from "antd";
import { ReactNode, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";

import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteMainCategoryMutation,
  useGetAllMainCategoriesQuery,
} from "../../../redux/features/product/category.api";
import { TQueryParam } from "../../../types";
import OrderDrawer, { ModelType } from "./SerializedDrawer";
import MainCategoryDrawer from "./MainCategoryDraweer";

export type TTableData = {
  _id: string;
  name: string;
  image: string;
  slug: string;
  categories: Array<{
    category: {
      _id: string;
      name: string;
      subCategories: Array<{
        subCategory: {
          _id: string;
          name: string;
        };
        serial: number;
      }>;
    };
  }>;
};

const MainCategoriesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteCategory] = useDeleteMainCategoryMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [openDrawer, setOpenDrawer] = useState(false);

  const {
    data: categoryData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllMainCategoriesQuery([...params]);

  const tableData = categoryData?.data;
  const metaData = categoryData?.meta;

  const handleDelete = async (id: string) => {
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
        error.data?.message || "An error occurred while deleting subcategory",
        { id: toastId, duration: 2000 },
      );
    }
  };

  const expandedRowRender = (record: TTableData) => {
    const subcategoryColumns = [
      {
        title: "SL",
        key: "serial",
        render: (_text: any, _record: any, index: number) => index + 1,
      },
      {
        title: "Name",
        dataIndex: ["category", "name"],
        key: "name",
      },
    ];

    return (
      <div className="">
        <Table
          style={{
            borderRadius: 0,
          }}
          bordered
          columns={subcategoryColumns}
          expandable={{
            expandedRowRender: (record) => (
              <div className="flex flex-wrap gap-1 p-4 bg-purple-light">
                {record.category.subCategories.length ? (
                  record.category.subCategories.map((item) => (
                    <Tag key={item.subCategory._id} className="p-1 capitalize">
                      {item.subCategory.name}
                    </Tag>
                  ))
                ) : (
                  <Tag>No Subcategories</Tag>
                )}
              </div>
            ),
          }}
          dataSource={record.categories}
          pagination={false}
          rowKey={(record) => record.category._id}
          size="small"
          className="bg-gray-50"
        />
      </div>
    );
  };

  const columns: ProColumns<TTableData>[] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: "80px",
      render: (image) => (
        <Avatar
          src={image}
          alt="category"
          style={{ width: 50, height: 50 }}
          className="rounded"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Categories",
      dataIndex: "categories",
      key: "categories",
      render: (categories) => (
        <div className="flex flex-wrap gap-2">
          {Array.isArray(categories) && categories.length > 0 ? (
            <>
              <Tag color="blue" className="mb-1">
                {categories.length} Categories
              </Tag>
              <div className="flex flex-wrap gap-1">
                {categories.slice(0, 3).map((item, index) => (
                  <Tag key={index} className="mb-1">
                    {item.category?.name}
                  </Tag>
                ))}
                {categories.length > 3 && (
                  <Tag className="mb-1">+{categories.length - 3} more</Tag>
                )}
              </div>
            </>
          ) : (
            <Tag color="red">No Subcategories</Tag>
          )}
        </div>
      ),
    },

    {
      title: "Action",
      key: "action",
      width: "150px",
      render: (_dom: ReactNode, item: TTableData) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            icon={<FaEdit />}
            onClick={() => {
              setInitialValues({
                ...item,
                categories: item.categories.map((item: any) => item.category),
              });
              setModalVisible(true);
              setNeedToUpdate(true);
            }}
          >
            Update
          </Button>
          <Popconfirm
            placement="left"
            title="Are you sure you want to delete this category?"
            onConfirm={() => handleDelete(item._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" size="small" danger icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">
          Main Menu ({metaData?.total || 0})
        </h2>
      </div>

      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData as any}
        title="Items"
        refetch={refetch}
        loading={isLoading || isFetching}
        totalData={metaData?.total}
        expandable={{
          expandedRowRender,
        }}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            { name: "limit", value: pageSize.toString() },
          ]);
        }}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          setInitialValues(null);
          setNeedToUpdate(false);
          setModalVisible(true);
        }}
        actionTitle="Serialized"
        action={() => setOpenDrawer(true)}
      />

      {modalVisible && (
        <MainCategoryDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
          isLoadingCategories={isLoading || isFetching}
        />
      )}

      {openDrawer && (
        <OrderDrawer<any>
          open={openDrawer}
          onClose={() => setOpenDrawer(false)}
          title="Main Menu Order"
          data={categoryData?.data}
          refetch={refetch}
          modelType={ModelType.MainCategory}
        />
      )}
    </>
  );
};

export default MainCategoriesTable;
