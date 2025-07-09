import type { ProColumns } from "@ant-design/pro-components";
import { DragSortTable } from "@ant-design/pro-components";
import { Avatar, Drawer, message } from "antd";
import { useEffect, useState } from "react";
import { useUpdateCategoryOrderMutation } from "../../../redux/features/product/category.api";

interface BaseCategory {
  _id: string;
  name: string;
  image: string;
  serial: number;
  slug?: string;
}

export enum ModelType {
  Category = "Category",
  SubCategory = "SubCategory",
  MainCategory = "MainCategory",
}

// Props interface with generic type
interface OrderDrawerProps<T extends BaseCategory> {
  open: boolean;
  onClose: () => void;
  title: string;
  data: T[] | undefined;
  refetch: () => void;
  extraColumns?: ProColumns<T>[];
  modelType: ModelType;
}

const OrderDrawer = <T extends BaseCategory>({
  open,
  onClose,
  title,
  data,
  refetch,
  extraColumns = [],
  modelType,
}: OrderDrawerProps<T>) => {
  const [dataSource, setDataSource] = useState<T[]>([]);
  const [updateOrder, { isLoading }] = useUpdateCategoryOrderMutation();
  useEffect(() => {
    if (data) {
      // Ensure `serial` is reassigned based on initial order
      const sortedData = [...data].sort((a, b) => a.serial - b.serial);
      setDataSource(sortedData);
    }
  }, [data]);

  const handleDragSortEnd = async (
    _beforeIndex: number,
    _afterIndex: number,
    newDataSource: T[],
  ) => {
    try {
      // Assign `serial` dynamically based on new order
      const updatedData = newDataSource.map((item, index) => ({
        _id: item._id,
        serial: index + 1, // Ensure `serial` is updated dynamically
      }));

      setDataSource(newDataSource); // Update local state optimistically

      await updateOrder({
        modelType,
        data: updatedData.map(({ _id }) => ({ _id })), // Send only `_id` (backend assigns serial)
      });

      message.success("Order updated successfully");
      refetch(); // Refresh data from the server
    } catch (error) {
      console.error("Order update failed:", error);
      message.error("Failed to update order");
      setDataSource(data || []); // Rollback to previous state
    }
  };

  const defaultColumns: ProColumns<T>[] = [
    {
      title: "Serial",
      dataIndex: "serial",
      width: 80,
      className: "drag-visible",
    },
    {
      title: "Image",
      dataIndex: "image",
      width: 100,
      render: (image) => (
        <Avatar
          src={image as string}
          alt="category"
          style={{ width: 50, height: 50 }}
          className="rounded"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    ...extraColumns,
  ];

  return (
    <Drawer
      title={title}
      placement="right"
      onClose={onClose}
      open={open}
      width={500}
    >
      <DragSortTable
        headerTitle="Drag to reorder"
        columns={defaultColumns}
        rowKey="_id"
        search={false}
        pagination={false}
        dataSource={dataSource}
        dragSortKey="serial"
        onDragSortEnd={handleDragSortEnd}
        loading={isLoading}
      />
    </Drawer>
  );
};

export default OrderDrawer;
