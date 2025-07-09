import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const couponApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCoupons: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/coupon/all",
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
      providesTags: [TAG_TYPES.COUPONS],
    }),

    createCoupon: builder.mutation({
      query: (data) => {
        return {
          url: "/coupon/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.COUPONS],
    }),

    updateCoupon: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/coupon/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.COUPONS],
    }),

    deleteCoupon: builder.mutation({
      query: (id) => {
        return {
          url: `/coupon/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.COUPONS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
} = couponApi;
