import Container from "../../../ui/Container";
import AdjustmentsForm from "./AdjustmentsForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Inventory", href: "/dashboard/inventory", current: false },
  { name: "Add Adjustment", href: "#", current: true },
];

const AddAdjustment = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Quantity Adjustment"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <AdjustmentsForm />
    </Container>
  );
};

export default AddAdjustment;
