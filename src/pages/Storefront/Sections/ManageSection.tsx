import Container from "../../../ui/Container";
import SectionsTable from "./SectionsTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Sections", href: "/dashboard/sections", current: false },
  { name: "Manage Section", href: "#", current: true },
];

const ManageSection = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Section"
      pageHeadingHref="/dashboard/"
      pageHeadingButtonText=""
    >
      <SectionsTable />
    </Container>
  );
};

export default ManageSection;
