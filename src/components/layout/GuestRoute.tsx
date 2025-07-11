import { PropsWithChildren } from "react";
import { useAppSelector } from "../../redux/hooks";
import { useCurrentToken } from "../../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";

const GuestRoute = ({ children }: PropsWithChildren) => {
  const token = useAppSelector(useCurrentToken);

  if (token) {
    return <Navigate to="/dashboard" replace={true} />;
  }

  return children;
};

export default GuestRoute;
