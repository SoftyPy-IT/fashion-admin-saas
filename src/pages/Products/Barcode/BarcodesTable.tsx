import { ProColumns } from "@ant-design/pro-components";
import { Button, Form, Image, Input, Popconfirm, Popover, Space } from "antd";
import { useRef, useState, useEffect } from "react";
import { TQueryParam } from "../../../types";
import { Link } from "react-router-dom";
import { FaPrint, FaTrash } from "react-icons/fa6";
import { IoDocuments } from "react-icons/io5";
import { toast } from "sonner";
import AppTable from "../../../components/data-display/AppTable";
import BarcodeDrawer from "./BarcodeDrawer";
import {
  useDeleteBarcodeMutation,
  useGetAllBarcodesQuery,
} from "../../../redux/features/product/barcode.api";
import { useReactToPrint } from "react-to-print";

export type TTableData = {
  key: string;
  name: string;
  description: string;
  barcode: {
    url: string;
    public_id: string;
  };
  product_id: string;
};

const BarcodesTable = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const contentToPrint = useRef<HTMLDivElement>(null);
  const [count, setCount] = useState(1);
  const [url, setUrl] = useState("");
  const [deleteBarcode] = useDeleteBarcodeMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: barcodeData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllBarcodesQuery([...params]);

  const tableData = barcodeData?.data?.map(
    ({ _id, name, description, barcode, product_id }) => ({
      key: _id,
      description,
      name,
      barcode,
      product_id,
    })
  );
  const metaData = barcodeData?.meta;

  const handleDelete = async (id: string) => {
    const toastId = toast.loading("Deleting");
    try {
      await deleteBarcode(id).unwrap();
      toast.success("Barcode deleted successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const handlePrint = (count: number, url: string) => {
    setCount(count);
    setUrl(url);
  };

  const generatePDF = useReactToPrint({
    content: () => contentToPrint.current,
    onAfterPrint: () => {
      setCount(1);
      setUrl("");
    },
  });

  useEffect(() => {
    if (url && count > 0) {
      generatePDF();
    }
  }, [url, count, generatePDF]);

  const columns: ProColumns<TTableData>[] = [
    {
      title: "Image",
      dataIndex: "barcode",
      key: "barcode",
      align: "left",
      width: "20%",
      render: (image) => (
        <Image
          src={(image as unknown as TTableData["barcode"])?.url}
          alt="barcode"
          style={{ objectFit: "cover" }}
          preview={false}
        />
      ),
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
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Action",
      key: "x",
      render: (item) => {
        return (
          <Space>
            <Link
              to={`/dashboard/products/manage/${
                (item as unknown as TTableData)?.product_id
              }`}
            >
              <Button type="dashed" size="small" icon={<IoDocuments />}>
                Details
              </Button>
            </Link>
            <Popover
              content={
                <Form layout="vertical">
                  <Form.Item label="Count">
                    <Input
                      type="number"
                      onChange={(e) => {
                        const value = parseInt(e.target.value);
                        if (!isNaN(value) && value > 0) {
                          setCount(value);
                        } else {
                          setCount(1);
                        }
                      }}
                      value={count}
                      placeholder="Enter the number of copies"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() =>
                      handlePrint(
                        count,
                        (item as unknown as TTableData)?.barcode.url
                      )
                    }
                  >
                    Print
                  </Button>
                </Form>
              }
              title="Print Barcode"
              trigger="click"
            >
              <Button type="dashed" size="small" icon={<FaPrint />}>
                Print
              </Button>
            </Popover>
            <Popconfirm
              placement="left"
              title="Are you sure you want to delete this barcode?"
              onConfirm={() =>
                handleDelete((item as unknown as TTableData)?.key)
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
      <AppTable<TTableData>
        columns={columns}
        dataSource={tableData || []}
        title="barcode"
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
        }}
      />
      {modalVisible && (
        <BarcodeDrawer
          open={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
      <div style={{ display: "none" }}>
        <div
          ref={contentToPrint}
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          {[...Array(count)].map((_, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "10px",
              }}
            >
              <img
                src={url}
                alt="barcode"
                style={{
                  maxWidth: "100%",
                  maxHeight: "100%",
                  objectFit: "contain",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BarcodesTable;
