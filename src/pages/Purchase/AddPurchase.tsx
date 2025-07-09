import Container from "../../ui/Container";
import PurchaseForm from "./PurchaseForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Purchase", href: "/dashboard/purchase", current: true },
  { name: "Manage Purchase", href: "#", current: true },
];

const AddPurchase = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add Purchase"
      pageHeadingHref="/dashboard/purchases/manage"
      pageHeadingButtonText="Go Back"
    >
      <PurchaseForm />
    </Container>
  );
};

export default AddPurchase;
