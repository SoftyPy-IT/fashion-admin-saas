import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../store";

export type TUser = {
  userId: string;
  role: string;
  iat: number;
  exp: number;
};

type TAuthState = {
  user: null | TUser;
  token: null | string;
  refreshToken: null | string;
  profile: null | Record<string, any>;
};

const initialState: TAuthState = {
  user: null,
  token: null,
  refreshToken: null,
  profile: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token, refreshToken } = action.payload;
      state.user = user;
      state.token = token;
      state.refreshToken = refreshToken;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.profile = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
});

export const { setUser, logout, setProfile } = authSlice.actions;

export default authSlice.reducer;

export const useCurrentToken = (state: RootState) => state.auth.token;
export const useSelectRefreshToken = (state: RootState) =>
  state.auth.refreshToken;
export const selectCurrentUser = (state: RootState) => state.auth.user;
export const selectProfile = (state: RootState) => state.auth.profile;
