import Container from "../../ui/Container";
import OrdersTable from "./OrdersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Orders", href: "/dashboard/orders/manage", current: false },
  { name: "Manage Orders", href: "#", current: true },
];

const ManageOrders = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all orders here"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <OrdersTable />
    </Container>
  );
};

export default ManageOrders;
