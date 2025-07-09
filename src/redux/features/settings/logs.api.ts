import { TQueryParam, TResponseRedux } from "../../../types";
import { baseApi } from "../../api/baseApi";

const logsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllLogs: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/logs",
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
    }),

    getBackupLogs: builder.query({
      query: (args) => {
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item: TQueryParam) => {
            params.append(item.name, item.value as string);
          });
        }

        return {
          url: "/backup-logs",
          method: "GET",
          params: params,
        };
      },
      transformResponse: (response: TResponseRedux<[]>) => {
        return response;
      },
      providesTags: ["BackupLogs"],
    }),

    createBackup: builder.mutation({
      query: (args) => {
        return {
          url: "/backup",
          method: "POST",
          body: args,
        };
      },
      invalidatesTags: ["BackupLogs"],
    }),
  }),

  overrideExisting: true,
});

export const {
  useGetAllLogsQuery,
  useGetBackupLogsQuery,
  useCreateBackupMutation,
} = logsApi;
