import NewsForm from "./NewsForm";
import Container from "../../ui/Container";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Manage Blogs", href: "#", current: true },
];

const AddNews = () => {
  return (
    <Container
      pages={pages}
      pageTitle="Add News"
      pageHeadingHref="/dashboard/blogs/manage"
      pageHeadingButtonText="Go Back"
    >
      <NewsForm />
    </Container>
  );
};

export default AddNews;
