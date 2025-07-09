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
  useCreateTaxMutation,
  useUpdateTaxMutation,
} from "../../../redux/features/settings/tax.api";
import AppSelect from "../../../components/form/AppSelect";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter tax name")
    .min(3, "Tax name must be at least 3 characters"),
  code: yup.string().required("Please enter tax code"),
  rate: yup
    .number()
    .typeError("Rate must be a number")
    .required("Please enter tax rate")
    .min(0, "Rate must be greater than or equal to 0"),
  type: yup.string().required("Please select tax type"),
});

const TaxesDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [image, setImage] = useState<any | null>(initialValues?.image || null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [createTax, { isSuccess, isLoading }] = useCreateTaxMutation();
  const [
    updateTax,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateTaxMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    code: initialValues?.code || "",
    rate: initialValues?.rate || "",
    type: initialValues?.type || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = { ...data, image: image };
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateTax({
          id: initialValues.key,
          data: finalData,
        }).unwrap();
      } else {
        res = await createTax(finalData).unwrap();
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
        title={needToUpdate ? "Update Tax" : "Create Tax"}
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
                  ? "Tax updated successfully"
                  : "Tax created successfully"
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
            label="Tax Name"
            placeholder="GST 18%"
          />

          <AppInput
            type="text"
            name="code"
            label="Tax Code"
            placeholder="GST18"
          />

          <AppInput
            type="number"
            name="rate"
            label="Tax Rate"
            placeholder="18 (in percentage)"
          />

          <AppSelect
            name="type"
            label="Tax Type"
            options={[
              { label: "Fixed", value: "Fixed" },
              { label: "Percentage", value: "Percentage" },
            ]}
            placeholder="Select tax type"
          />

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full btn"
          >
            {needToUpdate ? "Update Tax" : "Create Tax"}
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

export default TaxesDrawer;
