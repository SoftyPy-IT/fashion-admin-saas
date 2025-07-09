import { Drawer, Button, Image } from "antd";
import { useState } from "react";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import AppTextArea from "../../../components/form/AppTextArea";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateBrandMutation,
  useUpdateBrandMutation,
} from "../../../redux/features/product/brand.api";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import { IoCloudUploadOutline } from "react-icons/io5";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter brand name")
    .min(3, "Brand name must be at least 3 characters"),
  description: yup
    .string()
    .required("Please enter brand description")
    .min(10, "Brand description must be at least 10 characters")
    .max(100, "Brand description must be at most 100 characters"),
});

const BrandsDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(initialValues?.image || null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [createBrand, { isSuccess, isLoading }] = useCreateBrandMutation();
  const [
    updateBrand,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateBrandMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    image: initialValues?.image || null,
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = { ...data, image: image };
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateBrand({
          id: initialValues.key,
          data: finalData,
        }).unwrap();
      } else {
        res = await createBrand(finalData).unwrap();
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
        title={needToUpdate ? "Update Brand" : "Create Brand"}
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
                  ? "Brand updated successfully"
                  : "Brand created successfully"
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

          <AppTextArea
            name="description"
            label="Description"
            placeholder="Enter description"
          />
          <Button
            type="dashed"
            className="w-full mb-5"
            size="large"
            icon={<IoCloudUploadOutline />}
            onClick={() => setOpenImageModal(true)}
          >
            Upload Image
          </Button>

          {image && (
            <div className="flex items-center justify-center mb-5">
              <Image
                src={image}
                alt="category"
                height={200}
                width={200}
                className="border border-gray-300 rounded-lg "
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
        />
      )}
    </>
  );
};

export default BrandsDrawer;
