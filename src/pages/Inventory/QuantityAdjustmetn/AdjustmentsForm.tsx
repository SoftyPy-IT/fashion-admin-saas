import { TagsOutlined, UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Divider,
  Form,
  Input,
  Row,
  Select,
  Tag,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import AppDatePicker from "../../../components/form/AppDatePicker";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppTextArea from "../../../components/form/AppTextArea";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { useCreateAdjustmentMutation } from "../../../redux/features/inventory/quantity-adjustments.api";
import {
  useGetAllProductQuery,
  useGetSingleProductQuery,
} from "../../../redux/features/product/product.api";
import { TQueryParam } from "../../../types";
import { TAdjustmentData } from "./AdjustmantesTable";

const { Option } = Select;

// Enhanced schema to handle variants
const AdjustmentsFormSchema = yup.object().shape({
  date: yup.string().required("Date is required"),
  referenceNo: yup.string().required("Reference No is required"),
  attachDocument: yup.mixed().optional(),
  products: yup
    .array()
    .of(
      yup.object().shape({
        productId: yup.string().required("Product is required"),
        productName: yup.string().required("Product name is required"),
        productCode: yup.string().required("Product code is required"),
        type: yup.string().oneOf(["Subtraction", "Addition"]).required(),
        quantity: yup
          .number()
          .required("Quantity is required")
          .positive()
          .integer(),
        serialNumber: yup.string().optional(),
        variantName: yup.string().optional(),
        variantValue: yup.string().optional(),
      }),
    )
    .min(1, "At least one product is required"),
  note: yup.string().required("Note is required"),
});

interface AdjustmentsFormProps {
  initialValues?: TAdjustmentData;
}

// Extend the product field type to include variant information
interface ProductField {
  productId: string;
  productName: string;
  productCode: string;
  type: "Subtraction" | "Addition";
  quantity: number;
  serialNumber: string;
  hasVariants?: boolean;
  variantName?: string;
  variantValue?: string;
  availableVariants?: Array<{
    name: string;
    values: Array<{
      name: string;
      value: string;
      quantity: number;
    }>;
  }>;
}

const AdjustmentsForm = ({ initialValues }: AdjustmentsFormProps) => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
  } = useGetAllProductQuery([...params]) as any;

  const [createAdjustment, { isLoading: createAdjustmentLoading }] =
    useCreateAdjustmentMutation();

  const resolver = useYupValidationResolver(AdjustmentsFormSchema);
  const [productFields, setProductFields] = useState<ProductField[]>([]);
  const [fileList, setFileList] = useState<any>([]);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null,
  );

  // Use this to fetch detailed product info when needed
  const { data: selectedProductData } = useGetSingleProductQuery(
    selectedProductId as string,
    { skip: !selectedProductId },
  ) as any;

  // Effect to update product fields when selected product data changes
  useEffect(() => {
    if (selectedProductData && selectedProductId) {
      // Find the index of the product in productFields that matches selectedProductId
      const productIndex = productFields.findIndex(
        (p) => p.productId === selectedProductId,
      );

      if (productIndex !== -1) {
        // Update product with variant information
        const updatedFields = [...productFields];
        updatedFields[productIndex].hasVariants =
          selectedProductData.hasVariants;
        updatedFields[productIndex].availableVariants =
          selectedProductData.variants;
        setProductFields(updatedFields);
        setSelectedProductId(null); // Reset selected product ID
      }
    }
  }, [selectedProductData, selectedProductId]);

  const onAddProductField = (product: any) => {
    // Check if product already exists in the list
    const existingProductIndex = productFields.findIndex(
      (field) => field.productId === product.product._id && !field.variantName,
    );

    // If product already exists but doesn't have variants, just return
    if (existingProductIndex !== -1 && !product.product.hasVariants) {
      toast.info(`Product "${product.product.name}" is already in the list`);
      return;
    }

    const newProduct: ProductField = {
      productId: product.product._id,
      productName: product.product.name,
      productCode: product.product.code,
      type: "Addition",
      quantity: 1,
      serialNumber: "",
      hasVariants: product.product.hasVariants,
    };

    setProductFields([...productFields, newProduct]);

    // If product has variants, fetch detailed product info to get variant details
    if (product.product.hasVariants) {
      setSelectedProductId(product.product._id);
    }
  };

  const onRemoveProductField = (index: number) => {
    const newFields = [...productFields];
    newFields.splice(index, 1);
    setProductFields(newFields);
  };

  const navigate = useNavigate();

  const onSubmit = async (values: any) => {
    const toastId = toast.loading("Creating adjustment...");

    // Check for duplicate variants for the same product
    const productVariantMap = new Map();
    const duplicates: { productName: string; variant: string }[] = [];

    productFields.forEach((product) => {
      if (product.hasVariants && product.variantName && product.variantValue) {
        const key = `${product.productId}-${product.variantName}-${product.variantValue}`;
        if (productVariantMap.has(key)) {
          duplicates.push({
            productName: product.productName,
            variant: `${product.variantName}: ${product.variantValue}`,
          });
        } else {
          productVariantMap.set(key, true);
        }
      }
    });

    // Show error if duplicates found
    if (duplicates.length > 0) {
      toast.error(
        `Found duplicate variants: ${duplicates
          .map((d) => `${d.productName} (${d.variant})`)
          .join(", ")}`,
        { id: toastId },
      );
      return;
    }

    // Validate that products with variants have variant selections
    const hasInvalidVariants = productFields.some(
      (product) =>
        product.hasVariants && (!product.variantName || !product.variantValue),
    );

    if (hasInvalidVariants) {
      toast.error("Please select variants for all products that have them", {
        id: toastId,
      });
      return;
    }

    // Convert date to ISO string if it exists
    const finalData = {
      ...values,
      date: values.date ? new Date(values.date).toISOString() : "",
      products: productFields.map((product) => {
        const productData: any = {
          productId: product.productId,
          productName: product.productName,
          productCode: product.productCode,
          type: product.type,
          quantity: Number(product.quantity),
        };

        // Add variant data if present
        if (
          product.hasVariants &&
          product.variantName &&
          product.variantValue
        ) {
          productData.variantName = product.variantName;
          productData.variantValue = product.variantValue;
        }

        return productData;
      }),
    };

    const formData = new FormData();

    // Append finalData fields to formData
    for (const key in finalData) {
      if (key === "products") {
        finalData.products.forEach((product: any, index: number) => {
          for (const productKey in product) {
            formData.append(
              `products[${index}][${productKey}]`,
              product[productKey].toString(),
            );
          }
        });
      } else {
        formData.append(key, finalData[key].toString());
      }
    }

    // Append the attached document if any
    if (fileList.length > 0) {
      formData.append("attachDocument", fileList[0].originFileObj);
    }

    try {
      await createAdjustment(formData).unwrap();
      toast.success("Adjustment created successfully", { id: toastId });
      navigate("/dashboard/inventory/quanity-adjustment");
    } catch (error: any) {
      console.error("Error creating adjustment:", error);
      toast.error(error?.data?.message || "An error occurred", { id: toastId });
    }
  };

  const handleChange = (_value: string, option: any) => {
    onAddProductField(option);
  };

  const handleUploadChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // Helper to get variant quantity display
  const getVariantQuantityDisplay = (
    product: ProductField,
    variantName: string,
    variantValue: string,
  ) => {
    if (!product.availableVariants) return null;

    const variant = product.availableVariants.find(
      (v) => v.name === variantName,
    );
    if (!variant) return null;

    const value = variant.values.find(
      (v) => v.name === variantValue || v.value === variantValue,
    );
    if (!value) return null;

    return value.quantity;
  };

  return (
    <div>
      <AppForm
        onSubmit={onSubmit}
        resolver={resolver}
        defaultValues={initialValues || {}}
      >
        <Row gutter={16}>
          <Col span={24} sm={{ span: 24 }} xxl={{ span: 8 }}>
            <Form.Item name="date">
              <AppDatePicker label="Date" name="date" />
            </Form.Item>
          </Col>
          <Col span={24} sm={{ span: 24 }} xxl={{ span: 8 }}>
            <Form.Item name="referenceNo">
              <AppInput
                type="text"
                label="Reference No"
                name="referenceNo"
                placeholder="Reference No"
              />
            </Form.Item>
          </Col>
          <Col span={24} sm={{ span: 24 }} xxl={{ span: 8 }}>
            <Form.Item
              name="attachDocument"
              label="Attach Document"
              valuePropName="fileList"
              getValueFromEvent={(e) =>
                Array.isArray(e) ? e : e && e.fileList
              }
            >
              <Upload
                className="upload-list-inline"
                fileList={fileList}
                onChange={handleUploadChange}
                beforeUpload={() => false}
              >
                <Button icon={<UploadOutlined />}>Click to Upload</Button>
              </Upload>
            </Form.Item>
          </Col>
        </Row>

        <div className="p-4 mt-4 bg-gray-100 rounded-lg">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Products">
                <Select
                  allowClear
                  size="large"
                  showSearch
                  placeholder="Search and select products"
                  filterOption={false}
                  onSearch={(value) =>
                    setParams([{ name: "searchTerm", value }])
                  }
                  onChange={handleChange}
                  loading={productsLoading || productsFetching}
                  options={productsData?.data?.map(
                    (product: {
                      _id: string;
                      name: string;
                      hasVariants: boolean;
                    }) => ({
                      value: product._id,
                      label: (
                        <div>
                          {product.name}
                          {product.hasVariants && (
                            <Tag color="blue" className="ml-2">
                              <TagsOutlined /> Has Variants
                            </Tag>
                          )}
                        </div>
                      ),
                      product,
                    }),
                  )}
                />
              </Form.Item>
            </Col>
          </Row>

          {productFields.length > 0 && (
            <div className="pb-2">
              <Divider orientation="left">Selected Products</Divider>
            </div>
          )}

          {/* Group products by productId for UI organization */}
          {(() => {
            // Group products by their ID to show variants together
            const groupedProducts = productFields.reduce(
              (acc, field, index) => {
                if (!acc[field.productId]) {
                  acc[field.productId] = {
                    productName: field.productName,
                    productCode: field.productCode,
                    hasVariants: field.hasVariants,
                    availableVariants: field.availableVariants,
                    items: [],
                  };
                }
                acc[field.productId].items.push({ field, index });
                return acc;
              },
              {} as Record<
                string,
                {
                  productName: string;
                  productCode: string;
                  hasVariants: boolean | undefined;
                  availableVariants: any[] | undefined;
                  items: { field: ProductField; index: number }[];
                }
              >,
            );

            // Now render each product group
            return Object.entries(groupedProducts).map(([productId, group]) => (
              <div
                key={`group-${productId}`}
                className="p-4 mb-6 bg-white border rounded-lg"
              >
                <div className="pb-2 mb-3 border-b">
                  <Row gutter={16}>
                    <Col span={12}>
                      <h3 className="text-lg font-semibold">
                        {group.productName}
                      </h3>
                      <p className="text-gray-500">Code: {group.productCode}</p>
                    </Col>
                    <Col span={12} className="text-right">
                      {/* Add variant button */}
                      {group.hasVariants && group.availableVariants && (
                        <Button
                          type="primary"
                          onClick={() => {
                            // Add another variant of the same product
                            const newProduct: ProductField = {
                              productId,
                              productName: group.productName,
                              productCode: group.productCode,
                              type: "Addition",
                              quantity: 1,
                              serialNumber: "",
                              hasVariants: true,
                              availableVariants: group.availableVariants,
                            };
                            setProductFields([...productFields, newProduct]);
                          }}
                        >
                          Add Another Variant
                        </Button>
                      )}
                    </Col>
                  </Row>
                </div>

                {/* Now map through each item (variant or the main product) */}
                {group.items.map(({ field, index }) => (
                  <div
                    key={`item-${index}`}
                    className={`mb-4 ${index > 0 ? "pt-3 border-t" : ""}`}
                  >
                    <Row gutter={16}>
                      {/* If product has variants and the variantName and variantValue are set, show them */}
                      {field.hasVariants &&
                      field.variantName &&
                      field.variantValue ? (
                        <Col span={24} sm={{ span: 24 }} xxl={{ span: 12 }}>
                          <Tag color="blue" className="mb-2">
                            {field.variantName}: {field.variantValue}
                          </Tag>
                        </Col>
                      ) : field.hasVariants ? (
                        <Col span={24}>
                          <div className="mb-2">
                            <Tag color="orange">
                              Select Variant Details Below
                            </Tag>
                          </div>
                        </Col>
                      ) : null}
                    </Row>

                    <Row gutter={16}>
                      <Col span={24} sm={{ span: 12 }} xxl={{ span: 12 }}>
                        <Form.Item
                          label="Type"
                          name={`products[${index}].type`}
                          initialValue={field.type}
                        >
                          <Select
                            value={field.type}
                            onChange={(value) => {
                              const newFields = [...productFields];
                              newFields[index].type = value;
                              setProductFields(newFields);
                            }}
                          >
                            <Option value="Addition">Addition</Option>
                            <Option value="Subtraction">Subtraction</Option>
                          </Select>
                        </Form.Item>
                      </Col>
                      <Col span={24} sm={{ span: 12 }} xxl={{ span: 12 }}>
                        <Form.Item
                          label="Quantity"
                          name={`products[${index}].quantity`}
                          initialValue={field.quantity}
                        >
                          <Input
                            type="number"
                            value={field.quantity}
                            placeholder="Quantity"
                            onChange={(e) => {
                              const newFields = [...productFields];
                              newFields[index].quantity = Number(
                                e.target.value,
                              );
                              setProductFields(newFields);
                            }}
                          />
                        </Form.Item>
                      </Col>
                    </Row>

                    {/* Variant selection section */}
                    {field.hasVariants &&
                      field.availableVariants &&
                      field.availableVariants.length > 0 && (
                        <Row gutter={16} className="mt-2">
                          <Col span={24} sm={{ span: 12 }} xxl={{ span: 12 }}>
                            <Form.Item
                              label="Variant Type"
                              name={`products[${index}].variantName`}
                              initialValue={field.variantName}
                              rules={[
                                {
                                  required: true,
                                  message:
                                    "Variant type is required for this product",
                                },
                              ]}
                            >
                              <Select
                                placeholder="Select variant type"
                                onChange={(value) => {
                                  const newFields = [...productFields];
                                  newFields[index].variantName = value;
                                  newFields[index].variantValue = undefined; // Reset selected value when variant type changes
                                  setProductFields(newFields);
                                }}
                              >
                                {field.availableVariants.map((variant, i) => (
                                  <Option key={i} value={variant.name}>
                                    {variant.name}
                                  </Option>
                                ))}
                              </Select>
                            </Form.Item>
                          </Col>

                          <Col span={24} sm={{ span: 12 }} xxl={{ span: 12 }}>
                            <Form.Item
                              label="Variant Value"
                              name={`products[${index}].variantValue`}
                              initialValue={field.variantValue}
                              rules={[
                                {
                                  required: true,
                                  message: "Variant value is required",
                                },
                              ]}
                            >
                              <Select
                                placeholder={
                                  field.variantName
                                    ? `Select ${field.variantName} value`
                                    : "Select variant type first"
                                }
                                disabled={!field.variantName}
                                onChange={(value) => {
                                  const newFields = [...productFields];
                                  newFields[index].variantValue = value;
                                  setProductFields(newFields);
                                }}
                              >
                                {field.variantName &&
                                  field.availableVariants
                                    .find((v) => v.name === field.variantName)
                                    ?.values.map((value, i) => (
                                      <Option
                                        key={i}
                                        value={value.value || value.name}
                                      >
                                        {value.name} ({value.quantity} in stock)
                                      </Option>
                                    ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                      )}

                    {/* Current stock display */}
                    {field.hasVariants &&
                      field.variantName &&
                      field.variantValue && (
                        <div className="mt-2 ml-1">
                          <Tag color="green">
                            Current variant stock:{" "}
                            {getVariantQuantityDisplay(
                              field,
                              field.variantName,
                              field.variantValue,
                            ) || 0}{" "}
                            units
                          </Tag>
                        </div>
                      )}

                    <div className="mt-2 text-right">
                      <Button
                        danger
                        onClick={() => onRemoveProductField(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ));
          })()}
        </div>

        <Form.Item name="note" className="mt-4">
          <AppTextArea label="Note" name="note" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            loading={createAdjustmentLoading}
          >
            Submit Adjustment
          </Button>
        </Form.Item>
      </AppForm>
    </div>
  );
};

export default AdjustmentsForm;
