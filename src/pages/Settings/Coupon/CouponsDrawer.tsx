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

import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import {
  useCreateCouponMutation,
  useUpdateCouponMutation,
} from "../../../redux/features/settings/coupon.api";
import AppSelect from "../../../components/form/AppSelect";
import AppDatePicker from "../../../components/form/AppDatePicker";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter coupon name")
    .min(3, "Coupon name must be at least 3 characters"),
  code: yup.string().required("Please enter coupon code"),
  discount: yup
    .number()
    .typeError("Discount must be a number")
    .required("Please enter discount")
    .min(0, "Discount must be greater than or equal to 0"),
  discountType: yup.string().required("Please select discount type"),
  expiryDate: yup.date().required("Please select expiry date"),
  limit: yup.number().typeError("Limit must be a number").default(50),
});

const CouponsDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(initialValues?.image || null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [createCoupon, { isSuccess, isLoading }] = useCreateCouponMutation();
  const [
    updateCoupon,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateCouponMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    code: initialValues?.code || "",
    discount: initialValues?.discount || "",
    discountType: initialValues?.discountType || "",
    expiryDate: initialValues?.expiryDate || "",
    limit: initialValues?.limit || 50,
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = { ...data, image: image };
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateCoupon({
          id: initialValues._id,
          data: finalData,
        }).unwrap();
      } else {
        res = await createCoupon(finalData).unwrap();
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
        title={needToUpdate ? "Update Coupon" : "Create Coupon"}
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
                  ? "Coupon updated successfully"
                  : "Coupon created successfully"
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
            label="Coupon Name"
            placeholder="Summer Sale"
          />

          <AppInput
            type="text"
            name="code"
            label="Coupon Code"
            placeholder="SUMMER2023"
          />

          <AppInput
            type="number"
            name="discount"
            label="Discount"
            placeholder="20 (in percentage)"
          />

          <AppSelect
            name="discountType"
            label="Discount Type"
            options={[
              { label: "Percentage", value: "percentage" },
              { label: "Flat", value: "flat" },
            ]}
            placeholder="Select discount type"
          />

          <AppInput type="number" name="limit" label="Limit" placeholder="50" />

          <AppDatePicker name="expiryDate" label="Expiry Date" />

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full btn"
          >
            {needToUpdate ? "Update Coupon" : "Create Coupon"}
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

export default CouponsDrawer;
