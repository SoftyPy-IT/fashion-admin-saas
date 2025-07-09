import { Button, Col, Divider, Drawer, Row } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppPhoneInput from "../../../components/form/AppPhoneInput";
import SuccessMessage from "../../../components/SuccessMessage";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from "../../../redux/features/people/supplier.api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  company: yup.string().required("Please enter company name"),
  name: yup.string().required("Please enter contact name"),
  vatNumber: yup.string().optional(),
  gstNumber: yup.string().optional(),
  email: yup.string().email("Please enter a valid email address").optional(),
  phone: yup.string().optional(),
  address: yup.string().optional(),
  city: yup.string().optional(),
  state: yup.string().optional(),
  postalCode: yup.string().optional(),
  country: yup.string().optional(),
});

const SupplierDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [createSupplier, { isSuccess, isLoading }] =
    useCreateSupplierMutation();
  const [
    updateSupplier,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateSupplierMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    company: initialValues?.company || "",
    name: initialValues?.name || "",
    vatNumber: initialValues?.vatNumber || "",
    gstNumber: initialValues?.gstNumber || "",
    email: initialValues?.email || "",
    phone: initialValues?.phone || "",
    address: initialValues?.address || "",
    city: initialValues?.city || "",
    state: initialValues?.state || "",
    postalCode: initialValues?.postalCode || "",
    country: initialValues?.country || "",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateSupplier({
          id: initialValues.key,
          data,
        }).unwrap();
      } else {
        res = await createSupplier(data).unwrap();
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
        title={needToUpdate ? "Update Supplier" : "Create Supplier"}
        placement="right"
        size="large"
        onClose={onClose}
        open={open}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Supplier updated successfully"
                  : "Supplier created successfully"
              }
            />
          )}
        </div>
        <AppForm
          onSubmit={onSubmit}
          resolver={resolver}
          defaultValues={defaultValues}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <AppInput
                type="text"
                name="company"
                label="Company Name"
                placeholder="Enter company name"
              />
            </Col>
            <Col span={24}>
              <AppInput
                type="text"
                name="name"
                label="Contact Name"
                placeholder="Enter contact name"
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="vatNumber"
                label="VAT Number"
                placeholder="Enter VAT number"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="gstNumber"
                label="GST Number"
                placeholder="Enter GST number"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="email"
                name="email"
                label="Email"
                placeholder="Enter email"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppPhoneInput
                name="phone"
                label="Phone"
                placeholder="Enter phone number"
                required={false}
              />
            </Col>
            <Col span={24}>
              <Divider />
            </Col>
            <Col span={24}>
              <AppInput
                type="text"
                name="address"
                label="Address"
                placeholder="Enter address"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="city"
                label="City"
                placeholder="Enter city"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="state"
                label="State"
                placeholder="Enter state"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="postalCode"
                label="Postal Code"
                placeholder="Enter postal code"
                required={false}
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="country"
                label="Country"
                placeholder="Enter country"
                required={false}
              />
            </Col>
          </Row>
          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full mt-4 btn"
          >
            {needToUpdate ? "Update Supplier" : "Create Supplier"}
          </Button>
        </AppForm>
      </Drawer>
    </>
  );
};

export default SupplierDrawer;
