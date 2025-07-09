import Container from "../../../ui/Container";
import CustomersTable from "./CustomersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "People", href: "/dashboard/people", current: false },
  { name: "Manage Customers", href: "#", current: true },
];

const ManageCustomers = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all customers here"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <CustomersTable />
    </Container>
  );
};

export default ManageCustomers;
