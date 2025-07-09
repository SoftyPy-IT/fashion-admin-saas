import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const ordersAPi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOrders: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/order/all",
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
      providesTags: ["orders"],
    }),

    getOrder: builder.query({
      query: (id: string) => {
        return {
          url: `/order/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return response.data;
      },
      providesTags: ["orders"],
    }),

    deleteOrder: builder.mutation({
      query: (id: string) => {
        return {
          url: `/order/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["orders"],
    }),

    updateOrder: builder.mutation({
      query: (data) => {
        return {
          url: `/order/update/${data.id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["orders"],

      transformResponse: (response: TResponseRedux<[]>) => {
        return response.data;
      },
    }),

    trackOrder: builder.query({
      query: (id: string) => {
        return {
          url: `/order/track/${id}`,
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return response.data;
      },
      providesTags: ["orders"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllOrdersQuery,
  useGetOrderQuery,
  useDeleteOrderMutation,
  useUpdateOrderMutation,
  useTrackOrderQuery,
} = ordersAPi;
