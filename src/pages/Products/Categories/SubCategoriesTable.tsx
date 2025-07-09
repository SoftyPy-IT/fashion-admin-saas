import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteSubCategoryMutation,
  useGetAllSubCategoriesQuery,
} from "../../../redux/features/product/category.api";
import { TQueryParam } from "../../../types";
import SubCategoryDrawer from "./SubCategoryDrawer";

export type TTableData = {
  _id: string;
  name: {
    localeCompare(name: { type: String; required: true }): number;
    type: String;
    required: true;
  };
  slug: { type: String; required: true; unique: true };
  category: string;
};

const SubCategoriesTable = () => {
  const [subCategoryModal, setSubCategoryModal] = useState(false);
  const [subCategoryInitialValues, setSubCategoryInitialValues] =
    useState<any>(null);
  const [needToUpdateSubCategory, setNeedToUpdateSubCategory] = useState(false);

  const [deleteCategory] = useDeleteSubCategoryMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: categoryData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllSubCategoriesQuery([
    { name: "sort", value: "serial" },
    ...params,
  ]);

  const tableData = categoryData?.data;
  const metaData = categoryData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteCategory(id).unwrap();
      toast.success("Subcategory deleted successfully", {
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

  const columns: ProColumns<TTableData>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },

    // {
    //   title: "Category",
    //   dataIndex: "category",
    //   key: "category",
    //   render: (category: any) => category?.name || "N/A",
    // },

    {
      title: "Action",
      key: "action",
      render: (_dom: React.ReactNode, entity: TTableData) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            icon={<FaEdit />}
            onClick={() => {
              setSubCategoryInitialValues(entity);
              setSubCategoryModal(true);
              setNeedToUpdateSubCategory(true);
            }}
          >
            Update
          </Button>
          <Popconfirm
            placement="left"
            title="Are you sure you want to delete this subcategory?"
            onConfirm={() => handleDelete(entity._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" size="small" danger icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "1%",
    },
  ];

  return (
    <>
      <h2 className="mt-6 text-xl font-semibold">Subcategories</h2>
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Subcategories"
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
        onCreateClick={() => {
          setSubCategoryInitialValues(null);
          setNeedToUpdateSubCategory(false);
          setSubCategoryModal(true);
        }}
      />

      {subCategoryModal && (
        <SubCategoryDrawer
          open={subCategoryModal}
          onClose={() => setSubCategoryModal(false)}
          initialValues={subCategoryInitialValues}
          needToUpdate={needToUpdateSubCategory}
        />
      )}
    </>
  );
};

export default SubCategoriesTable;
