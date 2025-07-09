import Container from "../../../ui/Container";
import ExpenseCategoriesTable from "./ExpenseCategoriestable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchase", current: true },
  { name: "Manage Expense Categories", href: "#", current: true },
];

const ManageExpenseCategory = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Expense Categories"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <ExpenseCategoriesTable />
    </Container>
  );
};

export default ManageExpenseCategory;
