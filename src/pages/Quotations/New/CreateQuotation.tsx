import Container from "../../../ui/Container";
import QuotationForm from "./QuotationForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Quotations", href: "/dashboard/quotations", current: false },
  { name: "Create", href: "", current: true },
];

const CreateQuotation = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Create Quotation"
      pageHeadingHref="/dashboard/quotations/manage"
      pageHeadingButtonText="Manage Quotations"
    >
      <QuotationForm />
    </Container>
  );
};

export default CreateQuotation;
