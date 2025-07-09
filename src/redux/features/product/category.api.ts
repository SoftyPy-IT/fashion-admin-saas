import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Main Category endpoints
    getAllMainCategories: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/category/main/all",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["categories"],
    }),

    createMainCategory: builder.mutation({
      query: (data) => ({
        url: "/category/main/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    updateMainCategory: builder.mutation({
      query: (args) => ({
        url: `/category/main/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteMainCategory: builder.mutation({
      query: (id) => ({
        url: `/category/main/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),

    // Regular Category endpoints
    getAllCategories: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/category/all",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["categories"],
    }),

    createCategory: builder.mutation({
      query: (data) => ({
        url: "/category/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    updateCategory: builder.mutation({
      query: (args) => ({
        url: `/category/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => ({
        url: `/category/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),

    // Sub Category endpoints
    getAllSubCategories: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }
        return {
          url: "/category/sub/all",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["categories"],
    }),

    createSubCategory: builder.mutation({
      query: (data) => ({
        url: "/category/sub/create",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    updateSubCategory: builder.mutation({
      query: (args) => ({
        url: `/category/sub/${args.id}`,
        method: "PUT",
        body: args.data,
      }),
      invalidatesTags: ["categories"],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => ({
        url: `/category/sub/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["categories"],
    }),

    // Category Tree endpoint
    getCategoryTree: builder.query({
      query: () => ({
        url: "/category/tree",
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
        meta: response.meta,
      }),
      providesTags: ["categories"],
    }),

    updateCategoryOrder: builder.mutation({
      query: (data) => ({
        url: "/category/update-order",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    updateMegaMenuOrder: builder.mutation({
      query: (data) => ({
        url: "/category/update-tree",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["categories"],
    }),

    getMainCategories: builder.query({
      query: () => ({
        url: "/category/main",
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
      }),
      providesTags: ["categories"],
    }),

    getCategoriesByMainCategory: builder.query({
      query: (id) => ({
        url: `/category/main/${id}`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
      }),
      providesTags: ["categories"],
    }),

    getSubCategoriesByCategory: builder.query({
      query: (id) => ({
        url: `/category/${id}/sub-categories`,
        method: "GET",
      }),
      transformResponse: (response: TResponseRedux<[]>) => ({
        data: response.data,
      }),
      providesTags: ["categories"],
    }),
  }),
  overrideExisting: true,
});

export const {
  // Main Category hooks
  useGetAllMainCategoriesQuery,
  useCreateMainCategoryMutation,
  useUpdateMainCategoryMutation,
  useDeleteMainCategoryMutation,

  // Category hooks
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,

  // Sub Category hooks
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,

  // Category Tree hook
  useGetCategoryTreeQuery,
  useUpdateMegaMenuOrderMutation,
  useUpdateCategoryOrderMutation,

  // Other hooks
  useGetCategoriesByMainCategoryQuery,
  useGetSubCategoriesByCategoryQuery,
  useGetMainCategoriesQuery,
} = categoriesApi;
