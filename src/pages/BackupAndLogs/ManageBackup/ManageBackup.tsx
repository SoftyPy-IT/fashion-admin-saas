import {
  Button,
  Table,
  Tag,
  Alert,
  Card,
  Modal,
  notification,
  Skeleton,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import {
  useCreateBackupMutation,
  useGetBackupLogsQuery,
} from "../../../redux/features/settings/logs.api";
import Container from "../../../ui/Container";

const { confirm } = Modal;

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Logs & Backup", href: "#", current: false },
  { name: "Manage Backup", href: "#", current: true },
];

const ManageBackup = () => {
  const {
    data: backupLogs,
    isLoading,
    isFetching,
    refetch,
  } = useGetBackupLogsQuery(undefined) as any;
  const [createBackup, { isLoading: isCreatingBackup }] =
    useCreateBackupMutation();

  const showCreateBackupConfirm = () => {
    confirm({
      title: "Do you want to create a new backup?",
      icon: <ExclamationCircleOutlined />,
      centered: true,
      content:
        "This will create a new backup. Are you sure you want to proceed?",
      onOk() {
        handleCreateBackup();
      },
    });
  };

  const handleCreateBackup = async () => {
    try {
      await createBackup(undefined).unwrap();
      notification.success({
        message: "Success",
        description: "Backup created successfully",
      });
    } catch (error) {
      console.error("Backup failed", error);
      notification.error({
        message: "Error",
        description: "Backup failed",
      });
    }
  };

  const columns = [
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: any) => (
        <Tag color={status === "successful" ? "green" : "red"}>{status}</Tag>
      ),
    },
    {
      title: "Start Time",
      dataIndex: "backupStartTime",
      key: "backupStartTime",
      render: (time: moment.MomentInput) =>
        moment(time).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "End Time",
      dataIndex: "backupEndTime",
      key: "backupEndTime",
      render: (time: moment.MomentInput) =>
        moment(time).format("MMMM Do YYYY, h:mm:ss a"),
    },
  ];

  return (
    <Container
      pages={pages}
      pageTitle="Manage Backup"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <Card style={{ marginTop: 16 }}>
        <div className="mb-4">
          <Button
            type="primary"
            loading={isCreatingBackup}
            onClick={showCreateBackupConfirm}
            style={{ marginTop: 16 }}
          >
            {isCreatingBackup ? "Creating Backup..." : "Manual Backup"}
          </Button>

          <Button
            type="primary"
            onClick={() => refetch()}
            style={{ marginTop: 16, marginLeft: 16 }}
          >
            Refresh
          </Button>
        </div>
        {isLoading || isFetching ? (
          <Skeleton active />
        ) : backupLogs && backupLogs.length > 0 ? (
          <Table
            bordered
            columns={columns}
            dataSource={backupLogs as any}
            rowKey={(record) => record.backupStartTime}
            pagination={false}
            style={{ marginTop: 16 }}
          />
        ) : (
          <Alert
            message="No logs found"
            type="info"
            style={{ marginTop: 16 }}
          />
        )}
      </Card>
    </Container>
  );
};

export default ManageBackup;
