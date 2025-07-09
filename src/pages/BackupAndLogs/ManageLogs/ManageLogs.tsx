import React, { useState, useMemo } from "react";
import { Table, Pagination, Spin, Collapse, Alert } from "antd";
import moment from "moment";
import { useGetAllLogsQuery } from "../../../redux/features/settings/logs.api";
import Container from "../../../ui/Container";
import { TQueryParam } from "../../../types";

const { Panel } = Collapse;

interface LogData {
  combined: string[];
  error: string[];
  exception: string[];
  rejection: string[];
}

interface MetaData {
  page: number;
  pageSize: number;
  totalPages: number;
  totalEntries: number;
}

interface LogEntry {
  key: number;
  log: string;
  date: string;
}

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Logs & Backup", href: "#", current: false },
  { name: "Manage Logs", href: "#", current: true },
];

const ManageLogs: React.FC = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);

  const { data, isLoading, isFetching, error, refetch } = useGetAllLogsQuery([
    ...params,
  ]);

  const logs: LogData = useMemo(() => {
    return (
      data?.data ||
      ({
        combined: [],
        error: [],
        exception: [],
        rejection: [],
      } as any)
    );
  }, [data]);

  const meta: MetaData = data?.meta as any;

  const allLogs: LogEntry[] = useMemo(() => {
    return [
      ...logs.combined,
      ...logs.error,
      ...logs.exception,
      ...logs.rejection,
    ].reduce((acc: LogEntry[], log, index) => {
      const dateMatch = log.match(/^\[(.*?)\]/);
      const date = dateMatch
        ? moment(dateMatch[1]).format("MMMM Do YYYY, h:mm:ss a")
        : "Unknown Date";

      if (
        acc.length > 0 &&
        !log.startsWith("[") && // Continue log message
        acc[acc.length - 1].date === date
      ) {
        acc[acc.length - 1].log += `\n${log}`;
      } else {
        acc.push({ key: index + 1, log, date });
      }

      return acc;
    }, []);
  }, [logs]);

  if (error) {
    return <Alert message="Failed to load logs" type="error" showIcon />;
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      width: 200,
    },
    {
      title: "Log Entry",
      dataIndex: "log",
      key: "log",
      render: (_text: string, record: LogEntry) => (
        <Collapse>
          <Panel header={record.log.split("\n")[0]} key={record.key}>
            <pre className="whitespace-pre-wrap">{record.log}</pre>
          </Panel>
        </Collapse>
      ),
    },
  ];

  return (
    <Container
      pages={pages}
      pageTitle="Manage Logs"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <div className="p-4 bg-white rounded-lg shadow">
        {isLoading || isFetching ? (
          <div className="py-10 text-center">
            <Spin size="large" tip="Loading logs..." />
          </div>
        ) : (
          <>
            <div className="flex justify-end">
              <button
                className="mb-5 btn btn-primary"
                onClick={() => refetch()}
              >
                Refresh
              </button>
            </div>

            <Table
              columns={columns}
              dataSource={allLogs}
              pagination={false}
              rowClassName={(record) =>
                record.log.includes("ERROR") ? "bg-red-100 text-red-800" : ""
              }
              className="mb-4"
            />
            <Pagination
              current={meta.page}
              pageSize={meta.pageSize}
              total={meta.totalEntries}
              onChange={(page, _pageSize) => {
                setParams([
                  ...params.filter((param) => param.name !== "page"),
                  { name: "page", value: page.toString() },
                ]);
              }}
              className="flex justify-center mt-4"
              showSizeChanger
              pageSizeOptions={["10", "20", "50"]}
            />
          </>
        )}
      </div>
    </Container>
  );
};

export default ManageLogs;
