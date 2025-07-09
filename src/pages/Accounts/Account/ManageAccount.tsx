import Container from "../../../ui/Container";
import AccountTable from "./AccountTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Accounts", href: "/dashboard/accounts", current: true },
];

const ManageAccount = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Account"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <AccountTable />
    </Container>
  );
};

export default ManageAccount;
