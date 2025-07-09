import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const brandApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBrands: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/brand/all",
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
      providesTags: ["brands"],
    }),

    createBrand: builder.mutation({
      query: (data) => {
        return {
          url: "/brand/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["brands"],
    }),

    updateBrand: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/brand/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["brands"],
    }),

    deleteBrand: builder.mutation({
      query: (id) => {
        return {
          url: `/brand/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["brands"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllBrandsQuery,
  useCreateBrandMutation,
  useUpdateBrandMutation,
  useDeleteBrandMutation,
} = brandApi;
