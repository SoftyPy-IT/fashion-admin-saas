import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { useChangePasswordMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import SuccessMessage from "../../components/SuccessMessage";
import AppForm from "../../components/form/AppForm";
import AppInput from "../../components/form/AppInput";
import ErrorMessage from "../../components/ErrorMessage";
import { Button } from "antd";
import * as yup from "yup";
import useYupValidationResolver from "../../libs/useYupValidationResolver";

const validationSchema = yup.object().shape({
  oldPassword: yup.string().required("Please enter your old password"),
  newPassword: yup.string().required("Please enter your new password"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf(
      [yup.ref("newPassword")],
      "Password does not match with new password"
    ),
});

const ChangePasswordForm = () => {
  const [error, setError] = useState(null);
  const [changePassword, { isSuccess, isLoading }] =
    useChangePasswordMutation();

  const resolver = useYupValidationResolver(validationSchema);

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Changing password...");
    try {
      const userInfo = {
        oldPassword: data.oldPassword,
        newPassword: data.confirmPassword,
      };

      const res = await changePassword(userInfo).unwrap();

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources?.map((err: any) => err.message).join(", ") ||
          err.message
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <div className="max-w-full lg:max-w-lg">
      {isSuccess && (
        <div className="mb-4">
          <SuccessMessage successMessage="Password changed successfully" />
        </div>
      )}
      <AppForm onSubmit={onSubmit} resolver={resolver}>
        <div className="flex flex-col">
          <AppInput
            type="password"
            name="oldPassword"
            label="Old Password"
            placeholder="Enter your old password"
          />

          <AppInput
            type="password"
            name="newPassword"
            label="New Password"
            placeholder="Enter your new password"
          />

          <AppInput
            type="password"
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your new password"
          />

          {error && <ErrorMessage errorMessage={error} />}
        </div>

        <div>
          <Button
            loading={isLoading}
            disabled={isLoading}
            htmlType="submit"
            className=" btn"
          >
            {isLoading ? "Changing password..." : "Change password"}
          </Button>
        </div>
      </AppForm>
    </div>
  );
};

export default ChangePasswordForm;
