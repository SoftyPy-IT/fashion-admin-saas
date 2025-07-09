import Container from "../../../ui/Container";
import BrandsTable from "./BrandsTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Brands", href: "#", current: true },
];

const ManageBrands = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all the brands here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <BrandsTable />
    </Container>
  );
};

export default ManageBrands;
