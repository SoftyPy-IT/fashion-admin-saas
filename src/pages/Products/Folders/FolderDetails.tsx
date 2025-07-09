import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductTable from "../../../components/data-display/ProductTable";
import Preloader from "../../../components/Preloader";
import { useGetFolderQuery } from "../../../redux/features/gallery/gallery.api";
import {
  useDeleteProductMutation,
  useGetAllProductQuery,
} from "../../../redux/features/product/product.api";
import { TQueryParam } from "../../../types";
import Container from "../../../ui/Container";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Products", href: "/dashboard/products/manage", current: false },
  { name: "Manage Products Folders", href: "#", current: true },
];

const FolderDetails = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetFolderQuery(id);
  const [deleteProduct] = useDeleteProductMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isFetching: productsFetching,
    refetch,
  } = useGetAllProductQuery([
    {
      name: "folder",
      value: id,
    },
    ...params,
  ]);
  const navigate = useNavigate();
  if (isLoading) {
    return <Preloader />;
  }

  const tableData = productsData?.data || [];
  const metaData = productsData?.meta;

  const handleDelete = async (id: string) => {
    const res = await deleteProduct(id).unwrap();
    return res.success;
  };

  return (
    <Container
      pages={pages}
      pageTitle={data?.data?.name}
      pageHeadingButtonText=""
      pageHeadingHref=""
    >
      <ProductTable
        data={tableData}
        loading={productsLoading || productsFetching}
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
        showDuplicate
        showUpdate={true}
        showDelete={true}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          navigate("/dashboard/products/add", {
            state: { folderId: id },
          });
        }}
        titleText="products"
        onDelete={handleDelete}
      />
    </Container>
  );
};

export default FolderDetails;
