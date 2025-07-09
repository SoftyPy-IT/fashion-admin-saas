import { Form, Button, Row, Col, Input, Space, Select } from "antd";
import { Key, useState } from "react";

import { toast } from "sonner";
import { useCreatePurchaseMutation } from "../../redux/features/purchase/purchase.api";
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import useYupValidationResolver from "../../libs/useYupValidationResolver";
import { useGetAllProductQuery } from "../../redux/features/product/product.api";
import { TQueryParam } from "../../types";
import { useGetAllSuppliersQuery } from "../../redux/features/people/supplier.api";
import { useGetAllTaxesQuery } from "../../redux/features/settings/tax.api";
import AppInput from "../../components/form/AppInput";
import AppSelect from "../../components/form/AppSelect";
import AppTextArea from "../../components/form/AppTextArea";
import AppSelectFile from "../../components/form/AppSelectFile";
import AppForm from "../../components/form/AppForm";
import AppDatePicker from "../../components/form/AppDatePicker";
import UpdateProductDrawer from "../Storefront/Offers/UpdateProductDrawer";
import { ValueType } from "rc-input/lib/interface";

const validationSchema = yup.object().shape({
  date: yup.string().required("Please select a date"),
  reference: yup.string().required("Please enter a reference"),
  status: yup.string().required("Please select a status"),
  supplier: yup.string().required("Please select a supplier"),
  orderTax: yup.string().optional(),
  discount: yup.number().optional(),
  shipping: yup.number().required("Please enter shipping cost"),
  paymentTerms: yup.string().optional(),
  note: yup.string().optional(),
  attachDocument: yup.mixed().optional(),
  items: yup.array().of(
    yup.object().shape({
      product_id: yup.string().required("Product ID is required"),
      product_name: yup.string().required("Product Name is required"),
      product_code: yup.string().required("Product Code is required"),
      unit_price: yup.number().required("Unit Price is required"),
      quantity: yup.number().required("Quantity is required"),
      discount: yup.number().optional(),
      tax: yup.number().optional(),
      sub_total: yup.number().required("Sub Total is required"),
    }),
  ),
});

const PurchaseForm = () => {
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(
    null,
  );
  const [productFields, setProductFields] = useState<any>([]);

  const { data: taxes, isLoading: taxesLoading } =
    useGetAllTaxesQuery(undefined);
  const { data: suppliers, isLoading: suppliersLoading } =
    useGetAllSuppliersQuery(undefined);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: productsData,
    isLoading: productsLoading,
    refetch,
  } = useGetAllProductQuery(params);

  const [createPurchase, { isLoading: isCreating }] =
    useCreatePurchaseMutation();
  const navigate = useNavigate();
  const resolver = useYupValidationResolver(validationSchema);

  const onAddProductField = (product: any) => {
    setProductFields((prevFields: any) => [
      ...prevFields,
      {
        product_id: product?.product._id,
        product_name: product?.product.name,
        product_code: product?.product.code,
        unit_price: product?.product.productCost,
        quantity: 1,
        discount: 0,
        tax: 0,
        sub_total: product?.product.productCost,
        productCost: product?.product.productCost,
      },
    ]);
  };

  const onRemoveProductField = (index: number) => {
    setProductFields((prevFields: any[]) =>
      prevFields.filter((_: any, i: number) => i !== index),
    );
  };

  const handleProductChange = (_value: string, option: any) => {
    onAddProductField(option);
  };

  const onQuantityChange = (index: number, value: number) => {
    setProductFields((prevFields: any[]) =>
      prevFields.map((field: { unit_price: number }, i: number) =>
        i === index
          ? { ...field, quantity: value, sub_total: field.unit_price * value }
          : field,
      ),
    );
  };

  const onEditProduct = (index: number) => {
    setCurrentProductIndex(index);
    setUpdateModalVisible(true);
  };

  const handleUpdateProduct = (updatedProduct: any) => {
    if (currentProductIndex !== null) {
      setProductFields((prevFields: any[]) =>
        prevFields.map((field: { quantity: number }, index: number) =>
          index === currentProductIndex
            ? {
                ...field,
                product_name: updatedProduct.name,
                product_code: updatedProduct.code, // Ensure correct key
                unit_price: updatedProduct.productCost,
                sub_total: updatedProduct.productCost * field.quantity,
                productCost: updatedProduct.productCost,
              }
            : field,
        ),
      );
    }
    setUpdateModalVisible(false);
  };

  const onFinish = async (values: any) => {
    const toastId = toast.loading("Creating purchase...");

    const finalData = {
      ...values,
      date: values.date ? new Date(values.date).toISOString() : "",
      items: productFields.map(
        (product: {
          quantity: any;
          unit_price: any;
          discount: any;
          tax: any;
          sub_total: any;
        }) => ({
          ...product,
          quantity: Number(product.quantity),
          unit_price: Number(product.unit_price),
          discount: Number(product.discount),
          tax: Number(product.tax),
          sub_total: Number(product.sub_total),
        }),
      ),
    };

    const formData = new FormData();

    for (const key in finalData) {
      if (key === "items") {
        finalData.items.forEach((product: any, index: number) => {
          for (const productKey in product) {
            formData.append(
              `items[${index}][${productKey}]`,
              product[productKey].toString(),
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
        finalData.attachDocument[0].originFileObj,
      );
    }

    try {
      await createPurchase(formData).unwrap();
      toast.success("Purchase created successfully", { id: toastId });
      navigate("/dashboard/purchases/manage");
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
            name="supplier"
            label="Supplier"
            options={supplierOptions}
            placeholder="Select Supplier"
            loading={suppliersLoading}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AppSelect
            name="orderTax"
            label="Order Tax"
            options={taxOptions}
            placeholder="Select Tax"
            loading={taxesLoading}
          />
        </Col>
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
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={8}>
          <AppInput
            name="paymentTerms"
            label="Payment Terms"
            type="text"
            placeholder="Enter Payment Terms"
          />
        </Col>
        <Col span={8}>
          <AppSelect
            name="status"
            label="Status"
            options={[
              { value: "Pending", label: "Pending" },
              { value: "Ordered", label: "Ordered" },
              { value: "Received", label: "Received" },
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
                onClear={
                  productFields.length > 1
                    ? () => setProductFields([productFields[0]])
                    : undefined
                }
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

        {productFields.map(
          (
            field: {
              product_name: ValueType;
              product_code: ValueType;
              productCost: ValueType;
              quantity: ValueType;
            },
            index: Key | null | undefined,
          ) => (
            <Row gutter={16} key={index}>
              <Col span={8}>
                <Form.Item
                  label="Product Name"
                  initialValue={field.product_name}
                >
                  <Input
                    value={field.product_name}
                    placeholder="Product Name"
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  label="Product Code"
                  initialValue={field.product_code}
                >
                  <Input
                    value={field.product_code}
                    placeholder="Product Code"
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Form.Item
                  label="Product Cost"
                  initialValue={field.productCost}
                >
                  <Input
                    value={field.productCost}
                    placeholder="Product Cost"
                    readOnly
                  />
                </Form.Item>
              </Col>
              <Col span={4}>
                <Space>
                  <Form.Item label="Quantity" initialValue={field.quantity}>
                    <Input
                      type="number"
                      value={field.quantity}
                      onChange={(e) =>
                        onQuantityChange(
                          index as number,
                          parseInt(e.target.value),
                        )
                      }
                      placeholder="Quantity"
                    />
                  </Form.Item>
                  <Button
                    type="primary"
                    onClick={() => onEditProduct(index as number)}
                  >
                    Edit
                  </Button>
                  <Button
                    type="primary"
                    danger
                    onClick={() => onRemoveProductField(index as number)}
                  >
                    Remove
                  </Button>
                </Space>
              </Col>
            </Row>
          ),
        )}
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
              Submit Purchase
            </Button>
          </Form.Item>
        </Col>
      </Row>

      {updateModalVisible && currentProductIndex !== null && (
        <UpdateProductDrawer
          open={updateModalVisible}
          onClose={() => setUpdateModalVisible(false)}
          productId={productFields[currentProductIndex].product_id}
          refetch={refetch}
          onUpdate={handleUpdateProduct}
        />
      )}
    </AppForm>
  );
};

export default PurchaseForm;
