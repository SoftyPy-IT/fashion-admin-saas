import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const comboApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCombo: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/combo/all",
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
      providesTags: ["combos"],
    }),

    getSingleCombo: builder.query({
      query: (id) => {
        return {
          url: `/combo/${id}`,
          method: "GET",
        };
      },
      providesTags: ["combos"],
    }),

    deleteCombo: builder.mutation({
      query: (id) => {
        return {
          url: `/combo/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["products"],
    }),

    createCombo: builder.mutation({
      query: (body) => {
        return {
          url: "/combo/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["combos"],
    }),

    updateCombo: builder.mutation({
      query: (body) => {
        return {
          url: `/combo/update/${body._id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["combos"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllComboQuery,
  useGetSingleComboQuery,
  useDeleteComboMutation,
  useCreateComboMutation,
  useUpdateComboMutation,
} = comboApi;
