import Container from "../../../ui/Container";
import ExpenseTable from "./ExpenseTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchases/manage", current: false },
  {
    name: "List Expenses",
    href: "/dashboard/purchases/expenses/manage",
    current: true,
  },
];

const ManageExpenses = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add Expense"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <ExpenseTable />
    </Container>
  );
};

export default ManageExpenses;
