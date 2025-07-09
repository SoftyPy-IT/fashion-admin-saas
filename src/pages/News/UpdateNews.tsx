import { Alert, Spin } from "antd";
import { useParams } from "react-router-dom";
import { useGetSingleBlogQuery } from "../../redux/features/blog/blog.api";
import Container from "../../ui/Container";
import NewsForm from "./NewsForm";

const UpdateNews = () => {
  const { id } = useParams();

  if (!id) return <Spin />;

  const { data, isLoading, isFetching, isError, error } = useGetSingleBlogQuery(
    id,
    {
      refetchOnMountOrArgChange: true,
    },
  ) as any;
  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert
        message="Error"
        description={error?.message || "Failed to load product data"}
        type="error"
        showIcon
      />
    );
  }

  if (!data) {
    return (
      <Alert
        message="Warning"
        description="Product data is empty. Please try again."
        type="warning"
        showIcon
      />
    );
  }
  const pages = [
    { name: "Dashboard", href: "/dashboard", current: false },
    { name: "Manage Blogs", href: "#", current: true },
  ];

  return (
    <Container
      pages={pages}
      pageTitle="Add News"
      pageHeadingHref="/dashboard/blogs/manage"
      pageHeadingButtonText="Go Back"
    >
      <NewsForm initialValues={data} needToUpdate={true} />
    </Container>
  );
};

export default UpdateNews;
