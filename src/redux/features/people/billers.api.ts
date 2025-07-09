import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const billersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBillers: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/billers/all",
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
      providesTags: [TAG_TYPES.BILLERS],
    }),

    createBiller: builder.mutation({
      query: (data) => {
        return {
          url: "/billers/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.BILLERS],
    }),

    updateBiller: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/billers/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.BILLERS],
    }),

    deleteBiller: builder.mutation({
      query: (id) => {
        return {
          url: `/billers/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.BILLERS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllBillersQuery,
  useCreateBillerMutation,
  useUpdateBillerMutation,
  useDeleteBillerMutation,
} = billersApi;
