import { useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Skeleton } from "antd";
import {
  useGetOfferQuery,
  useUpdateOfferMutation,
} from "../../../redux/features/storefront/offers.api";
import ProductsTable from "../../../components/data-display/ProductTable";
import Container from "../../../ui/Container";
import { TQueryParam } from "../../../types";
import { toast } from "sonner";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Offers", href: "/dashboard/offers/manage", current: false },
  { name: "Manage Offers", href: "#", current: true },
];

const OfferDetails = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);

  const { id } = useParams();
  const { data, isLoading, isFetching, refetch } = useGetOfferQuery([
    ...params,
    { name: "offerId", value: id },
  ]);

  const offerData = data?.data || ([] as any);
  const metaData = offerData?.meta;
  const productsData = offerData?.products?.products || [];

  const [updateOffer] = useUpdateOfferMutation();

  const handleRemoveProduct = async (productId: string) => {
    const toastId = toast.loading("Removing product from offer");
    console.log("productId", productId);
    try {
      const data = {
        id,
        productId,
        action: "remove",
      };
      const res = await updateOffer(data).unwrap();

      if (res.success === true) {
        toast.success("Product removed from offer successfully", {
          id: toastId,
          duration: 2000,
        });
      }
      refetch();
    } catch (error) {
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  return (
    <Container
      pages={pages}
      pageTitle="Manage Deals and Offers"
      pageHeadingHref="/dashboard/storefront/deals-offers"
      pageHeadingButtonText="Go back"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton active />
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg">
          <Descriptions title="Offer Details" bordered column={2}>
            <Descriptions.Item label="Title">
              {offerData?.title}
            </Descriptions.Item>
            <Descriptions.Item label="Subtitle">
              {offerData?.subTitle}
            </Descriptions.Item>
            <Descriptions.Item label="Start Date">
              {new Date(offerData?.startDate).toLocaleDateString()}
            </Descriptions.Item>
            <Descriptions.Item label="End Date">
              {new Date(offerData?.endDate).toLocaleDateString()}
            </Descriptions.Item>
          </Descriptions>

          <div className="mt-6">
            <ProductsTable
              data={productsData}
              loading={isFetching}
              refetch={refetch}
              onDelete={handleRemoveProduct}
              totalData={metaData?.total || 0}
              showDelete
              deleteText="Remove from offer"
              onPageChange={(page, pageSize) => {
                setParams([
                  { name: "page", value: page.toString() },
                  { name: "limit", value: pageSize.toString() },
                ]);
              }}
              onSearch={(value: string) => {
                setParams([{ name: "searchTerm", value }]);
              }}
            />
          </div>
        </div>
      )}
    </Container>
  );
};

export default OfferDetails;
