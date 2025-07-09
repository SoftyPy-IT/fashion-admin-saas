import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const expenseCategoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExpenseCategories: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/expense/expense-categories/all",
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
      providesTags: [TAG_TYPES.EXPENSE_CATEGORIES],
    }),

    getExpenseCategoryById: builder.query({
      query: (id) => {
        return {
          url: `/expense/expense-categories/${id}`,
          method: "GET",
        };
      },
    }),

    createExpenseCategory: builder.mutation({
      query: (data) => {
        return {
          url: "/expense/expense-categories/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSE_CATEGORIES],
    }),

    updateExpenseCategory: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/expense/expense-categories/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSE_CATEGORIES],
    }),

    deleteExpenseCategory: builder.mutation({
      query: (id) => {
        return {
          url: `/expense/expense-categories/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSE_CATEGORIES],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllExpenseCategoriesQuery,
  useGetExpenseCategoryByIdQuery,
  useCreateExpenseCategoryMutation,
  useUpdateExpenseCategoryMutation,
  useDeleteExpenseCategoryMutation,
} = expenseCategoryApi;
