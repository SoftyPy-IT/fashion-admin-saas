import Container from "../../../ui/Container";
import CategoriesTable from "./CategoriesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Categories", href: "#", current: true },
];

const ManageCategories = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all the categories here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <CategoriesTable />
    </Container>
  );
};

export default ManageCategories;
