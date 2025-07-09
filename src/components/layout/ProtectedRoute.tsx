import { ReactNode, useEffect, useCallback, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  logout,
  setUser,
  useCurrentToken,
  useSelectRefreshToken,
  selectCurrentUser,
  TUser,
} from "../../redux/features/auth/authSlice";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { baseURL } from "../../redux/api/baseApi";
import Preloader from "../Preloader";

interface TokenResponse {
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

const fetchToken = async (refreshToken: string): Promise<TokenResponse> => {
  try {
    const response = await fetch(`${baseURL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to refresh token");
    }

    if (data.success && data.data) {
      return {
        accessToken: data.data.accessToken,
        refreshToken: data.data.refreshToken,
      };
    }

    throw new Error("Invalid response format");
  } catch (error) {
    console.error("Error refreshing token:", error);
    return { error: "RefreshAccessTokenError" };
  }
};

interface ProtectedRouteProps {
  children: ReactNode;
  role?: string;
}

const ProtectedRoute = ({ children, role }: ProtectedRouteProps) => {
  const token = useAppSelector(useCurrentToken);
  const refreshToken = useAppSelector(useSelectRefreshToken);
  const currentUser = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  // Track loading state to prevent unnecessary logouts
  const [isLoading, setIsLoading] = useState(true);

  const validateAndRefreshToken = useCallback(async () => {
    if (!token || !refreshToken) {
      dispatch(logout());
      setIsLoading(false);
      return false;
    }

    try {
      if (currentUser) {
        const currentTime = Math.floor(Date.now() / 1000);

        if (
          currentUser.exp &&
          currentUser.exp > currentTime &&
          (!role || role === currentUser.role)
        ) {
          setIsLoading(false); // Token is valid, stop loading
          return true;
        }

        const newTokens = await fetchToken(refreshToken);

        if (newTokens.accessToken) {
          const newUser = jwtDecode<TUser>(newTokens.accessToken);

          if (role && role !== newUser.role) {
            dispatch(logout());
            setIsLoading(false);
            return false;
          }

          dispatch(
            setUser({
              user: newUser,
              token: newTokens.accessToken,
              refreshToken: newTokens.refreshToken,
            })
          );

          setIsLoading(false); // Stop loading after setting user
          return true;
        }
      }

      dispatch(logout());
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Error in token validation:", error);
      dispatch(logout());
      setIsLoading(false);
      return false;
    }
  }, [token, refreshToken, currentUser, role, dispatch]);

  useEffect(() => {
    validateAndRefreshToken();
  }, [validateAndRefreshToken]);

  if (isLoading) {
    return <Preloader />; // Show loading spinner while validating token
  }

  if (!token || !currentUser) {
    return <Navigate to="/" replace />;
  }

  if (token && window.location.pathname === "/") {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
