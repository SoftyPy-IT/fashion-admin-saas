import { Button } from "antd";
import { FieldValues } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/hooks";
import { useLoginMutation } from "../../redux/features/auth/authApi";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import {
  setProfile,
  setUser,
  TUser,
} from "../../redux/features/auth/authSlice";
import AppForm from "../../components/form/AppForm";
import AppInput from "../../components/form/AppInput";
import * as yup from "yup";
import useYupValidationResolver from "../../libs/useYupValidationResolver";
import image from "../../assets/login.jpg";
import Logo from "../../components/Logo";
import ErrorMessage from "../../components/ErrorMessage";
import SuccessMessage from "../../components/SuccessMessage";

const validationSchema = yup.object({
  email: yup
    .string()
    .email("Please enter a valid email address")
    .required("please enter your email address"),
  password: yup.string().min(6).required("Please enter your password"),
});

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const resolver = useYupValidationResolver(validationSchema);

  const [login, { error, isError, isLoading, isSuccess }] = useLoginMutation();

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading("Logging in");

    try {
      const userInfo = {
        email: data.email,
        password: data.password,
      };

      const res = await login(userInfo).unwrap();

      const user = jwtDecode(res.data.accessToken) as TUser;
      dispatch(
        setUser({
          user: user,
          token: res.data.accessToken,
          refreshToken: res.data.refreshToken,
        }),
      );
      dispatch(setProfile(res.data.user));
      toast.success("Logged in", { id: toastId, duration: 2000 });

      if (res.success === true) {
        navigate(`/dashboard`);
      }
    } catch (err) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 lg:flex-row">
      <div className="flex flex-1 justify-center items-center">
        <div className="px-4 py-12 mx-auto w-full max-w-md sm:px-6 lg:p-0">
          <div className="px-8 pt-6 pb-8 mb-4 bg-white rounded">
            <div className="flex justify-center items-center mx-auto mb-4 w-full">
              <Logo />
            </div>
            {isSuccess && (
              <SuccessMessage successMessage="Logged in successfully" />
            )}
            <AppForm onSubmit={onSubmit} resolver={resolver}>
              <div className="mb-4">
                <AppInput
                  type="email"
                  name="email"
                  label="Email"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-6">
                <AppInput
                  type="password"
                  name="password"
                  label="Password"
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex justify-between items-center">
                <Button
                  disabled={isLoading}
                  loading={isLoading}
                  htmlType="submit"
                  className="w-full btn"
                >
                  Login
                </Button>
              </div>
            </AppForm>
            {isError && error && (
              <ErrorMessage errorMessage={(error as any)?.data?.message} />
            )}
          </div>
        </div>
      </div>
      <div className="hidden flex-1 lg:block">
        <img className="object-cover w-full h-full" src={image} alt="" />
      </div>
    </div>
  );
};

export default Login;
