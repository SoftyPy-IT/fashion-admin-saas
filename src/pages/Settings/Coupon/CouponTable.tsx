import { ProColumns } from "@ant-design/pro-components";
import { Badge, Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteCouponMutation,
  useGetAllCouponsQuery,
  useUpdateCouponMutation,
} from "../../../redux/features/settings/coupon.api";
import CouponsDrawer from "./CouponsDrawer";

export type TTableData = {
  key: string;
  name: string;
  code: string;
  discount: number;
  discountType: string;
  expiryDate: string;
  isActive: boolean;
};

const CouponsTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteCoupon] = useDeleteCouponMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: couponData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCouponsQuery([...params]);

  const tableData = couponData?.data as TTableData[];
  const metaData = couponData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteCoupon(id).unwrap();
      toast.success("Coupon deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const [updateCoupon] = useUpdateCouponMutation();

  const handleStatusChange = async (id: string, status: boolean) => {
    const toastId = toast.loading("Updating");
    try {
      const res = await updateCoupon({
        id: id,
        data: { isActive: status },
      }).unwrap();

      if (res.success === true) {
        toast.success("Status updated successfully", {
          id: toastId,
          duration: 2000,
        });
        refetch();
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<TTableData>[] = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
    },
    {
      title: "Discount",
      key: "discount",
      render: (item: any) => {
        return item.discount + (item.discountType === "percentage" ? "%" : "");
      },
      sorter: (a, b) => a.discount - b.discount,
    },
    {
      title: "Discount Type",
      dataIndex: "discountType",
      key: "discountType",
    },
    {
      title: "Limit",
      dataIndex: "limit",
      key: "limit",
    },
    {
      title: "Expiry Date",
      dataIndex: "expiryDate",
      key: "expiryDate",
      sorter: (a, b) =>
        new Date(a.expiryDate).getTime() - new Date(b.expiryDate).getTime(),
    },
    {
      title: "Status",
      key: "isActive",
      render: (item: any) => {
        return (
          <Popconfirm
            placement="left"
            title={`Are you sure you want to ${
              item.isActive ? "deactivate" : "activate"
            } this coupon?`}
            className="cursor-pointer"
            onConfirm={() => {
              handleStatusChange(item._id, !item.isActive);
            }}
            okText="Yes"
            cancelText="No"
          >
            {item.isActive ? (
              <Badge status="success" text="Active" />
            ) : (
              <Badge status="error" text="Inactive" />
            )}
          </Popconfirm>
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (item: any) => (
        <Space>
          <Button
            type="dashed"
            size="small"
            icon={<FaEdit />}
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
            title="Are you sure you want to delete this coupon?"
            onConfirm={() => handleDelete(item?.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="dashed" size="small" danger icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Coupons"
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
        <CouponsDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default CouponsTable;
