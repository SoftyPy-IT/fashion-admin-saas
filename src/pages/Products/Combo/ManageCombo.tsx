import Container from "../../../ui/Container";
import ComboTable from "./ComboTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Units", href: "#", current: true },
];

const ManageCombo = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all units here"
      pageHeadingHref="/dashboard/products/manage"
      pageHeadingButtonText=""
    >
      <ComboTable />
    </Container>
  );
};

export default ManageCombo;
