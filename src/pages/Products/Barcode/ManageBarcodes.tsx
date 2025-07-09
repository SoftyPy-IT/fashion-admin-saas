import Container from "../../../ui/Container";
import BarcodesTable from "./BarcodesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products", current: false },
  { name: "Manage Barcodes", href: "#", current: true },
];

const ManageBarcodes = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Products Barcodes"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go back to Products"
    >
      <BarcodesTable />
    </Container>
  );
};

export default ManageBarcodes;
