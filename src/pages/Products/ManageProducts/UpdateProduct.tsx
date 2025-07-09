/* eslint-disable react-hooks/rules-of-hooks */
import { useParams } from "react-router-dom";
import Container from "../../../ui/Container";
import { useGetSingleProductQuery } from "../../../redux/features/product/product.api";
import ProductForm from "../AddProduct/ProductForm";
import { Spin, Alert } from "antd";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Products", href: "#", current: true },
];

const UpdateProduct = () => {
  const { id } = useParams();

  if (!id) return <Spin />;

  const {
    data: productData,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetSingleProductQuery(id, {
    refetchOnMountOrArgChange: true,
  }) as any;

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error?.message || "Failed to load product data"}
        type="error"
        showIcon
      />
    );
  }

  if (!productData) {
    return (
      <Alert
        message="Warning"
        description="Product data is empty. Please try again."
        type="warning"
        showIcon
      />
    );
  }

  return (
    <Container
      pages={pages}
      pageTitle="Update Product"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Manage Products"
    >
      <ProductForm
        initialValues={productData}
        productId={productData?._id || id}
        isLoading={isLoading || isFetching}
        needToUpdate={true}
      />
    </Container>
  );
};

export default UpdateProduct;
