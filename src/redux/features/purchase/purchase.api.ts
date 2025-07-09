import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const purchaseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllPurchases: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/purchase/all",
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
      providesTags: [TAG_TYPES.PURCHASES],
    }),

    getPurchaseById: builder.query({
      query: (id) => {
        return {
          url: `/purchase/${id}`,
          method: "GET",
        };
      },
    }),

    createPurchase: builder.mutation({
      query: (data) => {
        return {
          url: "/purchase/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.PURCHASES, TAG_TYPES.PRODUCTS],
    }),

    updatePurchase: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/purchase/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.PURCHASES],
    }),

    deletePurchase: builder.mutation({
      query: (id) => {
        return {
          url: `/purchase/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.PURCHASES],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllPurchasesQuery,
  useGetPurchaseByIdQuery,
  useCreatePurchaseMutation,
  useUpdatePurchaseMutation,
  useDeletePurchaseMutation,
} = purchaseApi;
