"use client";

import { useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { useUpdateProfileMutation } from "../../redux/features/auth/authApi";
import { selectProfile, setProfile } from "../../redux/features/auth/authSlice";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";
import AppForm from "../../components/form/AppForm";
import AppInput from "../../components/form/AppInput";
import { Button } from "antd";
import * as yup from "yup";
import useYupValidationResolver from "../../libs/useYupValidationResolver";
import AppDatePicker from "../../components/form/AppDatePicker";
import moment from "moment";

const validationSchema = yup.object().shape({
  firstName: yup.string().optional(),
  lastName: yup.string().optional(),
  phone: yup
    .string()
    .matches(
      /^(?:\+88|01)?(?:\d{11}|\d{13})$/,
      "Phone number is invalid. Please enter a valid Bangladeshi phone number.",
    )
    .required("Phone number is required"), //
  address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  country: yup.string().required("Country is required"),
  postalCode: yup.string().required("Postal code is required"),
  dateOfBirth: yup.string().required("Date of birth is required"),
});

const UpdateProfileForm = () => {
  const [error, setError] = useState<any | null>(null);
  const dispatch = useAppDispatch();
  const [updateProfile, { isSuccess, isLoading }] = useUpdateProfileMutation();
  const profile = useAppSelector(selectProfile);
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    firstName: profile?.firstName || "",
    lastName: profile?.lastName || "",
    phone: profile?.phone || "",
    address: profile?.address?.address || "",
    city: profile?.address?.city || "",
    country: profile?.address?.country || "",
    postalCode: profile?.address?.postalCode || "",
    dateOfBirth: profile?.dateOfBirth
      ? moment(profile?.dateOfBirth, "YYYY-MM-DD")
      : null,
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Updating profile");
    try {
      const userInfo = {
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        address: {
          address: data.address,
          city: data.city,
          country: data.country,
          postalCode: data.postalCode,
        },
        dateOfBirth: new Date(data.dateOfBirth).toISOString().split("T")[0],
      };

      // Update profile
      const res = await updateProfile(userInfo).unwrap();

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        dispatch(setProfile(res?.data));
        setError(null);
      }
    } catch (err: any) {
      setError(
        err?.data.errorSources.map((error: any) => error.message).join(", ") ||
          "Something went wrong",
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <>
      <div className="mb-4">
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Profile updated successfully" />
        )}
      </div>
      <AppForm
        onSubmit={onSubmit}
        defaultValues={defaultValues}
        resolver={resolver}
      >
        <div className="grid grid-cols-1 gap-y-2 gap-x-6 max-w-full sm:grid-cols-6 md:col-span-2">
          <div className="sm:col-span-3">
            <AppInput
              type="text"
              label="First name"
              placeholder="Enter your first name"
              name="firstName"
            />
          </div>

          <div className="sm:col-span-3">
            <AppInput
              type="text"
              label="Last name"
              placeholder="Enter your last name"
              name="lastName"
            />
          </div>

          <div className="sm:col-span-3">
            <AppInput
              type="tel"
              label="Phone"
              placeholder="Enter your phone number"
              name="phone"
            />
          </div>

          <div className="sm:col-span-3">
            <AppDatePicker name="dateOfBirth" label="Date of birth" />
          </div>

          <div className="space-y-2 sm:col-span-3">
            <AppInput
              type="text"
              label="Address"
              placeholder="Enter your address"
              name="address"
            />

            <AppInput
              type="text"
              label="City"
              placeholder="Enter your city"
              name="city"
            />

            <AppInput
              type="text"
              label="Country"
              placeholder="Enter your country"
              name="country"
            />

            <AppInput
              type="text"
              label="Postal code"
              placeholder="Enter your postal code"
              name="postalCode"
            />
          </div>
        </div>
        <div className="">
          <Button
            loading={isLoading}
            disabled={isLoading}
            htmlType="submit"
            className="btn"
          >
            {isLoading ? "Updating..." : "Update profile"}
          </Button>
        </div>
      </AppForm>
    </>
  );
};

export default UpdateProfileForm;
