import { useState } from "react";
import { useParams } from "react-router-dom";
import { Descriptions, Skeleton, Image, Space } from "antd";
import {
  useGetSectionQuery,
  useUpdateSectionMutation,
} from "../../../redux/features/storefront/sections.api";
import ProductsTable from "../../../components/data-display/ProductTable";
import Container from "../../../ui/Container";
import { TQueryParam } from "../../../types";
import { toast } from "sonner";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Sections", href: "/dashboard/sections/manage", current: false },
  { name: "Manage Sections", href: "#", current: true },
];

const SectionDetails = () => {
  const [params, setParams] = useState<TQueryParam[]>([]);
  const { id } = useParams();
  const { data, isLoading, isFetching, refetch } = useGetSectionQuery([
    ...params,
    { name: "sectionId", value: id },
  ]) as any;

  const sectionData = data?.data || {};
  const metaData = data?.meta;
  const productsData = sectionData?.products?.products || [];

  const [updateSection] = useUpdateSectionMutation();

  const handleRemoveProduct = async (productId: string) => {
    const toastId = toast.loading("Removing product from section");
    try {
      const data = {
        id,
        productId,
        action: "remove",
      };
      const res = await updateSection(data).unwrap();

      if (res.success === true) {
        toast.success("Product removed from section successfully", {
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
      pageTitle="Manage Sections"
      pageHeadingHref="/dashboard/storefront/sections"
      pageHeadingButtonText="Go back"
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton active />
        </div>
      ) : (
        <div className="p-6 bg-white rounded-lg">
          <Descriptions title="Section Details" bordered column={2}>
            <Descriptions.Item label="Title">
              {sectionData?.title || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Subtitle">
              {sectionData?.subTitle || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {sectionData?.description || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Status">
              {sectionData?.status === "active" ? "Active" : "Inactive"}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {sectionData?.type || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Style">
              {sectionData?.style || "N/A"}
            </Descriptions.Item>
          </Descriptions>

          {/* Conditionally render content based on the section type */}
          {sectionData?.type === "banner" ? (
            // If the section is a banner, show the images
            <div className="mt-6">
              <h4>Banner Images</h4>
              <Space direction="vertical" size="middle">
                {/* Desktop Images */}
                <div>
                  <strong>Desktop Images:</strong>
                  <Space wrap>
                    {sectionData?.images?.desktop?.map(
                      (img: string, idx: number) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Desktop Image ${idx + 1}`}
                          width={150}
                        />
                      )
                    )}
                  </Space>
                </div>
                {/* Mobile Images */}
                <div>
                  <strong>Mobile Images:</strong>
                  <Space wrap>
                    {sectionData?.images?.mobile?.map(
                      (img: string, idx: number) => (
                        <Image
                          key={idx}
                          src={img}
                          alt={`Mobile Image ${idx + 1}`}
                          width={150}
                        />
                      )
                    )}
                  </Space>
                </div>
              </Space>
            </div>
          ) : sectionData?.type === "product" ? (
            // If the section is a product section, show the products table
            <div className="mt-6">
              <ProductsTable
                data={productsData}
                loading={isFetching}
                refetch={refetch}
                onDelete={handleRemoveProduct}
                totalData={metaData?.total || 0}
                showDelete
                deleteText="Remove from section"
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
          ) : (
            <p>No data available for this section type.</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default SectionDetails;
