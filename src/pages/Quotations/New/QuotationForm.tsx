import { Form, Button, Row, Col, Input, Space, Select } from "antd";
import { useState } from "react";
import AppForm from "../../../components/form/AppForm";
import AppDatePicker from "../../../components/form/AppDatePicker";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import AppSelectFile from "../../../components/form/AppSelectFile";
import AppTextArea from "../../../components/form/AppTextArea";
import { useGetAllTaxesQuery } from "../../../redux/features/settings/tax.api";
import { useGetAllSuppliersQuery } from "../../../redux/features/people/supplier.api";
import { useGetAllCustomersQuery } from "../../../redux/features/people/customers.api";
import { useGetAllBillersQuery } from "../../../redux/features/people/billers.api";
import { useGetAllProductQuery } from "../../../redux/features/product/product.api";
import { TQueryParam } from "../../../types";
import { toast } from "sonner";
import { useCreateQuotationMutation } from "../../../redux/features/quotaions/quotaions.api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";

const validationSchema = yup.object().shape({
  date: yup.string().required("Please select a date"),
  reference: yup.string().required("Please enter a reference"),
  biller: yup.string().required("Please select a biller"),
  customer: yup.string().required("Please select a customer"),
  supplier: yup.string().required("Please select a supplier"),
  tax: yup.string().optional(),
  discount: yup.number().optional(),
  shipping: yup.number().required("Please enter shipping cost"),
  status: yup.string().required("Please select a status"),
  note: yup.string().required("Note is required"),
  attachDocument: yup.mixed().required("Document is required").optional(),
  items: yup.array().of(
    yup.object().shape({
      product_id: yup.string().required("Product ID is required"),
      product_name: yup.string().required("Product Name is required"),
      product_code: yup.string().required("Product Code is required"),
      unit_price: yup.number().required("Unit Price is required"),
      quantity: yup.number().required("Quantity is required"),
      discount: yup.number().required("Discount is required"),
      tax: yup.number().required("Tax is required"),
      sub_total: yup.number().required("Sub Total is required"),
    })
  ),
});

const QuotationForm = () => {
  const { data: taxes, isLoading: taxesLoading } =
    useGetAllTaxesQuery(undefined);
  const { data: suppliers, isLoading: suppliersLoading } =
    useGetAllSuppliersQuery(undefined);
  const { data: customers, isLoading: customersLoading } =
    useGetAllCustomersQuery(undefined);
  const { data: billers, isLoading: billersLoading } =
    useGetAllBillersQuery(undefined);
  const [params, setParams] = useState<TQueryParam[]>([]);

  const { data: productsData, isLoading: productsLoading } =
    useGetAllProductQuery(params);

  const [createQuotation, { isLoading: isCreating }] =
    useCreateQuotationMutation();
  const navigate = useNavigate();

  const resolver = useYupValidationResolver(validationSchema);

  const [productFields, setProductFields] = useState([
    {
      product_id: "",
      product_name: "",
      product_code: "",
      unit_price: 0,
      quantity: 1,
      discount: 0,
      tax: 0,
      sub_total: 0,
    },
  ]);

  const onAddProductField = (product: any) => {
    setProductFields((prevFields) => [
      ...prevFields,
      {
        product_id: product.product._id,
        product_name: product.product.name,
        product_code: product.product.code,
        unit_price: product.product.productCost,
        quantity: 1,
        discount: 0,
        tax: 0,
        sub_total: product.product.productCost,
      },
    ]);
  };

  const onRemoveProductField = (index: number) => {
    setProductFields((prevFields) => prevFields.filter((_, i) => i !== index));
  };

  const handleProductChange = (_value: string, option: any) => {
    onAddProductField(option);
  };

  const onQuantityChange = (index: number, value: number) => {
    setProductFields((prevFields) =>
      prevFields.map((field, i) =>
        i === index
          ? { ...field, quantity: value, sub_total: field.unit_price * value }
          : field
      )
    );
  };

  const onFinish = async (values: any) => {
    const toastId = toast.loading("Creating adjustment...");

    const finalData = {
      ...values,
      date: values.date ? new Date(values.date).toISOString() : "",
      items: productFields.map((product) => ({
        ...product,
        quantity: Number(product.quantity), // Ensure quantity is a number
        unit_price: Number(product.unit_price), // Ensure unit_price is a number
        discount: Number(product.discount), // Ensure discount is a number
        tax: Number(product.tax), // Ensure tax is a number
        sub_total: Number(product.sub_total), // Ensure sub_total is a number
      })),
    };

    const formData = new FormData();

    for (const key in finalData) {
      if (key === "items") {
        finalData.items.forEach((product: any, index: number) => {
          for (const productKey in product) {
            formData.append(
              `items[${index}][${productKey}]`,
              product[productKey].toString() // Ensure conversion to string
            );
          }
        });
      } else {
        formData.append(key, finalData[key].toString());
      }
    }

    if (finalData.attachDocument) {
      formData.append(
        "attachDocument",
        finalData.attachDocument[0].originFileObj
      );
    }

    try {
      await createQuotation(formData).unwrap();
      toast.success("Adjustment created successfully", { id: toastId });
      navigate("/dashboard/quotations/manage");
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  const taxOptions = taxes?.data?.map((tax: any) => ({
    value: tax._id,
    label: `${tax.name} (${tax.rate}%)`,
  }));

  const supplierOptions = suppliers?.data?.map((supplier: any) => ({
    value: supplier._id,
    label: supplier.name,
  }));

  const customerOptions = customers?.data?.map((customer: any) => ({
    value: customer._id,
    label: customer.name,
  }));

  const billerOptions = billers?.data?.map((biller: any) => ({
    value: biller._id,
    label: biller.name,
  }));

  return (
    <AppForm onSubmit={onFinish} resolver={resolver}>
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AppDatePicker name="date" label="Date" />
        </Col>
        <Col span={8}>
          <AppInput
            type="text"
            name="reference"
            label="Reference"
            placeholder="Enter Reference"
          />
        </Col>
        <Col span={8}>
          <AppSelect
            name="biller"
            label="Biller"
            options={billerOptions}
            placeholder="Select Biller"
            loading={billersLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AppSelect
            name="customer"
            label="Customer"
            options={customerOptions}
            placeholder="Select Customer"
            loading={customersLoading}
          />
        </Col>
        <Col span={8}>
          <AppSelect
            name="supplier"
            label="Supplier"
            options={supplierOptions}
            placeholder="Select Supplier"
            loading={suppliersLoading}
          />
        </Col>
        <Col span={8}>
          <AppSelect
            name="tax"
            label="Tax"
            options={taxOptions}
            placeholder="Select Tax"
            loading={taxesLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AppInput
            name="discount"
            label="Discount"
            type="number"
            placeholder="Enter Discount"
          />
        </Col>
        <Col span={8}>
          <AppInput
            name="shipping"
            label="Shipping Cost"
            type="number"
            placeholder="Enter Shipping Cost"
          />
        </Col>
        <Col span={8}>
          <AppSelect
            name="status"
            label="Status"
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Sent", label: "Sent" },
              { value: "Accepted", label: "Accepted" },
              { value: "Rejected", label: "Rejected" },
            ]}
            placeholder="Select Status"
          />
        </Col>
      </Row>

      <div className="p-4 mt-4 bg-gray-100 rounded-lg">
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Products">
              <Select
                allowClear
                disabled={productsLoading}
                showSearch
                placeholder="Search and select products"
                filterOption={false}
                onSearch={(value) => setParams([{ name: "searchTerm", value }])}
                onChange={handleProductChange}
                loading={productsLoading}
                options={productsData?.data?.map((product: any) => ({
                  value: product._id,
                  label: product.name,
                  product,
                }))}
              />
            </Form.Item>
          </Col>
        </Row>

        {productFields.map((field, index) => (
          <Row gutter={16} key={index}>
            <Col span={8}>
              <Form.Item label="Product Name" initialValue={field.product_name}>
                <Input
                  value={field.product_name}
                  placeholder="Product Name"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Product Code" initialValue={field.product_code}>
                <Input
                  value={field.product_code}
                  placeholder="Product Code"
                  readOnly
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Space>
                <Form.Item label="Quantity" initialValue={field.quantity}>
                  <Input
                    type="number"
                    value={field.quantity}
                    onChange={(e) =>
                      onQuantityChange(index, parseInt(e.target.value))
                    }
                    placeholder="Quantity"
                  />
                </Form.Item>
                <Button
                  type="primary"
                  danger
                  onClick={() => onRemoveProductField(index)}
                >
                  Remove
                </Button>
              </Space>
            </Col>
          </Row>
        ))}
      </div>

      <Row gutter={[16, 16]} className="mt-5">
        <Col span={24}>
          <AppTextArea
            name="note"
            label="Note"
            placeholder="Enter any notes or instructions"
          />
        </Col>
        <Col span={8}>
          <AppSelectFile name="attachDocument" label="Attach Document" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isCreating}>
              Submit Quotation
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </AppForm>
  );
};

export default QuotationForm;
