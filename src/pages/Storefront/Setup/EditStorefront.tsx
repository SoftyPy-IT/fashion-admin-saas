import { Button, Col, Divider, Image, Row, Skeleton } from "antd";
import { useState } from "react";
import { IoCloudUploadOutline } from "react-icons/io5";
import { toast } from "sonner";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import Editor from "../../../components/editor/inde";
import ErrorMessage from "../../../components/ErrorMessage";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppTextArea from "../../../components/form/AppTextArea";
import SuccessMessage from "../../../components/SuccessMessage";
import {
  useGetStorefrontDataQuery,
  useUpdateStorefrontDataMutation,
} from "../../../redux/features/storefront/storefront.api";
import Container from "../../../ui/Container";
import FaqSection from "../../Products/AddProduct/FaqSection";

const pages = [
  { name: "Dashboard", href: "/dashboard", current: false },
  { name: "Settings", href: "/dashboard/settings", current: false },
  {
    name: "Storefront",
    href: "/dashboard/settings/storefront",
    current: false,
  },
  { name: "Edit Storefront data", href: "#", current: true },
];

const EditStorefront = () => {
  const [error, setError] = useState<any | null>(null);
  const { data, isFetching, isLoading } = useGetStorefrontDataQuery(
    undefined,
  ) as any;
  const [image, setImage] = useState<any | null>(data?.logo || null);
  const [openImageModal, setOpenImageModal] = useState(false);
  const [
    updateStorefrontData,
    { isLoading: isUpdatingStorefrontData, isSuccess },
  ] = useUpdateStorefrontDataMutation();

  if (isLoading || isFetching) {
    return (
      <Container
        pages={pages}
        pageTitle="Edit Storefront data"
        pageHeadingHref="/dashboard/settings/storefront"
        pageHeadingButtonText="Go back"
      >
        <Skeleton active />
        <Skeleton active />
      </Container>
    );
  }

  const defaultValues = {
    shopName: data?.shopName,
    description: data?.description,
    contact: {
      email: data?.contact.email,
      phone: data?.contact.phone,
      address: data?.contact.address,
    },
    socialMedia: {
      facebook: data?.socialMedia.facebook,
      twitter: data?.socialMedia.twitter,
      instagram: data?.socialMedia.instagram,
      linkedin: data?.socialMedia.linkedin,
      youtube: data?.socialMedia.youtube,
    },
    pages: {
      aboutUs: data?.pages.aboutUs,
      termsAndConditions: data?.pages.termsAndConditions,
      privacyPolicy: data?.pages.privacyPolicy,
      refundPolicy: data?.pages.refundPolicy,
    },
    faq: data?.faq || [],
    logo: data?.logo,
    sliders: data?.sliders || [],
  };

  const onSubmit = async (values: any) => {
    const toastId = toast.loading("Updating data...");
    try {
      const dataToUpdate = {
        id: data._id,
        ...values,
        logo: image,
      };
      const res = await updateStorefrontData(dataToUpdate).unwrap();
      if (res.success === true) {
        toast.success("Storefront data updated successfully", {
          id: toastId,
          duration: 2000,
        });
        setError(null);
      }
    } catch (error: any) {
      setError(
        error?.data.errorSources
          .map((error: any) => error.message)
          .join(", ") || "Something went wrong",
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <Container
      pages={pages}
      pageTitle="Edit Storefront data"
      pageHeadingHref="/dashboard/storefront/manage"
      pageHeadingButtonText="Go back"
    >
      <div className="mb-4">
        {error && <ErrorMessage errorMessage={error} />}
        {isSuccess && (
          <SuccessMessage successMessage="Storefront data updated successfully" />
        )}
      </div>
      <AppForm onSubmit={onSubmit} defaultValues={defaultValues}>
        <Divider>Basic Info</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <AppInput
              label="Shop Name"
              name="shopName"
              placeholder="Enter shop name"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="Email"
              name="contact.email"
              placeholder="Enter email"
              type="email"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="Phone"
              name="contact.phone"
              placeholder="Enter phone"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="Address"
              name="contact.address"
              placeholder="Enter address"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppTextArea
              label="Description"
              name="description"
              placeholder="Enter description"
            />
          </Col>
          <Col span={8}>
            <>
              <Col span={12}>
                <Button
                  type="dashed"
                  className="w-full mb-5"
                  size="large"
                  icon={<IoCloudUploadOutline />}
                  onClick={() => setOpenImageModal(true)}
                >
                  Upload Image
                </Button>
              </Col>

              <Col span={12}>
                {image && (
                  <div className="flex items-center justify-between mb-5">
                    <Image
                      src={image}
                      alt="section"
                      height={100}
                      width={100}
                      className="border border-gray-300 rounded-lg "
                    />
                  </div>
                )}
              </Col>
            </>
          </Col>
        </Row>

        <Divider>Social Media</Divider>
        <Row gutter={16}>
          <Col span={8}>
            <AppInput
              label="Facebook"
              name="socialMedia.facebook"
              placeholder="Enter Facebook URL"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="Twitter"
              name="socialMedia.twitter"
              placeholder="Enter Twitter URL"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="Instagram"
              name="socialMedia.instagram"
              placeholder="Enter Instagram URL"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="LinkedIn"
              name="socialMedia.linkedin"
              placeholder="Enter LinkedIn URL"
              type="text"
            />
          </Col>
          <Col span={8}>
            <AppInput
              label="YouTube"
              name="socialMedia.youtube"
              placeholder="Enter YouTube URL"
              type="text"
            />
          </Col>
        </Row>

        <Divider orientation="left">Pages</Divider>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Editor
              label="About Us"
              name="pages.aboutUs"
              defaultValue={defaultValues.pages.aboutUs}
            />
          </Col>
          <Col span={24}>
            <Editor
              label="Terms and Conditions"
              name="pages.termsAndConditions"
              defaultValue={defaultValues.pages.termsAndConditions}
            />
          </Col>
          <Col span={24}>
            <Editor
              label="Privacy Policy"
              name="pages.privacyPolicy"
              defaultValue={defaultValues.pages.privacyPolicy}
            />
          </Col>
          <Col span={24}>
            <Editor
              label="Refund Policy"
              name="pages.refundPolicy"
              defaultValue={defaultValues.pages.refundPolicy}
            />
          </Col>
        </Row>

        <Divider>FAQ</Divider>
        <Row gutter={16}>
          <Col span={24}>
            <FaqSection />
          </Col>
        </Row>

        <div className="mt-10">
          <Button
            loading={isUpdatingStorefrontData}
            disabled={isUpdatingStorefrontData}
            type="primary"
            htmlType="submit"
          >
            Update Storefront data
          </Button>
        </div>
      </AppForm>
      {openImageModal && (
        <GalleryModal
          open={openImageModal}
          onClose={() => setOpenImageModal(false)}
          setSelectedImage={setImage}
          mode="single"
          selectedImage={image}
        />
      )}
    </Container>
  );
};

export default EditStorefront;
