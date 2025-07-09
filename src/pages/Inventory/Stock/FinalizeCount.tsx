import { useNavigate, useParams } from "react-router-dom";
import Container from "../../../ui/Container";
import {
  useGetStockQuery,
  useUpdateStockMutation,
} from "../../../redux/features/inventory/stock.api";
import { Button, Descriptions, Alert, Divider, Skeleton } from "antd";

import { FaFileCsv } from "react-icons/fa6";
import { IStock } from "../../../types/stock.types";
import moment from "moment";
import AppForm from "../../../components/form/AppForm";
import AppTextArea from "../../../components/form/AppTextArea";
import AppSelectFile from "../../../components/form/AppSelectFile";
import { toast } from "sonner";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Manage Stock", href: "#", current: true },
];

const FinalizeCount = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useGetStockQuery(id as string);
  const stock = data as unknown as IStock;
  const [updateStock, { isLoading: isUpdating }] = useUpdateStockMutation();
  const navigate = useNavigate();
  const handleSubmit = async (values: any) => {
    const toastId = toast.loading("Finalizing stock count...");
    try {
      const formData = new FormData();
      formData.append("file", values.file[0].originFileObj);
      formData.append("note", values.note);

      await updateStock({ id, formData }).unwrap();
      toast.success("Stock count finalized successfully");
      navigate("/dashboard/inventory/manage-stock");
    } catch (error: any) {
      toast.error("Error finalizing stock count");
    } finally {
      toast.dismiss(toastId);
    }
  };

  if (isLoading) {
    return (
      <Container
        pages={pages}
        pageTitle="Finalize Stock Count"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Skeleton active />
      </Container>
    );
  }

  if (isError || !stock) {
    return (
      <Container
        pages={pages}
        pageTitle="Finalize Stock Count"
        pageHeadingHref=""
        pageHeadingButtonText=""
      >
        <Alert message="Error loading stock data" type="error" showIcon />
      </Container>
    );
  }
  return (
    <Container
      pages={pages}
      pageTitle="Finalize Stock Count"
      pageHeadingHref="/dashboard/inventory/manage-stock"
      pageHeadingButtonText="Go Back"
    >
      <Descriptions title="Stock Information" bordered column={2}>
        <Descriptions.Item label="Start Date">
          {moment(stock.startDate).format("MMMM Do YYYY, h:mm:ss a")}
        </Descriptions.Item>
        <Descriptions.Item label="End Date">
          {moment(stock.endDate).format("MMMM Do YYYY, h:mm:ss a")}
        </Descriptions.Item>
        <Descriptions.Item label="Reference">
          {stock.reference}
        </Descriptions.Item>
        <Descriptions.Item label="Type">{stock.type}</Descriptions.Item>
        {stock.brands && (
          <Descriptions.Item label="Brand">
            {stock?.brands?.map((brand) => brand.name).join(", ")}
          </Descriptions.Item>
        )}
        {stock.categories && (
          <Descriptions.Item label="Categories">
            {stock?.categories?.map((category) => category.name).join(", ")}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Is Final Calculation">
          {stock.isFinalCalculation ? "Yes" : "No"}
        </Descriptions.Item>
        <Descriptions.Item label="Download CSV">
          <div className="flex items-center space-x-3">
            <a
              href={stock.initialStockCSV?.url}
              target="_blank"
              download
              rel="noopener noreferrer"
            >
              <FaFileCsv size={30} />
            </a>
            <p className="text-sm text-gray-500"></p>
          </div>
        </Descriptions.Item>
      </Descriptions>
      <p className="my-4 text-sm text-gray-500">
        NB: The first line in the downloaded CSV file should remain as it is.
        Please do not change the order of columns. The correct column order is
        (Product Code, Product Name, Variant, Expected, Counted) & you must
        follow this. Please make sure the CSV file is UTF-8 encoded and not
        saved with byte order mark (BOM). You just need to update the COUNTED
        column in the downloaded CSV file.
      </p>

      <Divider>
        <h4 className="text-lg font-semibold">Finalize Stock Count</h4>
      </Divider>

      <AppForm onSubmit={handleSubmit}>
        <AppSelectFile
          name="file"
          label="Upload Final Stock CSV"
          accept=".csv"
        />
        <AppTextArea
          name="note"
          label="Note"
          placeholder="Add a note (optional)"
        />
        <Button type="primary" htmlType="submit" loading={isUpdating}>
          Finalize Stock Count
        </Button>
      </AppForm>
    </Container>
  );
};

export default FinalizeCount;
