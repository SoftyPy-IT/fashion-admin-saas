import { Drawer, Row, Col, Button, Spin } from "antd";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  useGetSingleProductQuery,
  useUpdateProductMutation,
} from "../../../redux/features/product/product.api";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string | null;
  refetch: () => void;
  onUpdate?: (updatedProduct: any) => void; // Add this prop
}

const productSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  price: yup.number().required("Price is required"),
  discount_price: yup.number().required("Discount Price is required"),
});

const UpdateProductDrawer = ({
  open,
  onClose,
  productId,
  refetch,
  onUpdate, // Destructure the onUpdate prop
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const {
    data: productData,
    isLoading,
    isFetching,
    refetch: refetchProduct,
  } = useGetSingleProductQuery(productId) as any;

  useEffect(() => {
    if (open && productId) {
      refetchProduct();
    }
  }, [open, productId, refetchProduct]);

  const [updateProduct, { isLoading: updateLoading, isSuccess }] =
    useUpdateProductMutation();
  const resolver = useYupValidationResolver(productSchema);

  const handleUpdateSubmit = async (data: FieldValues) => {
    if (!productId) return;

    const toastId = toast.loading("Updating");
    try {
      const updateData = {
        _id: productId,
        ...data,
        productCost: Number(data.productCost),
        code: productData?.code,
      };

      const res = await updateProduct(updateData).unwrap();
      if (res.success) {
        toast.success("Product updated successfully", {
          id: toastId,
          duration: 2000,
        });
        onClose();
        refetch();
        onUpdate && onUpdate(updateData);
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources?.map((error: any) => error.message).join(", ")
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Drawer
      title="Update Product"
      placement="right"
      width="30%"
      onClose={onClose}
      open={open}
      size="large"
    >
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Product updated successfully" />
        )}
      </div>
      {isFetching || isLoading ? (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Spin />
        </div>
      ) : (
        <AppForm
          onSubmit={handleUpdateSubmit}
          defaultValues={{
            name: productData?.name,
            code: productData?.code,
            price: productData?.price,
            discount_price: productData?.discount_price,
            productCost: productData?.productCost,
          }}
          resolver={resolver}
        >
          <Row gutter={16}>
            <Col span={24}>
              <AppInput
                type="text"
                name="name"
                label="Name"
                placeholder="Product Name"
              />
            </Col>
            <Col span={24}>
              <AppInput
                type="number"
                name="price"
                label="Price"
                placeholder="Product Price"
              />
            </Col>
            <Col span={24}>
              <AppInput
                name="productCost"
                type="number"
                label="Unit Price"
                placeholder="Enter product cost"
              />
            </Col>
            <Col span={24}>
              <AppInput
                type="number"
                name="discount_price"
                label="Discount Price"
                placeholder="Discount Price"
              />
            </Col>
          </Row>
          <Button
            style={{ marginTop: 20, float: "right" }}
            className="btn"
            disabled={updateLoading}
            loading={updateLoading}
            htmlType="submit"
          >
            Update Product
          </Button>
        </AppForm>
      )}
    </Drawer>
  );
};

export default UpdateProductDrawer;
