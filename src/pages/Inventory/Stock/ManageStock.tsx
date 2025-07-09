import Container from "../../../ui/Container";
import StockTable from "./StockTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Manage Stock", href: "#", current: true },
];

const ManageStock = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Stock"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <StockTable />
    </Container>
  );
};

export default ManageStock;
