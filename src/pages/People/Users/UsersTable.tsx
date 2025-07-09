import { ProColumns } from "@ant-design/pro-components";
import { Avatar, Button, Popconfirm, Space, Tag } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useChangeUserStatusMutation,
  useChnageRoleMutation,
  useGetAllUsersQuery,
} from "../../../redux/features/auth/user.api";
import moment from "moment";
import { useDeleteCustomerMutation } from "../../../redux/features/people/customers.api";
import UserDrawer from "./UserDrawer";

export type TUserTableData = {
  key: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  isVerified: boolean;
  hasShippingAddress: boolean;
  ordersCount: number;
  wishlistCount: number;
  createdAt: string;
  avatar?: { url: string };
};

const UsersTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteUser] = useDeleteCustomerMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: usersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllUsersQuery(params);

  const [updateUserStatus] = useChangeUserStatusMutation();
  const [updateUserRole] = useChnageRoleMutation();

  const tableData: TUserTableData[] =
    usersData?.data?.map((user: any) => ({
      key: user._id,
      avatar: user.avatar,
      name: `${user.firstName} ${user.lastName}`,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status,
      isVerified: user.isVerified,
      hasShippingAddress: user.hasShippingAddress,
      ordersCount: user.orders?.length || 0,
      wishlistCount: user.wishlist?.length || 0,
      createdAt: moment(user.createdAt).format("MMM DD, YYYY"),
    })) || [];

  const metaData = usersData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteUser(id).unwrap();
      toast.success("User deleted successfully", { id: toastId });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    const toastId = toast.loading("Updating status...");
    try {
      await updateUserStatus({ id, status: newStatus }).unwrap();
      toast.success("Status updated successfully", { id: toastId });
      refetch();
    } catch (error) {
      toast.error("Failed to update status", { id: toastId });
    }
  };

  const handleRoleChange = async (id: string, newRole: string) => {
    const toastId = toast.loading("Updating role...");
    try {
      await updateUserRole({ id, role: newRole }).unwrap();
      toast.success("Role updated successfully", { id: toastId });
      refetch();
    } catch (error) {
      toast.error("Failed to update role", { id: toastId });
    }
  };

  const columns: ProColumns<TUserTableData>[] = [
    {
      title: "Avatar",
      key: "avatar",
      dataIndex: "avatar",
      render: (avatar: any) => (
        <Avatar
          src={
            avatar?.url ||
            `https://ui-avatars.com/api/?name=${"John Doe"}&background=random&color=fff`
          }
          alt="user-avatar"
          size="large"
        />
      ),
    },
    {
      title: "Name",
      key: "name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      filters: [
        { text: "User", value: "user" },
        { text: "Admin", value: "admin" },
      ],
      onFilter: (value, record) => record.role === value,
      render: (role, record) => (
        <Popconfirm
          placement="topLeft"
          title={`Change role to ${role === "user" ? "admin" : "user"}?`}
          onConfirm={() =>
            handleRoleChange(record.key, role === "user" ? "admin" : "user")
          }
          okText="Yes"
          cancelText="No"
        >
          {<Tag color={role === "user" ? "blue" : "green"}>{role}</Tag>}
        </Popconfirm>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      filters: [
        { text: "Active", value: "active" },
        { text: "Inactive", value: "inactive" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status, record) => (
        <Popconfirm
          placement="topLeft"
          title={`Change status to ${
            status === "active" ? "inactive" : "active"
          }?`}
          onConfirm={() =>
            handleStatusChange(
              record.key,
              status === "active" ? "inactive" : "active",
            )
          }
          okText="Yes"
          cancelText="No"
        >
          {<Tag color={status === "active" ? "green" : "red"}>{status}</Tag>}
        </Popconfirm>
      ),
    },
    {
      title: "Verified",
      dataIndex: "isVerified",
      key: "isVerified",
      render: (isVerified) => (isVerified ? "Yes" : "No"),
    },
    {
      title: "Orders",
      dataIndex: "ordersCount",
      key: "ordersCount",
      render: (ordersCount) => <Tag color="blue">{ordersCount}</Tag>,
    },
    {
      title: "Wishlist",
      dataIndex: "wishlistCount",
      key: "wishlistCount",
      render: (wishlistCount) => <Tag color="green">{wishlistCount}</Tag>,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => createdAt,
    },
    {
      title: "Action",
      key: "x",
      render: (item: any) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            onClick={() => {
              setInitialValues(item);
              setModalVisible(true);
              setNeedToUpdate(true);
            }}
          >
            Update
          </Button>
          <Popconfirm
            placement="left"
            title="Are you sure you want to delete this user?"
            onConfirm={() => handleDelete(item.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" size="small" danger icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
      width: "1%",
    },
  ];

  return (
    <>
      <AppTable<TUserTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Users"
        refetch={refetch}
        loading={isLoading || isFetching}
        totalData={metaData?.total}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            { name: "limit", value: pageSize.toString() },
          ]);
        }}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          setInitialValues(null);
          setNeedToUpdate(false);
          setModalVisible(true);
        }}
      />

      {modalVisible && (
        <UserDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default UsersTable;
