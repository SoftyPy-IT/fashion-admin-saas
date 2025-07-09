import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const supplierApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSuppliers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/supplier/all",
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
      providesTags: [TAG_TYPES.SUPPLIERS],
    }),

    createSupplier: builder.mutation({
      query: (data) => {
        return {
          url: "/supplier/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.SUPPLIERS],
    }),

    updateSupplier: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/supplier/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.SUPPLIERS],
    }),

    deleteSupplier: builder.mutation({
      query: (id) => {
        return {
          url: `/supplier/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.SUPPLIERS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} = supplierApi;
