import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const customerApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCustomers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/customers/all",
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
      providesTags: [TAG_TYPES.CUSTOMERS],
    }),

    createCustomer: builder.mutation({
      query: (data) => {
        return {
          url: "/customers/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.CUSTOMERS],
    }),

    updateCustomer: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/customers/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.CUSTOMERS],
    }),

    deleteCustomer: builder.mutation({
      query: (id) => {
        return {
          url: `/customers/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.CUSTOMERS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} = customerApi;
