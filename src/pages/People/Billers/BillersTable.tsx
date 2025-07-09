import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteBillerMutation,
  useGetAllBillersQuery,
} from "../../../redux/features/people/billers.api";
import BillersDrawer from "./BillersDrawer";

export type TBillerTableData = {
  key: string;
  company: string;
  name: string;
  vatNumber?: string;
  gstNumber?: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

const BillersTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteBiller] = useDeleteBillerMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: billersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBillersQuery([...params]);

  const tableData = billersData?.data?.map(
    ({
      _id,
      company,
      name,
      vatNumber,
      gstNumber,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    }) => ({
      key: _id,
      company,
      name,
      vatNumber,
      gstNumber,
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    })
  );
  const metaData = billersData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteBiller(id).unwrap();
      toast.success("Biller deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<TBillerTableData>[] = [
    {
      title: "Company",
      dataIndex: "company",
      key: "company",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => {
        return a.name.localeCompare(b.name);
      },
    },
    {
      title: "VAT Number",
      dataIndex: "vatNumber",
      key: "vatNumber",
      render: (vatNumber: any) => {
        return vatNumber ? vatNumber : "N/A";
      },
    },
    {
      title: "GST Number",
      dataIndex: "gstNumber",
      key: "gstNumber",
      render: (gstNumber: any) => {
        return gstNumber ? gstNumber : "N/A";
      },
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "City",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "State",
      dataIndex: "state",
      key: "state",
      render: (state: any) => {
        return state ? state : "N/A";
      },
    },
    {
      title: "Postal Code",
      dataIndex: "postalCode",
      key: "postalCode",
    },
    {
      title: "Country",
      dataIndex: "country",
      key: "country",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
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
              title="Are you sure you want to delete this biller?"
              onConfirm={() =>
                handleDelete((item as unknown as TBillerTableData)?.key)
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
      <AppTable<TBillerTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Billers"
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
        <BillersDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default BillersTable;
