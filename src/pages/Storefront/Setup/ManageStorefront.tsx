import { Card, Empty, Skeleton } from "antd";
import Container from "../../../ui/Container";
import StorefrontData from "./StorefrontData";
import { useGetStorefrontDataQuery } from "../../../redux/features/storefront/storefront.api";
import SlidersList from "./SlidersList";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Gallery", href: "/dashboard/gallery/manage", current: false },
  { name: "Manage Gallery", href: "#", current: true },
];

const ManageStorefront = () => {
  const { data, isFetching, isLoading } = useGetStorefrontDataQuery(undefined);

  if (isLoading || isFetching) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Storefront"
        pageHeadingHref="/dashboard/"
        pageHeadingButtonText="Go back to dashboard"
      >
        <Card title="Storefront Information" bordered>
          <Skeleton active />
        </Card>
      </Container>
    );
  }

  if (!data) {
    return (
      <Container
        pages={pages}
        pageTitle="Manage Storefront"
        pageHeadingHref="/dashboard/"
        pageHeadingButtonText="Go back to dashboard"
      >
        <Empty description="No data found" />
      </Container>
    );
  }

  return (
    <Container
      pages={pages}
      pageTitle="Manage Storefront"
      pageHeadingHref="/dashboard/"
      pageHeadingButtonText="Go back to dashboard"
    >
      <Card title="Storefront Information" bordered>
        <StorefrontData data={data} />
      </Card>

      <SlidersList />
    </Container>
  );
};

export default ManageStorefront;
