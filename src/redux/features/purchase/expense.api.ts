import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const expenseApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllExpenses: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/expense/all",
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
      providesTags: [TAG_TYPES.EXPENSES],
    }),

    getExpenseById: builder.query({
      query: (id) => {
        return {
          url: `/expense/${id}`,
          method: "GET",
        };
      },
    }),

    createExpense: builder.mutation({
      query: (data) => {
        return {
          url: "/expense/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSES],
    }),

    updateExpense: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/expense/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSES],
    }),

    deleteExpense: builder.mutation({
      query: (id) => {
        return {
          url: `/expense/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.EXPENSES],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllExpensesQuery,
  useGetExpenseByIdQuery,
  useCreateExpenseMutation,
  useUpdateExpenseMutation,
  useDeleteExpenseMutation,
} = expenseApi;
