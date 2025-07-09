import { useParams } from "react-router-dom";
import Container from "../../../ui/Container";
import { useGetProductDetailsQuery } from "../../../redux/features/product/product.api";
import ProductDetailsPage from "./ProductDetailsPage";
import { Spin } from "antd";
import { useEffect } from "react";

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const { data, isLoading, isFetching, refetch } =
    useGetProductDetailsQuery(id);
  const productData = data as any;

  useEffect(() => {
    refetch();
  }, [id, refetch]);

  const pages = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Products", href: "/dashboard/products/manage", current: false },
    { name: "Manage Products", href: "#", current: true },
  ];

  if (!productData) return null;
  return (
    <Container
      pages={pages}
      pageTitle={`Product Details: ${productData?.product?.name}`}
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Manage Products"
    >
      {isLoading || isFetching ? (
        <div className="flex items-center justify-center h-64">
          {" "}
          <Spin size="large" />
        </div>
      ) : (
        <ProductDetailsPage product={productData.product} />
      )}
    </Container>
  );
};

export default ProductDetails;
