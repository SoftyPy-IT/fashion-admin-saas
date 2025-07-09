import Container from "../../../ui/Container";
import UnitsTable from "./UnitsTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Units", href: "#", current: true },
];

const ManageUnits = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all units here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText=""
    >
      <UnitsTable />
    </Container>
  );
};

export default ManageUnits;
