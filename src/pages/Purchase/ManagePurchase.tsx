import Container from "../../ui/Container";
import PurchaseTable from "./PurchaseTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchase", current: true },
  { name: "Manage Purchase", href: "#", current: true },
];

const ManagePurchase = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Purchase"
      pageHeadingHref="/dashboard/purchases/new"
      pageHeadingButtonText="Add New Purchase"
    >
      <PurchaseTable />
    </Container>
  );
};

export default ManagePurchase;
