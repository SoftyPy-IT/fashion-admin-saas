import { useLocation } from "react-router-dom";
import Container from "../../../ui/Container";
import ProductForm from "./ProductForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Add Product", href: "#", current: true },
];

const AddProduct = () => {
  const { state } = useLocation();

  return (
    <Container
      pages={pages}
      pageTitle="Create a new product"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Manage Products"
    >
      <ProductForm
        folderId={state && state.folderId ? state.folderId : undefined}
      />
    </Container>
  );
};

export default AddProduct;
