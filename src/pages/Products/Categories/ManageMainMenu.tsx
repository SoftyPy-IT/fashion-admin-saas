import Container from "../../../ui/Container";
import MainCategoriesTable from "./MainCategoriesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Main Menu", href: "#", current: true },
];

const ManageMainMenu = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all the main menu here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <MainCategoriesTable />
    </Container>
  );
};

export default ManageMainMenu;
