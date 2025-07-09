import Container from "../../ui/Container";
import EmployeeTab from "./_components/EmployeeTab";
import ProfileCard from "./_components/ProfileCard";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Employees", href: "/dashboard/employees/manage", current: false },
  {
    name: "Employee Profile",
    href: "/dashboard/employees/profile",
    current: true,
  },
];

const EmployeeProfile = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Employee Profile"
      pageHeadingHref="/dashboard/employees/manage"
      pageHeadingButtonText="Manage Employees"
    >
      <ProfileCard />
      <EmployeeTab />
    </Container>
  );
};

export default EmployeeProfile;
