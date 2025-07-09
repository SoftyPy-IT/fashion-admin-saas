import Container from "../../../ui/Container";
import AttributesTable from "./AttributesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Product Attributes", href: "#", current: true },
];

const ManageAttributes = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all product attributes here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <AttributesTable />
    </Container>
  );
};

export default ManageAttributes;
