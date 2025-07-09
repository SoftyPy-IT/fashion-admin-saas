import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const quantityAdjustmentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAdjustments: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/quantity-adjustment/all",
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
      providesTags: ["quantity-adjustments"],
    }),

    createAdjustment: builder.mutation({
      query: (data) => ({
        url: "/quantity-adjustment/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["quantity-adjustments"],
    }),

    deleteAdjustment: builder.mutation({
      query: (id) => ({
        url: `/quantity-adjustment/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["quantity-adjustments"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllAdjustmentsQuery,
  useCreateAdjustmentMutation,
  useDeleteAdjustmentMutation,
} = quantityAdjustmentsApi;
