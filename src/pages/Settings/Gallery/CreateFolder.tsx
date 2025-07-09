import { Button, Popover } from "antd";
import { FaFolderPlus } from "react-icons/fa6";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import * as Yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { toast } from "sonner";
import { useCreateFolderMutation } from "../../../redux/features/gallery/gallery.api";

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Folder name is required"),
});

const CreateFolder = () => {
  const resolver = useYupValidationResolver(validationSchema);
  const [createFolder, { isLoading }] = useCreateFolderMutation();

  const onsSubmit = async (values: any) => {
    const toastId = toast.loading("Creating folder...");
    try {
      await createFolder(values).unwrap();
      toast.success("Folder created successfully", {
        id: toastId,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred. Please try again.",
        {
          id: toastId,
          duration: 3000,
        },
      );
    }
  };

  return (
    <Popover
      placement="rightTop"
      content={
        <div
          className="flex flex-col space-y-2 
        w-[300px] p-4 bg-white border border-gray-200 rounded-lg"
        >
          <AppForm onSubmit={onsSubmit} resolver={resolver}>
            <AppInput
              label="Folder name"
              name="name"
              placeholder="Enter folder name"
              type="text"
            />

            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
              className="w-full"
            >
              Create folder
            </Button>
          </AppForm>
        </div>
      }
      title="Create a new folder"
      trigger="click"
    >
      <Button type="primary" icon={<FaFolderPlus />}>
        New folder
      </Button>
    </Popover>
  );
};

export default CreateFolder;
