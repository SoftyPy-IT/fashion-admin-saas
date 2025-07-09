import { Button, Drawer } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
} from "../../../redux/features/product/category.api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter sub category name")
    .min(3, "Sub Category name must be at least 3 characters"),
  // category: yup.string().required("Please select category").optional(),
});

const SubCategoryDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  // const [categoryParams, setCategoryParams] = useState<TQueryParam[]>([]);
  // // categories
  // const { data: categories, isLoading: isLoadingCategories } =
  //   useGetAllCategoriesQuery(categoryParams);

  // const categoriesOptions = categories?.data?.map(
  //   (item: { _id: string; name: string }) => ({
  //     value: item._id,
  //     label: `${item.name}`,
  //   }),
  // );

  const [createCategory, { isSuccess, isLoading }] =
    useCreateSubCategoryMutation();
  const [
    updateCategory,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateSubCategoryMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    // category: initialValues?.category?._id || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = { ...data };
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateCategory({
          id: initialValues._id,
          data: finalData,
        }).unwrap();
      } else {
        res = await createCategory(finalData).unwrap();
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
          .join(", ") || "Something went wrong",
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <>
      <Drawer
        title={needToUpdate ? "Update Sub Category" : "Create Sub Category"}
        onClose={onClose}
        open={open}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Sub Category updated successfully"
                  : "Sub Category created successfully"
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
            label="Sub Category Name"
            placeholder="Ex: Computer"
          />

          {/* <AppSelect
            name="category"
            label="Select Category"
            options={categoriesOptions}
            disabled={isLoadingCategories}
            placeholder="Select Category"
            loading={isLoadingCategories}
            onSearch={(search) =>
              setCategoryParams([{ name: "searchTerm", value: search }])
            }
          /> */}

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full btn"
          >
            {needToUpdate ? "Update Sub Category" : "Create Sub Category"}
          </Button>
        </AppForm>
      </Drawer>
    </>
  );
};

export default SubCategoryDrawer;
