import { Drawer, Button } from "antd";
import { useState } from "react";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
} from "../../../redux/features/purchase/expense-category.api";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter category name")
    .min(3, "Category name must be at least 3 characters"),
  code: yup
    .string()
    .required("Please enter category code")
    .min(2, "Category code must be at least 2 characters"),
});

const ExpenseCategoryDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(initialValues?.image || null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [createExpenseCategory, { isSuccess, isLoading }] =
    useCreateExpenseCategoryMutation();
  const [
    updateExpenseCategory,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateExpenseCategoryMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    code: initialValues?.code || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = { ...data, image: image };
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateExpenseCategory({
          id: initialValues.key,
          data: finalData,
        }).unwrap();
      } else {
        res = await createExpenseCategory(finalData).unwrap();
      }

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources
          ?.map((error: any) => error.message)
          .join(", ") || "Something went wrong"
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <>
      <Drawer
        title={
          needToUpdate ? "Update Expense Category" : "Create Expense Category"
        }
        placement="right"
        width={400}
        onClose={onClose}
        open={open}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Expense category updated successfully"
                  : "Expense category created successfully"
              }
            />
          )}
        </div>
        <AppForm
          onSubmit={onSubmit}
          resolver={resolver}
          defaultValues={defaultValues}
        >
          <AppInput
            type="text"
            name="name"
            label="Category Name"
            placeholder="Enter category name"
          />

          <AppInput
            type="text"
            name="code"
            label="Category Code"
            placeholder="Enter category code"
          />

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full btn"
          >
            {needToUpdate ? "Update Category" : "Create Category"}
          </Button>
        </AppForm>
      </Drawer>
      {openImageModal && (
        <GalleryModal
          open={openImageModal}
          onClose={() => setOpenImageModal(false)}
          setSelectedImage={setImage}
          mode="single"
          selectedImage={image}
        />
      )}
    </>
  );
};

export default ExpenseCategoryDrawer;
