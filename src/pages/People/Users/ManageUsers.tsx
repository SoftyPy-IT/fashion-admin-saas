import Container from "../../../ui/Container";
import UsersTable from "./UsersTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "People", href: "/dashboard/people", current: false },
  { name: "Manage Users", href: "#", current: true },
];

const ManageUsers = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Manage all users here"
      pageHeadingHref=""
      pageHeadingButtonText=""
    >
      <UsersTable />
    </Container>
  );
};

export default ManageUsers;
