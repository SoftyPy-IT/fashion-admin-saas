import React, { useState } from "react";
import { Button, Col, Row, Image, Spin, Alert } from "antd";
import {
  useGetStorefrontDataQuery,
  useManageBannerMutation,
} from "../../../redux/features/storefront/storefront.api";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import { IoCloudUploadOutline } from "react-icons/io5";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { toast } from "sonner";
import Container from "../../../ui/Container";
import { useNavigate } from "react-router-dom";

const validationSchema = yup.object().shape({
  title: yup.string().optional(),
  subTitle: yup.string().optional(),
  link: yup.string().optional(),
  order: yup.number().required("Order is required"),
});

interface AddSliderFormProps {
  initialValues?: any;
  onClose?: () => void;
  isEdit?: boolean;
}

const AddSliderForm: React.FC<AddSliderFormProps> = ({
  initialValues,
  onClose,
  isEdit = false,
}) => {
  const [images, setImages] = useState<{
    desktop: string | null;
    mobile: string | null;
  }>({
    desktop: initialValues?.image?.desktop || null,
    mobile: initialValues?.image?.mobile || null,
  });
  const [openImageModal, setOpenImageModal] = useState(false);
  const [imageType, setImageType] = useState<"desktop" | "mobile">("desktop"); // To track which type of image to set
  const { data, isLoading, isFetching } = useGetStorefrontDataQuery(
    undefined
  ) as any;
  const [manageBanner, { isLoading: isManagingBanner, isSuccess }] =
    useManageBannerMutation();
  const resolver = useYupValidationResolver(validationSchema);
  const navigate = useNavigate();

  const onFinish = async (values: any) => {
    const toastId = toast.loading(
      `${isEdit ? "Updating" : "Adding"} Slider...`
    );
    try {
      if (!images.desktop || !images.mobile) {
        toast.error("Please select both desktop and mobile images", {
          id: toastId,
        });
        return;
      }

      const newSlider = {
        ...values,
        image: images, // Include both desktop and mobile images
      };

      let updatedSliders;
      if (isEdit) {
        updatedSliders = data?.sliders.map((slider: any) =>
          slider._id === initialValues?._id
            ? { ...slider, ...newSlider }
            : slider
        );
      } else {
        updatedSliders = [...(data?.sliders || []), newSlider];
      }

      const dataToUpdate = {
        id: data?._id,
        sliders: updatedSliders,
      };

      await manageBanner(dataToUpdate);
      toast.success(`Slider ${isEdit ? "updated" : "added"} successfully`, {
        id: toastId,
      });

      if (onClose) {
        onClose();
      } else {
        setTimeout(() => {
          navigate("/dashboard/storefront/manage");
        }, 2000);
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred", {
        id: toastId,
        duration: 2000,
      });
    }
  };

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spin />
      </div>
    );
  }

  const pages = [
    { name: "Dashboard", href: "/dashboard", current: false },
    {
      name: "Storefront",
      href: "/dashboard/storefront/manage",
      current: false,
    },
    { name: "Add Slider", href: "#", current: true },
  ];

  const handleImageSelection = (selectedImage: string) => {
    setImages((prevImages) => ({
      ...prevImages,
      [imageType]: selectedImage, // Set the selected image to either desktop or mobile
    }));
    setOpenImageModal(false); // Close modal after selecting an image
  };

  return (
    <Container
      pages={pages}
      pageTitle={`${isEdit ? "Edit" : "Add new"} Slider`}
      pageHeadingHref="/dashboard/storefront/manage"
      pageHeadingButtonText="Go back "
    >
      <AppForm
        onSubmit={onFinish}
        resolver={resolver}
        defaultValues={initialValues}
      >
        {isSuccess && (
          <div className="mb-5">
            <Alert
              message={`Slider ${isEdit ? "updated" : "added"} successfully`}
              type="success"
              showIcon
            />
          </div>
        )}
        <Row gutter={16}>
          <Col span={12}>
            <AppInput
              label="Title"
              name="title"
              placeholder="Enter the title"
              type="text"
              required={false}
            />
          </Col>
          <Col span={12}>
            <AppInput
              label="Sub Title"
              name="subTitle"
              placeholder="Enter the sub title"
              type="text"
              required={false}
            />
          </Col>
          <Col span={12}>
            <AppInput
              label="Link"
              name="link"
              placeholder="Enter the link"
              type="text"
              required={false}
            />
          </Col>
          <Col span={12}>
            <AppInput
              label="Order: How you want the slider to appear in the list"
              name="order"
              placeholder="Ex: 1"
              type="number"
              required={true}
            />
          </Col>

          {/* Upload buttons for desktop and mobile images */}
          <Col span={12}>
            <Button
              type="dashed"
              className="w-full mb-5"
              size="large"
              icon={<IoCloudUploadOutline />}
              onClick={() => {
                setImageType("desktop");
                setOpenImageModal(true);
              }}
            >
              Upload Desktop Image
            </Button>
            {images.desktop && (
              <div className="flex items-center justify-between mb-5">
                <Image
                  src={images.desktop}
                  alt="Desktop Image"
                  height={100}
                  width={100}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </Col>

          <Col span={12}>
            <Button
              type="dashed"
              className="w-full mb-5"
              size="large"
              icon={<IoCloudUploadOutline />}
              onClick={() => {
                setImageType("mobile");
                setOpenImageModal(true);
              }}
            >
              Upload Mobile Image
            </Button>
            {images.mobile && (
              <div className="flex items-center justify-between mb-5">
                <Image
                  src={images.mobile}
                  alt="Mobile Image"
                  height={100}
                  width={100}
                  className="border border-gray-300 rounded-lg"
                />
              </div>
            )}
          </Col>
        </Row>

        <Button
          type="primary"
          htmlType="submit"
          loading={isManagingBanner}
          className="btn"
          disabled={isManagingBanner || !images.desktop || !images.mobile}
        >
          {isEdit ? "Update" : "Add"} Slider
        </Button>

        {/* Image selection modal */}
        {openImageModal && (
          <GalleryModal
            open={openImageModal}
            onClose={() => setOpenImageModal(false)}
            setSelectedImage={handleImageSelection as any}
            mode="single"
            selectedImage={images[imageType] || ""}
          />
        )}
      </AppForm>
    </Container>
  );
};

export default AddSliderForm;
