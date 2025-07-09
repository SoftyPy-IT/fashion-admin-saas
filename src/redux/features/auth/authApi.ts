import { baseApi } from "../../api/baseApi";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/auth/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    updateAvatar: builder.mutation({
      query: (file) => ({
        url: `/user/update-profile`,
        method: "PUT",
        body: file,
        headers: new Headers({
          ContentType: "multipart/form-data",
        }),
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `/user/update-profile`,
        method: "PUT",
        body: data,
      }),
    }),

    changePassword: builder.mutation({
      query: (data) => ({
        url: `/user/change-password`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useUpdateAvatarMutation,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} = authApi;
