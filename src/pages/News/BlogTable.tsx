import { ProColumns } from "@ant-design/pro-components";
import { Avatar, Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import {
  useDeleteBlogMutation,
  useGetAllBlogQuery,
} from "../../redux/features/blog/blog.api";
import { TQueryParam } from "../../types";
import AppTable from "../../components/data-display/AppTable";
import { Link, useNavigate } from "react-router-dom";

export type TTableData = {
  key: string;
  title: string;
  category: string;
  thumbnail: string;
};

const BlogsTable = () => {
  const [deleteBlog] = useDeleteBlogMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);

  const {
    data: blogData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBlogQuery([...params]);

  const tableData: any = blogData?.data?.map(
    ({ _id, title, category, thumbnail }) => ({
      key: _id,
      title,
      category,
      thumbnail,
    }),
  );

  const metaData = blogData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteBlog(id).unwrap();
      toast.success("Blog deleted successfully", { id: toastId });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const columns: ProColumns<TTableData>[] = [
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
      title: "Title",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "Action",
      key: "action",
      render: (item: any) => (
        <Space>
          <Button type="dashed" size="small" icon={<FaEdit />}>
            <Link to={`/dashboard/blogs/manage/update/${item.key}`}>Edit</Link>
          </Button>

          <Popconfirm
            title="Are you sure you want to delete this blog?"
            onConfirm={() => handleDelete(item.key)}
            okText="Yes"
            cancelText="No"
            placement="left"
          >
            <Button danger type="dashed" size="small" icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "1%",
    },
  ];
  const navigate = useNavigate();

  return (
    <>
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Blogs"
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
          navigate("/dashboard/blogs/new");
        }}
      />
    </>
  );
};

export default BlogsTable;
