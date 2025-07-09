import { Button, Checkbox, Col, Form, Row } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import AppDatePicker from "../../../components/form/AppDatePicker";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import { useCreateStockMutation } from "../../../redux/features/inventory/stock.api";
import { useGetAllBrandsQuery } from "../../../redux/features/product/brand.api";
import Container from "../../../ui/Container";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Count Stock", href: "#", current: true },
];

const CountStock = () => {
  const [isPartial, setIsPartial] = useState(false);

  // const { data: categories, isLoading: isCategoriesLoading } =
  //   useGetAllCategoriesQuery(undefined);

  const [createStock, { isLoading: isCreating }] = useCreateStockMutation();
  const navigate = useNavigate();
  // const categoriesOptions = categories?.data?.map(
  //   (item: { _id: string; name: string }) => ({
  //     value: item._id,
  //     label: `${item.name}`,
  //   }),
  // );

  const { data: brands, isLoading: isBrandsLoading } =
    useGetAllBrandsQuery(undefined);

  const brandsOptions = brands?.data?.map(
    (item: { _id: string; name: string }) => ({
      value: item._id,
      label: `${item.name}`,
    }),
  );

  const handleTypeChange = (e: any) => {
    setIsPartial(e.target.checked);
  };

  const handleSubmit = async (values: any) => {
    const { type, categories, brands, ...rest } = values;
    const submissionData = {
      ...rest,
      type: isPartial ? "Partial" : "Full",
      ...(isPartial && { categories, brands }),
    };

    const toastId = toast.loading("Creating Stock Count");
    try {
      await createStock(submissionData).unwrap();
      toast.success("Stock Count created successfully");
      navigate("/dashboard/inventory/manage-stock");
    } catch (error: any) {
      toast.error(error.message || "An error occurred");
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Container
      pages={pages}
      pageTitle="Count Stock"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <AppForm onSubmit={handleSubmit}>
        <Row gutter={[16, 16]}>
          <Col span={12}>
            <AppDatePicker name="startDate" label="Stock Date" />
          </Col>
          <Col span={12}>
            <AppDatePicker name="endDate" label="End Date" />
          </Col>
          <Col span={24}>
            <AppInput
              type="text"
              name="reference"
              label="Reference"
              placeholder="Enter Reference"
            />
          </Col>
          <Col span={24}>
            <Form.Item
              name="type"
              label="Type"
              valuePropName="checked"
              className="mb-4"
            >
              <Checkbox onChange={handleTypeChange}>Partial</Checkbox>
            </Form.Item>
          </Col>
          {isPartial && (
            <>
              <Col span={24}>
                {/* <AppSelect
                  name="categories"
                  label="Category"
                  options={categoriesOptions}
                  loading={isCategoriesLoading}
                  mode="multiple"
                  placeholder="Select Category"
                /> */}
              </Col>
              <Col span={24}>
                <AppSelect
                  name="brands"
                  label="Brand"
                  options={brandsOptions}
                  loading={isBrandsLoading}
                  mode="multiple"
                  placeholder="Select Brand"
                />
              </Col>
            </>
          )}
          <Col span={24}>
            <Button
              type="primary"
              htmlType="submit"
              className="mt-4"
              loading={isCreating}
            >
              Submit
            </Button>
          </Col>
        </Row>
      </AppForm>
    </Container>
  );
};

export default CountStock;
