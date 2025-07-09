import { TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const storefrontApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStorefrontData: builder.query({
      query: () => {
        return {
          url: "storefront/all",
          method: "GET",
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return response.data;
      },
      providesTags: ["storefront"],
    }),

    updateStorefrontData: builder.mutation({
      query: (data) => {
        const { id } = data;
        return {
          url: `storefront/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["storefront"],
    }),

    manageBanner: builder.mutation({
      query: (data) => {
        const { id } = data;
        return {
          url: `storefront/manage-banners/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: ["storefront"],
    }),

    updateStorefrontLogo: builder.mutation({
      query: (data) => {
        const { id } = data;
        return {
          url: `storefront/update/${id}`,
          method: "PUT",
          body: data.formData,
        };
      },
      invalidatesTags: ["storefront", "gallery-images"],
    }),

    uploadBanner: builder.mutation({
      query: (data) => {
        const { id } = data;
        return {
          url: `storefront/upload-banners/${id}`,
          method: "PUT",
          body: data.formData,
        };
      },
      invalidatesTags: ["storefront", "gallery-images"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetStorefrontDataQuery,
  useManageBannerMutation,
  useUploadBannerMutation,
  useUpdateStorefrontLogoMutation,
  useUpdateStorefrontDataMutation,
} = storefrontApi;
