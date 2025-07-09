import { Button, Card, Popconfirm, Switch, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { BsTrash } from "react-icons/bs";
import { toast } from "sonner";
import {
  useManageBannerMutation,
  useUploadBannerMutation,
} from "../../../redux/features/storefront/storefront.api";
import { useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";

interface Props {
  _id: string;
  banners: { _id: string; url: string; is_active: boolean }[];
}

const StorefrontBanners = ({ _id, banners }: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [manageBanner] = useManageBannerMutation();
  const [uploadBanner, { isLoading: isUploadingBanner, isSuccess }] =
    useUploadBannerMutation();

  const handleStatusChange = async (
    id: string,
    bannerId: string,
    status: boolean
  ) => {
    const toastId = toast.loading("Updating banner status...");
    try {
      const data = {
        operation: "update",
        bannerId: bannerId,
        is_active: status,
      };
      const res = await manageBanner({ id, ...data }).unwrap();
      if (res.success === true) {
        toast.success("Banner status updated successfully");
      }
    } catch (error: any) {
      setError(
        error?.data.errorSources
          .map((error: any) => error.message)
          .join(", ") || "Something went wrong"
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleDeleteBanner = async (id: string, bannerId: string) => {
    const toastId = toast.loading("Deleting banner...");
    try {
      const data = {
        operation: "delete",
        bannerId,
      };
      const res = await manageBanner({ id, ...data }).unwrap();
      if (res.success === true) {
        toast.success("Banner deleted successfully");
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    } finally {
      toast.dismiss(toastId);
    }
  };

  const handleUploadBanner = async (id: string, { file }: { file: any }) => {
    const toastId = toast.loading("Uploading banner...");
    try {
      const formData = new FormData();
      formData.append("banners", file);

      const res = await uploadBanner({ id, formData }).unwrap();
      if (res.success === true) {
        toast.success("Banner uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload banner");
    } finally {
      toast.dismiss(toastId);
    }
  };
  return (
    <Card title="Banners" bordered style={{ marginTop: 16 }}>
      <Upload
        name="banners"
        multiple
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={() => false}
        onChange={(file) => {
          handleUploadBanner(_id, file);
        }}
      >
        <button style={{ border: 0, background: "none" }} type="button">
          {isUploadingBanner ? <LoadingOutlined /> : <PlusOutlined />}
          <div style={{ marginTop: 8 }}>Upload</div>
        </button>
      </Upload>
      <div className="mb-4">
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Profile updated successfully" />
        )}
      </div>
      <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {banners.map(
          (banner: { _id: string; url: string; is_active: boolean }) => (
            <Card
              key={banner._id}
              cover={<img alt={`Banner ${banner._id}`} src={banner.url} />}
              actions={[
                <Switch
                  checked={banner.is_active}
                  onChange={(checked) =>
                    handleStatusChange(_id, banner._id, checked)
                  }
                  checkedChildren="Active"
                  unCheckedChildren="Inactive"
                  key={banner._id}
                />,
                <Popconfirm
                  title="Are you sure to delete this banner?"
                  onConfirm={() => handleDeleteBanner(_id, banner._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="text" size="large" icon={<BsTrash />} danger />
                </Popconfirm>,
              ]}
            />
          )
        )}
      </div>
    </Card>
  );
};

export default StorefrontBanners;
