import { Badge, Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  useDeleteOfferMutation,
  useGetAllOffersQuery,
  useUpdateOfferMutation,
} from "../../../redux/features/storefront/offers.api";
import { IProduct, TQueryParam } from "../../../types";
import { toast } from "sonner";
import { ProColumns } from "@ant-design/pro-components";
import { IoDocuments } from "react-icons/io5";
import AppTable from "../../../components/data-display/AppTable";
import { FaTrash } from "react-icons/fa6";
import moment, { MomentInput } from "moment";
import OfferDrawer from "./OfferDrawer";
import { FaEdit } from "react-icons/fa";

const OffersTable = () => {
  const [deleteOffer] = useDeleteOfferMutation();
  const [updateOffer] = useUpdateOfferMutation();
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: offerData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllOffersQuery([...params]);

  const tableData = offerData?.data?.map(
    ({ _id, title, subTitle, startDate, endDate, products, status }) => ({
      key: _id,
      title,
      subTitle,
      startDate,
      endDate,
      products,
      status,
    })
  );
  const metaData = offerData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      const res = await deleteOffer(id).unwrap();

      if (res.success === true) {
        toast.success("Product deleted successfully", {
          id: toastId,
          duration: 2000,
        });
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    const toastId = toast.loading("Updating");
    try {
      const res = await updateOffer({ id, status }).unwrap();

      if (res.success === true) {
        toast.success("Status updated successfully", {
          id: toastId,
          duration: 2000,
        });
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<IProduct>[] = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Sub Title",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Start Date",
      dataIndex: "startDate",
      key: "startDate",
      render: (item) => {
        return moment(item as MomentInput).format("DD/MM/YYYY");
      },
    },
    {
      title: "End Date",
      dataIndex: "endDate",
      key: "endDate",
      render: (item) => {
        return moment(item as MomentInput).format("DD/MM/YYYY");
      },
    },
    {
      title: "Remaining Time",
      dataIndex: "endDate",
      key: "endDate",
      render: (item) => {
        return `${moment(item as MomentInput).fromNow(true)} left to end`;
      },
    },
    {
      title: "Status",
      key: "status",
      render: (item: any) => {
        return (
          <Popconfirm
            placement="left"
            title={`Are you sure you want to ${
              item.status === "active" ? "deactivate" : "activate"
            } this category?`}
            className="cursor-pointer"
            onConfirm={() => {
              handleStatusChange(
                (item as { key?: string })?.key ?? "",
                item.status === "active" ? "inactive" : "active"
              );
            }}
            okText="Yes"
            cancelText="No"
          >
            {item.status === "active" ? (
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
      key: "x",
      render: (item) => {
        return (
          <Space>
            <Link
              to={`/dashboard/storefront/deals-offers/manage/${
                (item as { key?: string })?.key ?? ""
              }`}
            >
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>

            <Button
              type="dashed"
              size="small"
              icon={<FaEdit />}
              onClick={() => {
                setModalVisible(true);
                setInitialValues(item);
                setNeedToUpdate(true);
              }}
            >
              Update
            </Button>

            <Popconfirm
              placement="left"
              title="Are you sure you want to delete this category?"
              onConfirm={() =>
                handleDelete((item as { key?: string })?.key ?? "")
              }
              okText="Yes"
              cancelText="No"
            >
              <Button type="dashed" size="small" danger icon={<FaTrash />}>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        );
      },
      width: "1%",
    },
  ];
  return (
    <>
      <AppTable<IProduct>
        columns={columns}
        dataSource={(tableData as unknown as IProduct[]) || []}
        title="offers"
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
          setModalVisible(true);
          setInitialValues(null);
          setNeedToUpdate(false);
        }}
      />

      {modalVisible && (
        <OfferDrawer
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          defaultValues={initialValues}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default OffersTable;
