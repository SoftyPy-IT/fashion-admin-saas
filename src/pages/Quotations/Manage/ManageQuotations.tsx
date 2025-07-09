import Container from "../../../ui/Container";
import QuotationsTable from "./QuotationsTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Quotations", href: "/dashboard/quotations/manage", current: false },
  { name: "Manage", href: "", current: true },
];

const ManageQuotations = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Quotations"
      pageHeadingHref="/dashboard/quotations/new"
      pageHeadingButtonText="New Quotation"
    >
      <QuotationsTable />
    </Container>
  );
};

export default ManageQuotations;
