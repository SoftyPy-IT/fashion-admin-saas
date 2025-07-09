import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const barcodeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllBarcodes: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/barcode/all",
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
      providesTags: ["barcode"],
    }),

    createBarcode: builder.mutation({
      query: (data) => {
        return {
          url: "/barcode/create",
          method: "POST",
          body: data,
        };
      },
      invalidatesTags: ["barcode"],
    }),

    deleteBarcode: builder.mutation({
      query: (id) => {
        return {
          url: `/barcode/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["barcode"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useGetAllBarcodesQuery,
  useCreateBarcodeMutation,
  useDeleteBarcodeMutation,
} = barcodeApi;
