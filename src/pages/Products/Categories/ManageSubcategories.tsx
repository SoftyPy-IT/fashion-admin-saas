import Container from "../../../ui/Container";
import SubCategoriesTable from "./SubCategoriesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Sub Categories", href: "#", current: true },
];

const ManageSubcategories = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all the categories here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <SubCategoriesTable />
    </Container>
  );
};

export default ManageSubcategories;
