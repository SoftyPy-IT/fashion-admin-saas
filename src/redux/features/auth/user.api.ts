import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/user/all",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },
      providesTags: ["users"],
    }),

    createUser: builder.mutation({
      query: (data) => ({
        url: "/user/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["users"],
    }),

    updateUser: builder.mutation({
      query: (args) => {
        const { id, data } = args;
        return {
          url: `/user/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["users"],
    }),

    changeUserStatus: builder.mutation({
      query: (args) => ({
        url: `/user/change-status/${args.id}`,
        method: "PATCH",
        body: { status: args.status },
      }),
      invalidatesTags: ["users"],
    }),

    chnageRole: builder.mutation({
      query: (args) => ({
        url: `/user/change-role/${args.id}`,
        method: "PATCH",
        body: { role: args.role },
      }),
      invalidatesTags: ["users"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useChangeUserStatusMutation,
  useChnageRoleMutation,
} = userApi;
