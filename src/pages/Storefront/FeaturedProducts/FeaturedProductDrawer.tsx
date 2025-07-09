import { Drawer, Button } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import ProductSelectTable from "../../../components/data-display/ProductSelectTable";
import {
  useAddFeaturedProductsMutation,
  useGetAllProductQuery,
} from "../../../redux/features/product/product.api";
import { TQueryParam } from "../../../types";

interface Props {
  open: boolean;
  onClose: () => void;
}

const FeaturedProductDrawer = ({ open, onClose }: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [addFeaturedProducts, { isSuccess, isLoading }] =
    useAddFeaturedProductsMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);

  const {
    data: productData,
    isLoading: productLoading,
    isFetching: productFetching,
    refetch,
  } = useGetAllProductQuery([
    { name: "is_featured", value: "false" },
    ...params,
  ]);

  const tableData = productData?.data?.map(
    ({
      _id,
      name,
      thumbnail,
      price,
      discount_price,
      productCost,
      category,
      subCategory,
    }) => ({
      key: _id,
      name,
      thumbnail,
      price,
      discount_price,
      productCost,
      category,
      subCategory,
    })
  );
  const metaData = productData?.meta;

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  const onSubmit = async () => {
    const toastId = toast.loading("Creating");
    try {
      const data = {
        products: selectedProducts,
      };

      const res = await addFeaturedProducts(data).unwrap();
      if (res.success) {
        toast.success("Added product to featured products successfully", {
          id: toastId,
          duration: 2000,
        });
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources
          ?.map((error: any) => error.message)
          .join(", ") || "Something went wrong"
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const handleSearch = (searchTerm: string) => {
    setParams([
      {
        name: "searchTerm",
        value: searchTerm,
      },
    ]);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setParams([
      {
        name: "page",
        value: page,
      },
      {
        name: "limit",
        value: pageSize,
      },
    ]);
  };

  return (
    <Drawer
      title="Add product to featured products"
      placement="right"
      width="60%"
      onClose={onClose}
      open={open}
      size="large"
    >
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Added product to featured products successfully" />
        )}
      </div>

      <ProductSelectTable
        data={tableData || ([] as any)}
        total={metaData?.total || 0}
        loading={productLoading || productFetching}
        error={error}
        refetch={refetch}
        onSelect={(selected) => setSelectedProducts(selected)}
        onSearch={handleSearch}
        onPageChange={handlePageChange}
      />
      <Button
        onClick={onSubmit}
        style={{ marginTop: 20, float: "right" }}
        className="btn"
        disabled={isLoading}
        loading={isLoading}
      >
        Add Product to Featured
      </Button>
    </Drawer>
  );
};

export default FeaturedProductDrawer;
