import Container from "../../../ui/Container";
import ProductsTable from "../../../components/data-display/ProductTable";
import {
  useGetAllProductQuery,
  useUpdateProductMutation,
} from "../../../redux/features/product/product.api";
import { useState } from "react";
import { TQueryParam } from "../../../types";
import FeaturedProductDrawer from "./FeaturedProductDrawer";
import { toast } from "sonner";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Storefront", href: "/dashboard/storefront/manage", current: false },
  { name: "Manage Storefront", href: "#", current: true },
];

const ManageFeaturedProducts = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [params, setParams] = useState<TQueryParam[]>([]);
  const [updateProduct] = useUpdateProductMutation();

  const {
    data: productData,
    isLoading,
    isFetching,
    refetch,
  } = useGetAllProductQuery([
    { name: "is_featured", value: "true" },
    ...params,
  ]);

  const tableData = productData?.data || [];
  const metaData = productData?.meta;

  const handleUpdate = async (id: string) => {
    const toastId = toast.loading("Updating");
    const data = {
      _id: id,
      is_featured: false,
    };
    try {
      await updateProduct(data).unwrap();
      toast.success("Product removed from featured successfully", {
        id: toastId,
        duration: 2000,
      });
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Container
      pages={pages}
      pageTitle="Manage Storefront featured products"
      pageHeadingHref="/dashboard/"
      pageHeadingButtonText="Go back to dashboard"
    >
      <ProductsTable
        data={tableData}
        loading={isLoading || isFetching}
        showDelete
        deleteText="Remove from featured"
        onDelete={handleUpdate}
        refetch={refetch}
        totalData={metaData?.total || 0}
        onPageChange={(page, pageSize) => {
          setParams([
            { name: "page", value: page.toString() },
            { name: "limit", value: pageSize.toString() },
          ]);
        }}
        onSearch={(value: string) => {
          setParams([{ name: "searchTerm", value }]);
        }}
        onCreateClick={() => {
          setModalVisible(true);
        }}
        titleText="featured products"
      />

      {modalVisible && (
        <FeaturedProductDrawer
          open={modalVisible}
          onClose={() => setModalVisible(false)}
        />
      )}
    </Container>
  );
};

export default ManageFeaturedProducts;
