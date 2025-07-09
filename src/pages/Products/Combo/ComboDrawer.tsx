import React, { useState } from "react";
import { Drawer, Button, Checkbox } from "antd";
import * as yup from "yup";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";

import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import AppTextArea from "../../../components/form/AppTextArea";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";

import { useGetAllProductQuery } from "../../../redux/features/product/product.api";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import { FaImage, FaImages } from "react-icons/fa6";
import { Image } from "antd";
import {
  useCreateComboMutation,
  useUpdateComboMutation,
} from "../../../redux/features/combo/combo.api";
import AppSelectWithWatch from "../../../components/form/AppSelectWithWatch";
import Editor from "../../../components/editor/inde";

interface ComboDrawerProps {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const ComboDrawer: React.FC<ComboDrawerProps> = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}) => {
  // Meta Keywords Options
  const [metaKeywords, setMetaKeywords] = useState<string[]>([]);
  const metaKeywordsOptions = metaKeywords.map((item) => ({
    value: item,
    label: item,
  }));
  const [error, setError] = useState<string | null>(null);
  const [thumbnailVisible, setThumbnailVisible] = useState(false);
  const [imagesVisible, setImagesVisible] = useState(false);
  const [selectedThumbnail, setSelectedThumbnail] = useState<string | null>(
    initialValues?.thumbnail || null,
  );
  const [selectedImages, setSelectedImages] = useState<string[]>(
    initialValues?.images || [],
  );
  const [isActive, setIsActive] = useState(initialValues?.is_active ?? true);

  // Fetch products for items selection
  const { data: productData } = useGetAllProductQuery(undefined);
  const products = productData?.data || [];

  // Prepare product options for select
  const productsOptions = products.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: item.name,
    }),
  );

  // Mutations
  const [createCombo, { isSuccess, isLoading: isCreating }] =
    useCreateComboMutation();
  const [updateCombo, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] =
    useUpdateComboMutation();

  // Validation schema
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .required("Name is required")
      .max(100, "Name must be at most 100 characters"),
    code: yup
      .string()
      .required("Code is required")
      .max(20, "Code must be at most 20 characters"),
    price: yup
      .number()
      .required("Price is required")
      .positive("Price must be a positive number"),
    discount_price: yup.number().notRequired(),
    description: yup
      .string()
      .required("Description is required")
      .max(500, "Description must be at most 500 characters"),
    short_description: yup
      .string()
      .required("Short description is required")
      .max(200, "Short description must be at most 200 characters"),
    items: yup.array().of(yup.string()).min(1, "Select at least one item"),
  });

  // Resolver for form validation
  const resolver = useYupValidationResolver(validationSchema);

  // Default values
  const defaultValues = {
    name: initialValues?.name || "",
    code: initialValues?.code || "",
    items: initialValues?.items?.map((item: any) => item._id) || [],
    price: initialValues?.price || "",
    discount_price: initialValues?.discount_price || 0,
    description: initialValues?.description || "",
    short_description: initialValues?.short_description || "",
    meta_title: initialValues?.meta_title || "",
    meta_description: initialValues?.meta_description || "",
    meta_keywords: initialValues?.meta_keywords || [],
  };

  // Submit handler
  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(
      `${needToUpdate ? "Updating" : "Creating"} Combo`,
    );
    try {
      const finalData = {
        ...data,
        thumbnail: selectedThumbnail,
        images: selectedImages,
        is_active: isActive,
        items: data.items,
      };

      let res;
      if (needToUpdate && initialValues) {
        res = await updateCombo({
          _id: initialValues._id,
          ...finalData,
        }).unwrap();
      } else {
        res = await createCombo(finalData).unwrap();
      }

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);
        onClose();
      }
    } catch (err: any) {
      const errorMessage =
        err?.data?.errorSources
          ?.map((error: any) => error.message)
          .join(", ") || "Something went wrong";

      setError(errorMessage);
      toast.error(errorMessage, { id: toastId, duration: 2000 });
    }
  };

  return (
    <Drawer
      title={needToUpdate ? "Update Combo" : "Create Combo"}
      onClose={onClose}
      open={open}
      size="large"
      width="80%"
    >
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {(isSuccess || isUpdateSuccess) && (
          <SuccessMessage
            successMessage={
              needToUpdate
                ? "Combo updated successfully"
                : "Combo created successfully"
            }
          />
        )}
      </div>

      <AppForm
        onSubmit={onSubmit}
        resolver={resolver}
        defaultValues={defaultValues}
      >
        <div className="space-y-4">
          {/* Basic Information */}

          <div className="grid grid-cols-2 gap-4">
            <AppInput
              name="name"
              type="text"
              label="Combo Name"
              placeholder="Enter combo name"
            />

            <AppInput
              name="code"
              type="text"
              label="Combo Code"
              placeholder="Enter unique combo code"
            />
          </div>

          {/* Price Information */}
          <div className="grid grid-cols-2 gap-4">
            <AppInput
              name="price"
              type="number"
              label="Price"
              placeholder="Enter combo price"
            />
            <AppInput
              name="discount_price"
              type="number"
              label="Discount Price"
              placeholder="Enter discount price (optional)"
            />
          </div>

          {/* Product Items */}
          <AppSelect
            name="items"
            label="Combo Items"
            options={productsOptions}
            mode="multiple"
            placeholder="Select products for this combo"
          />

          {/* Descriptions */}
          <AppTextArea
            name="short_description"
            label="Short Description"
            placeholder="Enter a short description (max 200 characters)"
          />

          <Editor
            name="description"
            defaultValue={initialValues?.description}
          />
          {/* Thumbnail and Images */}
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Thumbnail</label>
              {selectedThumbnail ? (
                <div className="mb-2">
                  <Image
                    src={selectedThumbnail}
                    alt="Combo Thumbnail"
                    width={100}
                    height={100}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <p className="text-red-500">No thumbnail selected</p>
              )}
              <Button type="dashed" onClick={() => setThumbnailVisible(true)}>
                <FaImage className="inline mr-2" />
                Select Thumbnail
              </Button>
            </div>

            <div>
              <label className="block mb-2">Additional Images</label>
              <div className="flex flex-wrap mb-2">
                {selectedImages.map((image) => (
                  <Image
                    key={image}
                    src={image}
                    alt="Combo Image"
                    width={100}
                    height={100}
                    className="mb-2 mr-2 rounded-lg"
                  />
                ))}
              </div>
              <Button type="dashed" onClick={() => setImagesVisible(true)}>
                <FaImages className="inline mr-2" />
                Select Images
              </Button>
            </div>
          </div>

          {/* Meta Information */}
          <AppInput
            name="meta_title"
            type="text"
            label="Meta Title"
            placeholder="Enter meta title (optional)"
          />

          <AppTextArea
            name="meta_description"
            label="Meta Description"
            placeholder="Enter meta description (optional)"
          />

          <AppSelectWithWatch
            name="meta_keywords"
            label="Meta Keywords"
            options={metaKeywordsOptions}
            mode="tags"
            onValueChange={(value) => setMetaKeywords(value as any)}
            placeholder="Enter meta keywords"
          />

          {/* Active Status */}
          <div className="mt-4">
            <Checkbox
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
            >
              Active Combo
            </Checkbox>
          </div>

          {/* Submit Button */}
          <Button
            type="primary"
            htmlType="submit"
            loading={isCreating || isUpdating}
            className="w-full mt-4"
          >
            {needToUpdate ? "Update Combo" : "Create Combo"}
          </Button>
        </div>
      </AppForm>

      {/* Gallery Modals */}
      {thumbnailVisible && (
        <GalleryModal
          open={thumbnailVisible}
          onClose={() => setThumbnailVisible(false)}
          setSelectedImage={setSelectedThumbnail}
          mode="single"
          selectedImage={selectedThumbnail}
        />
      )}

      {imagesVisible && (
        <GalleryModal
          open={imagesVisible}
          onClose={() => setImagesVisible(false)}
          setSelectedImage={setSelectedImages}
          mode="multiple"
          selectedImage={selectedImages}
        />
      )}
    </Drawer>
  );
};

export default ComboDrawer;
