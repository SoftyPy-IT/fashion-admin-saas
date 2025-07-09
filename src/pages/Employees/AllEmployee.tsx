import Container from "../../ui/Container";

import EmployeeTable from "./_components/EmployeeTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Employees", href: "/dashboard/employees/manage", current: false },
  { name: "All Employees", href: "#", current: true },
];

const AllEmployee = () => {
  return (
    <>
      <Container
        pages={pages}
        pageTitle="All Employees"
        pageHeadingHref="/dashboard/employees/add"
        pageHeadingButtonText="Create Employee"
      >
        <EmployeeTable />
      </Container>
    </>
  );
};

export default AllEmployee;
