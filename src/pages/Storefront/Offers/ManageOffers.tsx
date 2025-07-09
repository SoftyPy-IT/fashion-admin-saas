import Container from "../../../ui/Container";
import OffersTable from "./OffersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Offers", href: "/dashboard/offers/manage", current: false },
  { name: "Manage Offers", href: "#", current: true },
];

const ManageOffers = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage Deals and Offers"
      pageHeadingHref="/dashboard/"
      pageHeadingButtonText="Go back to dashboard"
    >
      <OffersTable />
    </Container>
  );
};

export default ManageOffers;
