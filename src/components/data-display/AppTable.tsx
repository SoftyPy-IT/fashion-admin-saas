import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { CSSProperties } from "react";

type TableProps<T> = {
  columns: ProColumns<T>[];
  dataSource: T[];
  loading: boolean;
  pagination?: boolean;
  onPageChange?: (page: number, pageSize: number) => void;
  onSearch?: (value: string) => void;
  onCreateClick?: () => void;
  title: string;
  refetch?: () => void;
  totalData?: number;
  action?: () => void;
  actionTitle?: string;
  expandable?: any;
};

const tableContainerStyle: CSSProperties = {
  overflowX: "auto",
  minWidth: "100px",
};

const AppTable = <T extends Record<string, any>>({
  columns,
  dataSource,
  loading,
  pagination = true,
  onPageChange,
  onSearch,
  onCreateClick,
  title,
  totalData,
  action,
  refetch,
  actionTitle,
  expandable,
}: TableProps<T>) => {
  return (
    <div style={tableContainerStyle} className="responsive-table-container">
      <ProTable<T>
        columns={columns}
        dataSource={dataSource}
        cardBordered
        cardProps={{
          style: {
            overflowX: "auto",
          },
        }}
        expandable={expandable}
        loading={loading}
        bordered
        rowKey={(record) => record._id || record.key}
        dateFormatter="string"
        toolbar={
          onSearch
            ? {
                search: {
                  onSearch,
                  placeholder: `Search ${title}`,
                  size: "middle",
                },
              }
            : undefined
        }
        options={{
          setting: { listsHeight: 400 },
          fullScreen: true,
          reload: () => {
            if (refetch) {
              refetch();
            }
          },
        }}
        request={async () => ({
          data: dataSource,
          success: true,
        })}
        search={false}
        pagination={
          pagination
            ? {
                showTotal: (total) => `Total ${total} items`,
                pageSize: 20,
                size: "default",
                total: totalData,
                itemRender(_page, type, element) {
                  if (type === "prev") {
                    return <Button>Previous</Button>;
                  }
                  if (type === "next") {
                    return <Button>Next</Button>;
                  }
                  return element;
                },
                onChange: onPageChange,
              }
            : false
        }
        toolBarRender={() => {
          const buttons = [];

          if (title && onCreateClick) {
            buttons.push(
              <Button
                key="create"
                icon={<PlusOutlined />}
                onClick={onCreateClick}
                className="btn"
              >
                Add {title}
              </Button>,
            );
          }

          if (action && actionTitle) {
            buttons.push(
              <Button
                key="action"
                icon={<PlusOutlined />}
                onClick={action}
                className="btn"
              >
                {actionTitle}
              </Button>,
            );
          }

          return buttons;
        }}
      />
    </div>
  );
};

export default AppTable;
