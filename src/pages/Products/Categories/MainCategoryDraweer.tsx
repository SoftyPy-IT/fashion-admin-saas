import { Button, Drawer, Image } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import * as yup from "yup";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import ErrorMessage from "../../../components/ErrorMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import SuccessMessage from "../../../components/SuccessMessage";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateMainCategoryMutation,
  useUpdateMainCategoryMutation,
} from "../../../redux/features/product/category.api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
  categories?: any[];
  isLoadingCategories?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter category name")
    .min(3, "Category name must be at least 3 characters"),
  categories: yup.array().required("Please select categories").optional(),
});

const MainCategoryDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(initialValues?.image || "");
  const [openImageModal, setOpenImageModal] = useState(false);
  // const [categoryParams, setCategoryParams] = useState<TQueryParam[]>([]);
  // // categories
  // // const { data: categories, isLoading: isLoadingCategories } =
  // //   useGetAllCategoriesQuery(categoryParams);

  // const categoriesOptions = categories?.data?.map(
  //   (item: { _id: string; name: string }) => ({
  //     value: item._id,
  //     label: `${item.name}`,
  //   }),
  // );

  const [createCategory, { isSuccess, isLoading }] =
    useCreateMainCategoryMutation();
  const [
    updateCategory,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateMainCategoryMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    image: initialValues?.image || null,
    categories: initialValues?.categories?.map(
      (item: { _id: string }) => item?._id,
    ),
    serial: initialValues?.serial || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = {
      ...data,
      image: image,
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
        title={needToUpdate ? "Update Main Category" : "Create Main Category"}
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
            label="Main Menu"
            placeholder="Ex: Computer"
          />

          {/* <AppSelect
            name="categories"
            label="Categories"
            options={categoriesOptions}
            mode="multiple"
            placeholder="Select Categories"
            loading={isLoadingCategories}
            onSearch={(search) =>
              setCategoryParams([{ name: "searchTerm", value: search }])
            }
          /> */}

          <Button
            type="dashed"
            className="mb-5 w-full"
            size="large"
            icon={<IoCloudUploadOutline />}
            onClick={() => setOpenImageModal(true)}
          >
            Upload Image
          </Button>

          {image && (
            <div className="flex justify-center items-center mb-5">
              <Image
                src={image}
                alt="category"
                height={200}
                width={200}
                className="rounded-lg border border-gray-300"
              />
            </div>
          )}

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
          isSelectThumbnail={true}
        />
      )}
    </>
  );
};

export default MainCategoryDrawer;
