import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const taxApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllTaxes: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/tax/all",
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
      providesTags: [TAG_TYPES.TAXES],
    }),

    createTax: builder.mutation({
      query: (data) => {
        return {
          url: "/tax/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.TAXES],
    }),

    updateTax: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/tax/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.TAXES],
    }),

    deleteTax: builder.mutation({
      query: (id) => {
        return {
          url: `/tax/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.TAXES],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllTaxesQuery,
  useCreateTaxMutation,
  useUpdateTaxMutation,
  useDeleteTaxMutation,
} = taxApi;
