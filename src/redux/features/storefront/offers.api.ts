import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const offersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllOffers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/offers/all",
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
      providesTags: ["offers"],
    }),
    getAllOffersProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/offers/all/products",
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
      providesTags: ["offers"],
    }),

    getOffer: builder.query({
      query: (args) => {
        const id = args.find(
          (item: { name: string }) => item.name === "offerId"
        )?.value;

        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: `/offers/${id}`,
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return {
          data: response.data,
        };
      },
    }),

    createOffer: builder.mutation({
      query: (body) => {
        return {
          url: "/offers/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["offers"],
    }),

    updateOffer: builder.mutation({
      query: (body) => {
        console.log("body", body);
        return {
          url: `/offers/update/${body.id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["offers"],
    }),

    deleteOffer: builder.mutation({
      query: (id) => {
        return {
          url: `/offers/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["offers"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllOffersQuery,
  useGetOfferQuery,
  useCreateOfferMutation,
  useDeleteOfferMutation,
  useUpdateOfferMutation,
  useGetAllOffersProductsQuery,
} = offersApi;
