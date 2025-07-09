import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const quotationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllQuotations: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/quotations/all",
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
      providesTags: [TAG_TYPES.QUOTATIONS],
    }),

    getQuotationById: builder.query({
      query: (id) => {
        return {
          url: `/quotations/${id}`,
          method: "GET",
        };
      },
    }),

    createQuotation: builder.mutation({
      query: (data) => {
        return {
          url: "/quotations/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.QUOTATIONS, TAG_TYPES.PRODUCTS],
    }),

    updateQuotation: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/quotations/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.QUOTATIONS],
    }),

    deleteQuotation: builder.mutation({
      query: (id) => {
        return {
          url: `/quotations/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.QUOTATIONS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllQuotationsQuery,
  useGetQuotationByIdQuery,
  useCreateQuotationMutation,
  useUpdateQuotationMutation,
  useDeleteQuotationMutation,
} = quotationsApi;
