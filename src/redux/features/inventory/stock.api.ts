import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const stockApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllStocks: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/stock-counts/all",
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
      providesTags: ["stocks"],
    }),
    getStock: builder.query({
      query: (id: string) => {
        return {
          url: `/stock-counts/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return response.data;
      },
      providesTags: ["stocks"],
    }),
    updateStock: builder.mutation({
      query: ({ id, formData }) => {
        return {
          url: `/stock-counts/update/${id}`,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["stocks"],
    }),

    createStock: builder.mutation({
      query: (formData) => {
        return {
          url: "/stock-counts/create",
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ["stocks"],
    }),

    deleteStock: builder.mutation({
      query: (id: string) => {
        return {
          url: `/stock-counts/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["stocks"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllStocksQuery,
  useGetStockQuery,
  useUpdateStockMutation,
  useCreateStockMutation,
  useDeleteStockMutation,
} = stockApi;
