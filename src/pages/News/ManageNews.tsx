import Container from "../../ui/Container";
import BlogsTable from "./BlogTable";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Manage Blogs", href: "#", current: true },
];

const ManageNews = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add News"
      pageHeadingHref="/dashboard/blogs/manage"
      pageHeadingButtonText="Go Back"
    >
      <BlogsTable />
    </Container>
  );
};

export default ManageNews;
