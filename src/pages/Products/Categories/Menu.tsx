import Container from "../../../ui/Container";
import MegaMenu from "./CategoryTreeDrawer";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Categories", href: "#", current: true },
];

const Menu = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all the categories here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText="Go to Products"
    >
      <MegaMenu />
    </Container>
  );
};

export default Menu;
