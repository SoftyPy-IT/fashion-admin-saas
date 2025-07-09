import { Drawer, Button, Col, Row, Divider } from "antd";
import { useState } from "react";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import {
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
} from "../../../redux/features/people/customers.api";
import AppPhoneInput from "../../../components/form/AppPhoneInput";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  company: yup.string().required("Please enter company name"),
  name: yup.string().required("Please enter contact name"),
  vatNumber: yup.string(),
  gstNumber: yup.string(),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter email"),
  phone: yup
    .string()
    .required("Please enter phone number")
    .test(
      "isValidPhoneNumber",
      "Please enter a valid phone number",
      (value) => {
        if (!value) return false;
        const phoneNumber = parsePhoneNumberFromString(value);
        return phoneNumber ? phoneNumber.isValid() : false;
      }
    ),
  address: yup.string().required("Please enter address"),
  city: yup.string().required("Please enter city"),
  state: yup.string(),
  postalCode: yup.string().required("Please enter postal code"),
  country: yup.string().required("Please enter country"),
});

const CustomerDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [createCustomer, { isSuccess, isLoading }] =
    useCreateCustomerMutation();
  const [
    updateCustomer,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateCustomerMutation();
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
        res = await updateCustomer({
          id: initialValues.key,
          data,
        }).unwrap();
      } else {
        res = await createCustomer(data).unwrap();
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
        title={needToUpdate ? "Update Customer" : "Create Customer"}
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
                  ? "Customer updated successfully"
                  : "Customer created successfully"
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
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="gstNumber"
                label="GST Number"
                placeholder="Enter GST number"
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="email"
                name="email"
                label="Email"
                placeholder="Enter email"
              />
            </Col>
            <Col span={12}>
              <AppPhoneInput
                name="phone"
                label="Phone"
                placeholder="Enter phone number"
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
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="city"
                label="City"
                placeholder="Enter city"
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="state"
                label="State"
                placeholder="Enter state"
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="postalCode"
                label="Postal Code"
                placeholder="Enter postal code"
              />
            </Col>
            <Col span={12}>
              <AppInput
                type="text"
                name="country"
                label="Country"
                placeholder="Enter country"
              />
            </Col>
          </Row>
          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full mt-4 btn"
          >
            {needToUpdate ? "Update Customer" : "Create Customer"}
          </Button>
        </AppForm>
      </Drawer>
    </>
  );
};

export default CustomerDrawer;
