import { Button, Modal } from "antd";
import * as Yup from "yup";
import useYupValidationResolver from "../../../../libs/useYupValidationResolver";
import {
  useCreateFolderMutation,
  useUpdateFolderMutation,
} from "../../../../redux/features/gallery/gallery.api";
import { toast } from "sonner";
import AppForm from "../../../../components/form/AppForm";
import AppInput from "../../../../components/form/AppInput";

type props = {
  visible: boolean;
  onClose: () => void;
  initialData?: any;
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Folder name is required"),
});

const CreateFolderModal = ({ visible, onClose, initialData }: props) => {
  const resolver = useYupValidationResolver(validationSchema);
  const [createFolder, { isLoading }] = useCreateFolderMutation();
  const [updateFolder, { isLoading: isUpdating }] = useUpdateFolderMutation();
  const onsSubmit = async (values: any) => {
    const toastId = toast.loading("Creating folder...");
    try {
      if (initialData) {
        await updateFolder({ id: initialData.id, data: values }).unwrap();
        toast.success("Folder updated successfully", {
          id: toastId,
          duration: 3000,
        });
        onClose();
        return;
      }

      await createFolder({
        ...values,
        type: "product",
      }).unwrap();
      toast.success("Folder created successfully", {
        id: toastId,
        duration: 3000,
      });
      onClose();
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
    <Modal
      title="Create a new folder"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="back" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <AppForm
        onSubmit={onsSubmit}
        resolver={resolver}
        defaultValues={initialData}
      >
        <AppInput
          label="Folder name"
          name="name"
          placeholder="Enter folder name"
          type="text"
        />

        <Button
          type={initialData ? "default" : "primary"}
          htmlType="submit"
          loading={isLoading || isUpdating}
          disabled={isLoading || isUpdating}
          className="w-full"
        >
          {initialData ? "Update folder" : "Create folder"}
        </Button>
      </AppForm>
    </Modal>
  );
};

export default CreateFolderModal;
