import { useNavigate } from "react-router-dom";
import Container from "../../../ui/Container";
import ProductsTable from "../../../components/data-display/ProductTable";
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
} from "../../../redux/features/product/product.api";
import { useState } from "react";
import { TQueryParam } from "../../../types";
const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Products", href: "#", current: true },
];

const ManageProducts = () => {
  const navigate = useNavigate();

  const [deleteProduct] = useDeleteProductMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const {
    data: productData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductQuery([...params]);

  const tableData = productData?.data || [];
  const metaData = productData?.meta;

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id).unwrap();
    return res.success;
  };

  // serial numbering for the table with pagination

  return (
    <Container
      pages={pages}
      pageTitle="Manage all the products here"
      pageHeadingHref="/dashboard/products/add"
      pageHeadingButtonText="Add Product"
    >
      <ProductsTable
        data={tableData}
        loading={isLoading || isFetching}
        refetch={refetch}
        totalData={metaData?.total || 0}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            { name: "limit", value: pageSize.toString() },
          ]);
        }}
        page={metaData?.page || 1}
        pageSize={metaData?.limit || 10}
        showUpdate={true}
        showDelete={true}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          navigate("/dashboard/products/add");
        }}
        titleText="products"
        onDelete={handleDelete}
        showDuplicate={true}
      />
    </Container>
  );
};

export default ManageProducts;
