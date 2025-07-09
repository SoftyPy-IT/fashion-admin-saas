import { Drawer, Button } from "antd";
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

import { useGetAllProductQuery } from "../../../redux/features/product/product.api";
import AppSelect from "../../../components/form/AppSelect";
import { useCreateBarcodeMutation } from "../../../redux/features/product/barcode.api";

interface Props {
  open: boolean;
  onClose: () => void;
}

const validationSchema = yup.object().shape({
  name: yup.string().required("Please enter barcode name"),
  product_id: yup.string().required("Please select a product"),
  description: yup.string().required("Please enter description"),
});

const BarcodeDrawer = ({ open, onClose }: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [createBarcode, { isSuccess, isLoading }] = useCreateBarcodeMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const { data: products, isLoading: pIsLoading } = useGetAllProductQuery([
    {
      name: "fields",
      value: "name",
    },
  ]);

  const productsOptions = products?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: `${item.name}`,
    })
  );

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Creating barcode");

    try {
      const res = await createBarcode(data).unwrap();

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
    <Drawer title="Create a new brand" onClose={onClose} open={open}>
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Profile updated successfully" />
        )}
      </div>
      <AppForm onSubmit={onSubmit} resolver={resolver}>
        <AppInput
          type="text"
          name="name"
          label="Barcode Name"
          placeholder="Enter category name"
        />

        <AppTextArea
          name="description"
          label="Description"
          placeholder="Enter description"
        />

        <AppSelect
          label="Select a product"
          name="product_id"
          options={productsOptions}
          placeholder="Select a product"
          loading={pIsLoading}
          disabled={pIsLoading}
        />
        <Button
          loading={isLoading}
          disabled={isLoading}
          htmlType="submit"
          className="w-full btn"
        >
          Generate Barcode
        </Button>
      </AppForm>
    </Drawer>
  );
};

export default BarcodeDrawer;
