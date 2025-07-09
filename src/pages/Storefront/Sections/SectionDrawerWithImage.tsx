import { Button, Col, Divider, Drawer, Image, Row, Input } from "antd";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { FieldValues } from "react-hook-form";
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
} from "../../../redux/features/storefront/sections.api";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppTextArea from "../../../components/form/AppTextArea";
import AppSelect from "../../../components/form/AppSelect";
import { IoCloudUploadOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import GalleryModal from "../../../components/data-display/gallery-modal/GalleryModal";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";

// Validation schema using Yup
const sectionSchema = yup.object().shape({
  title: yup
    .string()
    .max(50, "Title can't be longer than 50 characters")
    .optional(),
  subTitle: yup
    .string()
    .max(50, "Sub Title can't be longer than 50 characters")
    .optional(),
});

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: any;
  needToUpdate?: boolean;
}

enum SectionStyle {
  Grid = "grid",
  Carousel = "carousel",
}

interface ImageWithUrl {
  url: string;
  link: string;
}

interface ImageSet {
  desktop: ImageWithUrl[];
  mobile: ImageWithUrl[];
}

const SectionDrawerWithImage = ({
  open,
  onClose,
  defaultValues,
  needToUpdate,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [images, setImages] = useState<ImageSet>({
    desktop: defaultValues?.images?.desktop || [],
    mobile: defaultValues?.images?.mobile || [],
  });
  const [openDesktopModal, setOpenDesktopModal] = useState(false);
  const [openMobileModal, setOpenMobileModal] = useState(false);
  const [selectedDesktopUrls, setSelectedDesktopUrls] = useState<string[]>([]);
  const [selectedMobileUrls, setSelectedMobileUrls] = useState<string[]>([]);

  const [createSection, { isSuccess: isCreateSuccess, isLoading: isCreating }] =
    useCreateSectionMutation();
  const [updateSection, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] =
    useUpdateSectionMutation();

  const resolver = useYupValidationResolver(sectionSchema);

  const defaultFormValues = {
    title: defaultValues?.title || "",
    subTitle: defaultValues?.subTitle || "",
    description: defaultValues?.description || "",
    style: defaultValues?.style || SectionStyle.Carousel,
    row: defaultValues?.row || 1,
  };

  // Initialize selected URLs when component mounts or defaultValues change
  useEffect(() => {
    if (defaultValues?.images) {
      setSelectedDesktopUrls(
        defaultValues.images.desktop.map((img: ImageWithUrl) => img.url),
      );
      setSelectedMobileUrls(
        defaultValues.images.mobile.map((img: ImageWithUrl) => img.url),
      );
    }
  }, [defaultValues]);

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  const handleImageSelect =
    (type: "desktop" | "mobile") => (selectedUrls: string[]) => {
      // Create new image objects with empty links for the newly selected images
      const newImages = selectedUrls.map((url) => ({ url, link: "" }));

      if (type === "desktop") {
        setSelectedDesktopUrls(selectedUrls);
        setImages((prev) => ({ ...prev, desktop: newImages }));
        setOpenDesktopModal(false);
      } else {
        setSelectedMobileUrls(selectedUrls);
        setImages((prev) => ({ ...prev, mobile: newImages }));
        setOpenMobileModal(false);
      }
    };

  const handleLinkChange = (
    type: "desktop" | "mobile",
    index: number,
    link: string,
  ) => {
    setImages((prev) => ({
      ...prev,
      [type]: prev[type].map((img, idx) =>
        idx === index ? { ...img, link } : img,
      ),
    }));
  };

  const handleRemoveImage = (type: "desktop" | "mobile", index: number) => {
    setImages((prev) => {
      const newImages = {
        ...prev,
        [type]: prev[type].filter((_, idx) => idx !== index),
      };

      // Update selected URLs arrays
      if (type === "desktop") {
        setSelectedDesktopUrls(newImages.desktop.map((img) => img.url));
      } else {
        setSelectedMobileUrls(newImages.mobile.map((img) => img.url));
      }

      return newImages;
    });
  };

  const onSubmit = async (data: FieldValues) => {
    if (images.desktop.length === 0 || images.mobile.length === 0) {
      toast.error("Both desktop and mobile images are required");
      return;
    }

    // Validate that all images have links
    const hasEmptyLinks = [...images.desktop, ...images.mobile].some(
      (img) => !img.link,
    );
    if (hasEmptyLinks) {
      toast.error("All images must have associated links");
      return;
    }

    const toastId = toast.loading(needToUpdate ? "Updating" : "Creating");
    try {
      const sectionData = {
        title: data.title,
        subTitle: data.subTitle,
        description: data.description,
        images: {
          desktop: images.desktop,
          mobile: images.mobile,
        },
        style: data.style,
        type: "banner",
        row: parseInt(data.row),
      };

      const updateData = {
        id: defaultValues?.key,
        ...sectionData,
      };

      const res = needToUpdate
        ? await updateSection(updateData).unwrap()
        : await createSection(sectionData).unwrap();

      if (res.success) {
        toast.success(
          `Section ${needToUpdate ? "updated" : "created"} successfully`,
          { id: toastId, duration: 2000 },
        );
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources?.map((error: any) => error.message).join(", "),
      );
      toast.error("Something went wrong", { id: toastId, duration: 2000 });
    }
  };

  const renderImageList = (type: "desktop" | "mobile") => (
    <div className="">
      {images[type].map((image, idx) => (
        <div key={idx} className="relative my-2">
          <Image
            src={image.url}
            alt={`${type} section`}
            height={100}
            width={100}
            className="border border-gray-300 rounded-lg"
          />
          <Input
            placeholder="Enter link URL"
            value={image.link}
            onChange={(e) => handleLinkChange(type, idx, e.target.value)}
            className="mt-1"
          />
          <Button
            type="text"
            danger
            icon={<IoClose />}
            onClick={() => handleRemoveImage(type, idx)}
            className="absolute -top-2 -right-2"
          />
        </div>
      ))}
    </div>
  );

  return (
    <Drawer
      title={needToUpdate ? "Update Section" : "Create Section"}
      placement="right"
      width="60%"
      onClose={onClose}
      open={open}
      size="large"
    >
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {isCreateSuccess && (
          <SuccessMessage successMessage="Section created successfully" />
        )}
        {isUpdateSuccess && (
          <SuccessMessage successMessage="Section updated successfully" />
        )}
      </div>

      <AppForm
        onSubmit={onSubmit}
        resolver={resolver}
        defaultValues={defaultFormValues}
      >
        <Row gutter={16}>
          <Col span={12}>
            <AppInput
              type="text"
              name="title"
              label="Title"
              placeholder="Title"
            />
          </Col>
          <Col span={12}>
            <AppInput
              type="text"
              name="subTitle"
              label="Sub Title"
              placeholder="Sub Title"
            />
          </Col>

          <Col span={24}>
            <AppTextArea
              required={false}
              name="description"
              label="Description"
              placeholder="Description"
            />
          </Col>

          <Col span={24}>
            <Divider>Section Images</Divider>
            <Row gutter={16}>
              {/* Desktop Images */}
              <Col span={12}>
                <div className="mb-4">
                  <h4 className="mb-2">Desktop Images</h4>
                  <Button
                    type="dashed"
                    className="mb-3"
                    size="large"
                    icon={<IoCloudUploadOutline />}
                    onClick={() => setOpenDesktopModal(true)}
                  >
                    Upload Desktop Images
                  </Button>
                  {renderImageList("desktop")}
                </div>
              </Col>

              {/* Mobile Images */}
              <Col span={12}>
                <div className="mb-4">
                  <h4 className="mb-2">Mobile Images</h4>
                  <Button
                    type="dashed"
                    className="mb-3"
                    size="large"
                    icon={<IoCloudUploadOutline />}
                    onClick={() => setOpenMobileModal(true)}
                  >
                    Upload Mobile Images
                  </Button>
                  {renderImageList("mobile")}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        <Divider>Section Style</Divider>

        <Row gutter={16}>
          <Col span={12}>
            <AppSelect
              name="style"
              label="Style"
              options={[
                { label: "Grid", value: SectionStyle.Grid },
                { label: "Carousel", value: SectionStyle.Carousel },
              ]}
              placeholder="Select Style"
            />
          </Col>

          <Col span={12}>
            <AppInput
              type="number"
              name="row"
              label="Products Per Row"
              placeholder="Ex: 4"
              required={false}
              max={3}
            />
          </Col>
        </Row>

        <Button
          style={{ marginTop: 20, float: "left" }}
          className="btn"
          size="large"
          disabled={isCreating || isUpdating}
          loading={isCreating || isUpdating}
          htmlType="submit"
        >
          {needToUpdate ? "Update Section" : "Create Section"}
        </Button>
      </AppForm>

      {/* Desktop Gallery Modal */}
      {openDesktopModal && (
        <GalleryModal
          open={openDesktopModal}
          onClose={() => setOpenDesktopModal(false)}
          setSelectedImage={handleImageSelect("desktop")}
          mode="multiple"
          selectedImage={selectedDesktopUrls}
        />
      )}

      {/* Mobile Gallery Modal */}
      {openMobileModal && (
        <GalleryModal
          open={openMobileModal}
          onClose={() => setOpenMobileModal(false)}
          setSelectedImage={handleImageSelect("mobile")}
          mode="multiple"
          selectedImage={selectedMobileUrls}
        />
      )}
    </Drawer>
  );
};

export default SectionDrawerWithImage;
