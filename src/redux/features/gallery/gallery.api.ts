import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const galleryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllImages: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "image-gallery/all",
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
      providesTags: ["gallery-folder"],
    }),

    getFolders: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "image-gallery/folders",
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
      providesTags: ["gallery-folder", "products"],
    }),

    getImagesByFolder: builder.query({
      query: (args) => {
        const params = new URLSearchParams();
        const folder = args.find(
          (item: { name: string; value: string }) => item.name === "folder",
        );
        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: `image-gallery/folder/${folder.value}`,
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return {
          data: response.data,
        };
      },
      providesTags: ["gallery-images"],
    }),

    createFolder: builder.mutation({
      query: (data) => {
        return {
          url: "image-gallery/folder",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["gallery-folder"],
    }),

    updateFolder: builder.mutation({
      query: (data) => {
        return {
          url: `image-gallery/folder/update/${data.id}`,
          method: "PUT",
          body: data.data,
        };
      },
      invalidatesTags: ["gallery-folder"],
    }),

    deleteFolder: builder.mutation({
      query: (id) => {
        return {
          url: `image-gallery/folder/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["gallery-folder"],
    }),

    deleteImage: builder.mutation({
      query: (data) => {
        return {
          url: "image-gallery/delete",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["gallery-folder", "gallery-images"],
    }),

    getFolder: builder.query({
      query: (id) => {
        return {
          url: `image-gallery/folders/${id}`,
          method: "GET",
        };
      },
      providesTags: ["gallery-folder", "products"],
    }),

    uploadImage: builder.mutation({
      query: (data) => {
        return {
          url: "image-gallery/upload",
          method: "POST",
          body: data,
        };
      },

      transformResponse: (response: TResponseRedux<[]>) => {
        return {
          data: response.data,
          meta: response.meta,
        };
      },

      invalidatesTags: ["gallery-folder", "gallery-images"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllImagesQuery,
  useDeleteImageMutation,
  useGetImagesByFolderQuery,
  useGetFoldersQuery,
  useCreateFolderMutation,
  useDeleteFolderMutation,
  useUploadImageMutation,
  useUpdateFolderMutation,
  useGetFolderQuery,
} = galleryApi;
