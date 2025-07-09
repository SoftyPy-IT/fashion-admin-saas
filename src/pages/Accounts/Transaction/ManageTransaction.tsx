import Container from "../../../ui/Container";
import TransactionTable from "./TransactionTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Accounts", href: "/dashboard/accounts", current: false },
  {
    name: "Transaction",
    href: "/dashboard/accounts/transaction",
    current: true,
  },
];

const ManageTransaction = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Transaction"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <TransactionTable />
    </Container>
  );
};

export default ManageTransaction;
