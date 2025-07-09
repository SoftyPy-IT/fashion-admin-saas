import { TQueryParam, TResponseRedux } from "../../../types";
import { TAG_TYPES } from "../../../types/tagTypes";
import { baseApi } from "../../api/baseApi";

const unitsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUnits: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/unit/all",
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
      providesTags: [TAG_TYPES.UNITS],
    }),

    createUnit: builder.mutation({
      query: (data) => {
        return {
          url: "/unit/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.UNITS],
    }),

    updateUnit: builder.mutation({
      query: (args) => {
        const { id, data } = args;

        return {
          url: `/unit/update/${id}`,
          method: "PUT",
          body: data,
        };
      },
      invalidatesTags: [TAG_TYPES.UNITS],
    }),

    deleteUnit: builder.mutation({
      query: (id) => {
        return {
          url: `/unit/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: [TAG_TYPES.UNITS],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllUnitsQuery,
  useCreateUnitMutation,
  useUpdateUnitMutation,
  useDeleteUnitMutation,
} = unitsApi;
