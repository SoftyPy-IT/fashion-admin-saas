import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const attributesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllAttributes: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/variant/all",
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
      providesTags: ["attributes"],
    }),

    createAttribute: builder.mutation({
      query: (data) => {
        return {
          url: "/variant/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["attributes"],
    }),

    updateAttribute: builder.mutation({
      query: (data) => {
        console.log(data);
        return {
          url: `/variant/update/${data.id}`,
          method: "PUT",
          body: data.data,
        };
      },
      invalidatesTags: ["attributes"],
    }),

    deleteAttribute: builder.mutation({
      query: (id) => {
        return {
          url: `/variant/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["attributes"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllAttributesQuery,
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
  useDeleteAttributeMutation,
} = attributesApi;
