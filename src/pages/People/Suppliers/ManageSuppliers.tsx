import Container from "../../../ui/Container";
import SuppliersTable from "./SuppliersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "People", href: "/dashboard/people", current: false },
  { name: "Manage Suppliers", href: "#", current: true },
];

const ManageSuppliers = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all suppliers here"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <SuppliersTable />
    </Container>
  );
};

export default ManageSuppliers;
