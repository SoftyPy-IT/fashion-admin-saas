import React, { useState } from "react";
import {
  useGetStorefrontDataQuery,
  useManageBannerMutation,
} from "../../../redux/features/storefront/storefront.api";
import {
  Skeleton,
  Button,
  Card,
  message,
  Popconfirm,
  Table,
  Modal,
  Image,
} from "antd";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa6";
import AddSliderForm from "./AddSliderForm";
import { FaEdit } from "react-icons/fa";

interface Slider {
  _id: string;
  title: string;
  subTitle: string;
  image: {
    mobile: string;
    desktop: string;
  };
  href?: string;
  order?: number;
}

const SlidersList: React.FC = () => {
  const { data, isLoading, isFetching } = useGetStorefrontDataQuery(
    undefined,
  ) as any;
  const [manageBanner, { isLoading: isManagingBanner }] =
    useManageBannerMutation();
  const [editingSlider, setEditingSlider] = useState<Slider | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  if (isLoading || isFetching) {
    return <Skeleton active />;
  }

  const removeSlider = async (id: string) => {
    try {
      const updatedSliders = data?.sliders?.filter(
        (slider: Slider) => slider._id !== id,
      );
      await manageBanner({ id: data._id, sliders: updatedSliders });
      message.success("Slider removed successfully");
    } catch (error) {
      message.error("Failed to remove slider");
    }
  };

  const openEditModal = (slider: Slider) => {
    setEditingSlider(slider);
    setIsEditModalVisible(true);
  };

  const closeEditModal = () => {
    setEditingSlider(null);
    setIsEditModalVisible(false);
  };

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "mobileImage",
      render: (image: { desktop: string; mobile: string }) => (
        <Image src={image.mobile} alt="mobile" width={50} />
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Subtitle",
      dataIndex: "subTitle",
      key: "subTitle",
    },
    {
      title: "Order",
      dataIndex: "order",
      key: "order",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Slider) => (
        <div className="flex items-center space-x-3">
          <Button
            type="primary"
            icon={<FaEdit />}
            onClick={() => openEditModal(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this slider?"
            onConfirm={() => removeSlider(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger loading={isManagingBanner} icon={<FaTrash />}>
              Delete
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2 className="mb-4 text-2xl font-semibold">Sliders</h2>
      <Card
        title="Slider List"
        bordered
        extra={
          <Link to={`/dashboard/storefront/manage/add-slider/${data?._id}`}>
            <Button type="primary">Add Slider</Button>
          </Link>
        }
      >
        <Table columns={columns} dataSource={data?.sliders} rowKey="_id" />
      </Card>

      <Modal
        title="Edit Slider"
        open={isEditModalVisible}
        onCancel={closeEditModal}
        footer={null}
        width={800}
      >
        {editingSlider && (
          <AddSliderForm
            initialValues={editingSlider}
            onClose={closeEditModal}
            isEdit
          />
        )}
      </Modal>
    </div>
  );
};

export default SlidersList;
