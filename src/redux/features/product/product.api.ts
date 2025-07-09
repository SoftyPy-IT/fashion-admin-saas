import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllProduct: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/product/all",
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
      providesTags: ["products"],
    }),

    getAllFeaturedProducts: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/product/featured",
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
      providesTags: ["products"],
    }),

    getSingleProduct: builder.query({
      query: (id) => {
        return {
          url: `/product/${id}`,
          method: "GET",
        };
      },

      transformResponse: (response: TResponseRedux<{}>) => {
        return response.data;
      },
    }),

    getProductDetails: builder.query({
      query: (id) => {
        return {
          url: `/product/details/${id}`,
          method: "GET",
        };
      },

      transformResponse: (response: TResponseRedux<{}>) => {
        return response.data;
      },
    }),
    createProduct: builder.mutation({
      query: (data) => {
        return {
          url: "/product/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["products"],
    }),

    updateProduct: builder.mutation({
      query: (data) => {
        return {
          url: `/product/update/${data._id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["products"],
    }),

    addFeaturedProducts: builder.mutation({
      query: (data) => {
        return {
          url: "/product/featured",
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["products"],
    }),

    deleteProduct: builder.mutation({
      query: (id) => {
        return {
          url: `/product/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["products"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllProductQuery,
  useGetSingleProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetAllFeaturedProductsQuery,
  useAddFeaturedProductsMutation,
  useGetProductDetailsQuery,
} = productApi;
