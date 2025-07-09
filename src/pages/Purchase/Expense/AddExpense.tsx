import Container from "../../../ui/Container";
import AddExpenseForm from "./AddExpenseForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchases/manage", current: false },
  {
    name: "Add Expenses",
    href: "/dashboard/purchases/expenses/new",
    current: true,
  },
];

const AddExpense = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add Expense"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <AddExpenseForm />
    </Container>
  );
};

export default AddExpense;
