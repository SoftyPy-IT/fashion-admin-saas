import Container from "../../../ui/Container";
import BillersTable from "./BillersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "People", href: "/dashboard/people", current: false },
  { name: "Manage Billers", href: "#", current: true },
];
const ManageBillers = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all billers here"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <BillersTable />
    </Container>
  );
};

export default ManageBillers;
