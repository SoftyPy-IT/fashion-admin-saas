import Container from "../../../ui/Container";
import CouponsTable from "./CouponTable";

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
    name: "Manage all coupons",
    href: "/settings/coupon",
    current: true,
  },
];

const ManageCoupon = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all coupons"
      pageHeadingHref="/dashboard"
      pageHeadingButtonText=""
    >
      <CouponsTable />
    </Container>
  );
};

export default ManageCoupon;
