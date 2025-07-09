import { ProColumns } from "@ant-design/pro-components";
import { Button, Popconfirm, Space } from "antd";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import { FaEdit } from "react-icons/fa";
import { FaTrash } from "react-icons/fa6";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import {
  useDeleteCustomerMutation,
  useGetAllCustomersQuery,
} from "../../../redux/features/people/customers.api";
import CustomerDrawer from "./CustomerDrawer";

export type TCustomerTableData = {
  key: string;
  company: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state?: string;
  postalCode?: string;
  country: string;
};

const CustomersTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [initialValues, setInitialValues] = useState<any>(null);
  const [needToUpdate, setNeedToUpdate] = useState(false);
  const [deleteCustomer] = useDeleteCustomerMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: customersData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllCustomersQuery([...params]);

  const tableData = customersData?.data?.map(
    ({
      _id,
      company,
      name,
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
      email,
      phone,
      address,
      city,
      state,
      postalCode,
      country,
    })
  );
  const metaData = customersData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteCustomer(id).unwrap();
      toast.success("Customer deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const columns: ProColumns<TCustomerTableData>[] = [
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
              title="Are you sure you want to delete this customer?"
              onConfirm={() =>
                handleDelete((item as unknown as TCustomerTableData)?.key)
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
      <AppTable<TCustomerTableData>
        columns={columns}
        dataSource={tableData || []}
        title="Customers"
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
        <CustomerDrawer
          initialValues={initialValues}
          open={modalVisible}
          onClose={() => setModalVisible(false)}
          needToUpdate={needToUpdate}
        />
      )}
    </>
  );
};

export default CustomersTable;
