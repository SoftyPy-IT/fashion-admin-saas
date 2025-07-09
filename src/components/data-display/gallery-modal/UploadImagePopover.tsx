import { Button, Popover } from "antd";
import { debounce } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { FaFolderPlus } from "react-icons/fa6";
import { toast } from "sonner";
import * as Yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useGetFoldersQuery,
  useUploadImageMutation,
} from "../../../redux/features/gallery/gallery.api";
import { TQueryParam } from "../../../types";
import AppForm from "../../form/AppForm";
import AppSelect from "../../form/AppSelect";
import AppSelectFile from "../../form/AppSelectFile";

const validationSchema = Yup.object().shape({
  folder: Yup.string().required("Folder is required"),
  images: Yup.array().required("Please select at least one image"),
});

const UploadImagePopover = () => {
  const [uploadImage, { isLoading: isUploading }] = useUploadImageMutation();
  const resolver = useYupValidationResolver(validationSchema);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [search, setSearch] = useState("");

  const { data: folders, isLoading: isLoadingFolders } =
    useGetFoldersQuery(params);

  const foldersData = folders?.data || [];

  const onSubmit = async (data: any) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const formData = new FormData();
      data.images.forEach((file: any) => {
        formData.append("images", file.originFileObj);
      });
      formData.append("folder", data.folder);

      await uploadImage(formData).unwrap();
      toast.success("Image uploaded successfully", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload image", {
        id: toastId,
      });
    }
  };

  // Debounced search
  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setParams(value ? [{ name: "searchTerm", value }] : []);
      }, 500),
    [],
  );

  useEffect(() => {
    debouncedSearch(search);
    return () => {
      debouncedSearch.cancel();
    };
  }, [search]);

  return (
    <Popover
      placement="rightTop"
      trigger="click"
      title="Upload to Folder"
      content={
        <div className="flex flex-col space-y-2 w-[300px] p-4 bg-white border border-gray-200 rounded-lg">
          <AppForm onSubmit={onSubmit} resolver={resolver}>
            <AppSelect
              label="Select Folder"
              name="folder"
              placeholder="Search and select a folder"
              loading={isLoadingFolders}
              options={foldersData.map((folder: any) => ({
                label: `${folder.name} (${folder.images?.length || 0} images)`,
                value: folder._id,
              }))}
              onSearch={(value: string) => setSearch(value)}
            />

            <AppSelectFile label="Upload Images" name="images" />

            <Button
              className="w-full btn_outline"
              htmlType="submit"
              loading={isUploading}
              disabled={isUploading}
            >
              Upload
            </Button>
          </AppForm>
        </div>
      }
    >
      <Button type="primary" icon={<FaFolderPlus />}>
        New Upload
      </Button>
    </Popover>
  );
};

export default UploadImagePopover;
