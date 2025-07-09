import { FormOutlined, PictureOutlined, SaveOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Divider, Space, Typography } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import GalleryModal from "../../components/data-display/gallery-modal/GalleryModal";
import Editor from "../../components/editor/inde";
import AppForm from "../../components/form/AppForm";
import AppInput from "../../components/form/AppInput";
import AppTextArea from "../../components/form/AppTextArea";
import {
  useCreateBlogMutation,
  useUpdateBlogMutation,
} from "../../redux/features/blog/blog.api";

const { Title } = Typography;

interface Props {
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const NewsForm = ({ initialValues = null, needToUpdate = false }: Props) => {
  const [thumbnailVisible, setThumbnailVisible] = React.useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = React.useState<
    string | null
  >(initialValues?.thumbnail || null);

  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const [createBlog, { isLoading: isLoadingCreate }] = useCreateBlogMutation();
  const [updateBlog, { isLoading: isLoadingUpdate }] = useUpdateBlogMutation();

  const isLoading = isLoadingCreate || isLoadingUpdate;

  const onSubmit = async (data: any) => {
    const toastId = toast.loading(
      `${needToUpdate ? "Updating" : "Creating"} blog...`,
    );
    const finalData = { ...data, thumbnail: selectedThumbnail };

    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateBlog({
          ...finalData,
          _id: initialValues._id,
        }).unwrap();
      } else {
        res = await createBlog(finalData).unwrap();
      }

      if (res.success) {
        toast.success(res.message, { id: toastId });
        setError(null);
      }
      navigate("/dashboard/blogs/manage");
    } catch (err: any) {
      setError(
        err?.data?.errorSources?.map((e: any) => e.message).join(", ") ||
          "Something went wrong",
      );
      toast.error("Something went wrong", { id: toastId });
    }
  };

  return (
    <>
      <Card
        className="w-full rounded-lg shadow-md"
        title={
          <div className="flex items-center">
            <FormOutlined className="mr-2 text-blue-600" />
            <Title level={4} className="m-0">
              {needToUpdate ? "Update Blog Post" : "Create New Blog Post"}
            </Title>
          </div>
        }
      >
        <AppForm onSubmit={onSubmit} defaultValues={initialValues}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="col-span-2 md:col-span-1">
              <AppInput
                name="title"
                type="text"
                label="Title"
                placeholder="Enter blog title"
              />
            </div>
            <div className="col-span-2 md:col-span-1">
              <AppInput
                name="category"
                type="text"
                label="Category"
                placeholder="Enter blog category"
              />
            </div>
          </div>

          <div className="mt-6">
            <AppTextArea
              name="description"
              label="Description"
              placeholder="Enter a brief description of your blog post"
            />
          </div>

          <Divider className="my-6" />

          <div className="mb-6">
            <Editor
              name="content"
              label="Content"
              defaultValue={initialValues?.content || ""}
            />
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center">
              <Typography.Text strong>Blog Thumbnail</Typography.Text>
              <Button
                type="dashed"
                icon={<PictureOutlined />}
                onClick={() => setThumbnailVisible(true)}
                className="hover:text-blue-600 hover:border-blue-600"
              >
                {selectedThumbnail ? "Change Thumbnail" : "Select Thumbnail"}
              </Button>
            </div>

            {selectedThumbnail && (
              <div className="p-2 mt-4 bg-white rounded-md border border-gray-200">
                <img
                  src={selectedThumbnail}
                  alt="Selected Thumbnail"
                  className="object-cover mx-auto h-32"
                />
              </div>
            )}
          </div>

          {error && (
            <Alert
              message="Error"
              description={error}
              type="error"
              showIcon
              className="mt-6"
              closable
            />
          )}

          <div className="flex justify-end mt-8">
            <Space>
              <Button
                onClick={() => navigate("/dashboard/blogs/manage")}
                className="mr-2"
              >
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                icon={<SaveOutlined />}
                loading={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {needToUpdate ? "Update Blog" : "Create Blog"}
              </Button>
            </Space>
          </div>
        </AppForm>
      </Card>

      {thumbnailVisible && (
        <GalleryModal
          open={thumbnailVisible}
          onClose={() => setThumbnailVisible(false)}
          setSelectedImage={setSelectedThumbnail}
          mode="single"
          selectedImage={selectedThumbnail}
          isSelectThumbnail={true}
        />
      )}
    </>
  );
};

export default NewsForm;
