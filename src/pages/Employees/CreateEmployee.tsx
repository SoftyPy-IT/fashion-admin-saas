import Container from "../../ui/Container";
import CreateEmployeeForm from "./_components/CreateEmployeeForm";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Employees", href: "/dashboard/employees/manage", current: false },
  { name: "Create", href: "#", current: true },
];

const initialValues = {
  givenName: "",
  surName: "",
  phone: "",
  email: "",
  gender: "",
  birthDate: "",
  designation: "",
  country: "",
  city: "",
  address: "",
  image: "",
  password: "",
};

const CreateEmployee = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add new employee"
      pageHeadingHref="/dashboard/employees/manage"
      pageHeadingButtonText="Back to Employees"
    >
      <CreateEmployeeForm initialValues={initialValues} />
    </Container>
  );
};

export default CreateEmployee;
