import Container from "../../../ui/Container";
import AdjustmentsTable from "./AdjustmantesTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Quantity Adjustment", href: "#", current: true },
];

const ManageQuantityAdjustment = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Quantity Adjustment"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <AdjustmentsTable />
    </Container>
  );
};

export default ManageQuantityAdjustment;
