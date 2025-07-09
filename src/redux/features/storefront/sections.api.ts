import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const sectionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllSections: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/section/all",
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
      providesTags: ["sections"],
    }),
    getSection: builder.query({
      query: (args) => {
        const id = args.find(
          (item: { name: string }) => item.name === "sectionId"
        )?.value;

        const params = new URLSearchParams();
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: `/section/${id}`,
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return {
          data: response.data,
        };
      },
      providesTags: ["sections"],
    }),
    createSection: builder.mutation({
      query: (body) => {
        return {
          url: "/section/create",
          method: "POST",
          body,
        };
      },
      invalidatesTags: ["sections"],
    }),
    updateSection: builder.mutation({
      query: (body) => {
        return {
          url: `/section/update/${body.id}`,
          method: "PUT",
          body,
        };
      },
      invalidatesTags: ["sections"],
    }),
    deleteSection: builder.mutation({
      query: (id) => {
        return {
          url: `/section/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["sections"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllSectionsQuery,
  useGetSectionQuery,
  useCreateSectionMutation,
  useUpdateSectionMutation,
  useDeleteSectionMutation,
} = sectionsApi;
