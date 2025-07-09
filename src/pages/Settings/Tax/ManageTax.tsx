import Container from "../../../ui/Container";
import TaxesTable from "./TaxTable";

const pages = [
  {
    name: "Dashboard",
    href: "/dashboard",
    current: false,
  },
  {
    name: "Settings",
    href: "/settings",
    current: false,
  },
  {
    name: "Tax",
    href: "/settings/tax",
    current: true,
  },
];

const ManageTax = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage your Tax here"
      pageHeadingHref="/dashboard"
      pageHeadingButtonText=""
    >
      <TaxesTable />
    </Container>
  );
};

export default ManageTax;
