import { Button, Col, Drawer, Row } from "antd";
import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppPhoneInput from "../../../components/form/AppPhoneInput";
import AppSelect from "../../../components/form/AppSelect";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from "../../../redux/features/auth/user.api";

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
}

const validationSchema = yup.object().shape({
  firstName: yup.string().required("Please enter first name"),
  lastName: yup.string().required("Please enter last name"),
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("Please enter email"),
  password: yup.string().when("needToUpdate", {
    is: false,
    then: () =>
      yup
        .string()
        .required("Please enter password")
        .min(6, "Password must be at least 6 characters"),
    otherwise: () => yup.string().optional(),
  }),
  phone: yup.string().optional(),
  role: yup.string().required("Please select role"),
  status: yup.string().required("Please select status"),
});

const UserDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [createUser, { isSuccess, isLoading }] = useCreateUserMutation();
  const [
    updateUser,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateUserMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    firstName: initialValues?.firstName || "",
    lastName: initialValues?.lastName || "",
    email: initialValues?.email || "",
    password: "",
    phone: initialValues?.phone || "",
    role: initialValues?.role || "user",
    status: initialValues?.status || "active",
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(
      `${needToUpdate ? "Updating" : "Creating"} user`,
    );
    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateUser({
          id: initialValues.key,
          data,
        }).unwrap();
      } else {
        res = await createUser(data).unwrap();
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
    <Drawer
      title={needToUpdate ? "Update User" : "Create User"}
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
                ? "User updated successfully"
                : "User created successfully"
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
          <Col span={12}>
            <AppInput
              type="text"
              name="firstName"
              label="First Name"
              placeholder="Enter first name"
            />
          </Col>
          <Col span={12}>
            <AppInput
              type="text"
              name="lastName"
              label="Last Name"
              placeholder="Enter last name"
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
          {!needToUpdate && (
            <Col span={12}>
              <AppInput
                type="password"
                name="password"
                label="Password"
                placeholder="Enter password"
              />
            </Col>
          )}
          <Col span={12}>
            <AppSelect
              name="role"
              label="Role"
              options={[
                { label: "User", value: "user" },
                { label: "Admin", value: "admin" },
              ]}
              placeholder="Select role"
            />
          </Col>
          <Col span={12}>
            <AppSelect
              name="status"
              label="Status"
              options={[
                { label: "Active", value: "active" },
                { label: "Inactive", value: "inactive" },
              ]}
              placeholder="Select status"
            />
          </Col>
        </Row>
        <Button
          loading={isLoading || isLoadingUpdate}
          disabled={isLoading || isLoadingUpdate}
          htmlType="submit"
          className="mt-4 w-full btn"
        >
          {needToUpdate ? "Update User" : "Create User"}
        </Button>
      </AppForm>
    </Drawer>
  );
};

export default UserDrawer;
