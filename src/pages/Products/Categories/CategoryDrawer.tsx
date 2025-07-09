import { Button, Drawer } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateCategoryMutation,
  useGetAllMainCategoriesQuery,
  useGetAllSubCategoriesQuery,
  useUpdateCategoryMutation,
} from "../../../redux/features/product/category.api";
import { TQueryParam } from "../../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
  isLoadingCategories?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter category name")
    .min(3, "Category name must be at least 3 characters"),
  subCategories: yup
    .array()
    .required("Please select sub categories")
    .optional(),
  mainCategory: yup.string().required("Please select main category"),
});

const CategoryDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [categoryParams, setCategoryParams] = useState<TQueryParam[]>([]);
  const [mainCategoryParams, setMainCategoryParams] = useState<TQueryParam[]>(
    [],
  );

  const { data: mainCategories, isLoading: isLoadingMainCategories } =
    useGetAllMainCategoriesQuery(mainCategoryParams);

  const mainCategoriesOptions = mainCategories?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: `${item.name}`,
    }),
  );

  // sub categories
  const { data: subCategories, isLoading: isLoadingSubCategories } =
    useGetAllSubCategoriesQuery(categoryParams);

  const subCategoriesOptions = subCategories?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: `${item.name}`,
    }),
  );
  const [createCategory, { isSuccess, isLoading }] =
    useCreateCategoryMutation();
  const [
    updateCategory,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateCategoryMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    mainCategory: initialValues?.mainCategory?._id || "",
    subCategories: initialValues?.subCategories?.map(
      (item: { subCategory: { _id: string; name: string } }) => {
        return {
          value: item.subCategory._id,
          label: item.subCategory.name,
        };
      },
    ),
    serial: initialValues?.serial || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = {
      ...data,
    };
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
        title={needToUpdate ? "Update Category" : "Create Category"}
        onClose={onClose}
        open={open}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Category updated successfully"
                  : "Category created successfully"
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
            placeholder="Ex: Computer"
          />
          <AppSelect
            name="mainCategory"
            label="Main Category"
            options={mainCategoriesOptions}
            placeholder="Select main category"
            loading={isLoadingMainCategories}
            onSearch={(search) =>
              setMainCategoryParams([{ name: "searchTerm", value: search }])
            }
          />

          <AppSelect
            name="subCategories"
            label="Select Sub Categories"
            options={subCategoriesOptions}
            placeholder="Select sub categories"
            loading={isLoadingSubCategories}
            mode="multiple"
            onSearch={(search) =>
              setCategoryParams([{ name: "searchTerm", value: search }])
            }
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
    </>
  );
};

export default CategoryDrawer;
