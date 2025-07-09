import {
  DeleteOutlined,
  PlusOutlined,
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  Input,
  Row,
  Typography,
  Tag,
  Space,
  Tooltip,
  Empty,
  Divider,
  InputNumber,
} from "antd";
import React, { useState, useEffect } from "react";

const { Title, Text } = Typography;

interface VariantValue {
  name: string;
  value: string;
  quantity: number;
  _id?: string;
}

interface Variant {
  name: string;
  values: VariantValue[];
  _id?: string;
}

interface VariantSectionProps {
  variants: Variant[];
  handleAddVariant: () => void;
  handleRemoveVariant: (index: number) => void;
  handleVariantNameChange: (index: number, value: string) => void;
  handleAddVariantValue: (index: number, values: VariantValue[]) => void;
}

const VariantSection: React.FC<VariantSectionProps> = ({
  variants,
  handleAddVariant,
  handleRemoveVariant,
  handleVariantNameChange,
  handleAddVariantValue,
}) => {
  const [newValues, setNewValues] = useState<Record<number, string>>({});
  const [newQuantities, setNewQuantities] = useState<Record<number, number>>(
    {},
  );
  const [editingValue, setEditingValue] = useState<{
    index: number;
    valueIndex: number;
  } | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editQuantity, setEditQuantity] = useState<number>(0);
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
    {},
  );
  const [localVariantNames, setLocalVariantNames] = useState<
    Record<number, string>
  >({});

  // Initialize all cards as expanded and sync variant names
  useEffect(() => {
    const initialExpandState: Record<number, boolean> = {};
    const initialNames: Record<number, string> = {};
    variants.forEach((variant, idx) => {
      initialExpandState[idx] = true;
      initialNames[idx] = variant.name;
    });
    setExpandedCards(initialExpandState);
    setLocalVariantNames(initialNames);
  }, [variants.length]);

  // Debounced variant name update
  useEffect(() => {
    const timeouts: Record<number, NodeJS.Timeout> = {};

    Object.entries(localVariantNames).forEach(([index, name]) => {
      const idx = parseInt(index);
      if (variants[idx] && variants[idx].name !== name) {
        timeouts[idx] = setTimeout(() => {
          handleVariantNameChange(idx, name);
        }, 300);
      }
    });

    return () => {
      Object.values(timeouts).forEach((timeout) => clearTimeout(timeout));
    };
  }, [localVariantNames, variants, handleVariantNameChange]);

  const handleLocalVariantNameChange = (index: number, value: string) => {
    setLocalVariantNames((prev) => ({
      ...prev,
      [index]: value,
    }));
  };

  const toggleCardExpand = (index: number) => {
    setExpandedCards((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const addVariantValue = (variantIndex: number, value: string) => {
    if (!value.trim()) return;

    const trimmedValue = value.trim();
    const quantity = newQuantities[variantIndex] || 0;
    const currentValues = [...variants[variantIndex].values];
    const newValues = [
      ...currentValues,
      {
        name: trimmedValue,
        value: trimmedValue,
        quantity: quantity,
        _id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      },
    ];
    handleAddVariantValue(variantIndex, newValues);
    setNewValues((prev) => ({ ...prev, [variantIndex]: "" }));
    setNewQuantities((prev) => ({ ...prev, [variantIndex]: 0 }));
  };

  const removeVariantValue = (variantIndex: number, valueIndex: number) => {
    const currentValues = [...variants[variantIndex].values];
    currentValues.splice(valueIndex, 1);
    handleAddVariantValue(variantIndex, currentValues);
  };

  const startEditingValue = (
    variantIndex: number,
    valueIndex: number,
    currentValue: string,
    currentQuantity: number,
  ) => {
    setEditingValue({ index: variantIndex, valueIndex });
    setEditValue(currentValue);
    setEditQuantity(currentQuantity);
  };

  const saveEditedValue = () => {
    if (!editingValue || !editValue.trim()) {
      setEditingValue(null);
      return;
    }

    const { index, valueIndex } = editingValue;
    const currentValues = [...variants[index].values];
    currentValues[valueIndex] = {
      ...currentValues[valueIndex],
      name: editValue.trim(),
      value: editValue.trim(),
      quantity: editQuantity,
    };

    handleAddVariantValue(index, currentValues);
    setEditingValue(null);
  };

  const updateQuantity = (
    variantIndex: number,
    valueIndex: number,
    quantity: number,
  ) => {
    const currentValues = [...variants[variantIndex].values];
    currentValues[valueIndex] = {
      ...currentValues[valueIndex],
      quantity: quantity || 0,
    };
    handleAddVariantValue(variantIndex, currentValues);
  };

  const handleInputChange = (variantIndex: number, value: string) => {
    setNewValues((prev) => ({ ...prev, [variantIndex]: value }));
  };

  const handleQuantityChange = (
    variantIndex: number,
    quantity: number | null,
  ) => {
    setNewQuantities((prev) => ({ ...prev, [variantIndex]: quantity || 0 }));
  };

  const handleKeyPress = (variantIndex: number, e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addVariantValue(variantIndex, newValues[variantIndex] || "");
    }
  };

  const handleEditKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEditedValue();
    } else if (e.key === "Escape") {
      setEditingValue(null);
    }
  };

  const tagColors = [
    "magenta",
    "red",
    "volcano",
    "orange",
    "gold",
    "lime",
    "green",
    "cyan",
    "blue",
    "geekblue",
    "purple",
  ];

  const getQuantityStatus = (quantity: number) => {
    if (quantity === 0) return { color: "#ff4d4f", text: "Out of Stock" };
    if (quantity <= 5) return { color: "#faad14", text: "Low Stock" };
    return { color: "#52c41a", text: "In Stock" };
  };

  return (
    <div className="variants-container">
      <div className="mb-6">
        <Title level={4} className="mb-2">
          Product Variants
        </Title>
        <Text type="secondary" className="block mb-4">
          Create and manage product variants like color, size, material, etc.
          with inventory tracking.
        </Text>
        <Divider className="my-4" />
      </div>

      {variants.length === 0 ? (
        <Empty
          description="No variants added yet"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          className="my-8"
        />
      ) : (
        variants.map((variant, variantIndex) => (
          <Card
            key={variant?._id || variantIndex}
            className="mb-6 rounded-lg border border-gray-200 shadow-sm"
            styles={{
              header: { background: "#fafafa" },
              body: { padding: expandedCards[variantIndex] ? 24 : 0 },
            }}
            title={
              <Row align="middle" justify="space-between" className="px-2">
                <Col className="flex items-center">
                  <Text
                    strong
                    className="text-base"
                    onClick={() => toggleCardExpand(variantIndex)}
                    style={{ cursor: "pointer" }}
                  >
                    {variant.name || `Variant ${variantIndex + 1}`}
                  </Text>
                  {variant.values.length > 0 && (
                    <Space className="ml-3">
                      <Tag className="text-blue-700 bg-blue-50 border-blue-200">
                        {variant.values.length}{" "}
                        {variant.values.length === 1 ? "value" : "values"}
                      </Tag>
                      <Tag className="text-purple-700 bg-purple-50 border-purple-200">
                        Total:{" "}
                        {variant.values.reduce(
                          (sum, val) => sum + val.quantity,
                          0,
                        )}{" "}
                        units
                      </Tag>
                    </Space>
                  )}
                </Col>
                <Space>
                  <Button
                    type="text"
                    icon={
                      expandedCards[variantIndex] ? (
                        <span className="text-gray-500">−</span>
                      ) : (
                        <span className="text-gray-500">+</span>
                      )
                    }
                    onClick={() => toggleCardExpand(variantIndex)}
                    size="small"
                  />
                  <Button
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => handleRemoveVariant(variantIndex)}
                    size="small"
                  >
                    Remove
                  </Button>
                </Space>
              </Row>
            }
          >
            {expandedCards[variantIndex] && (
              <>
                <div className="mb-6">
                  <Text strong className="block mb-2">
                    Variant Name
                  </Text>
                  <Input
                    placeholder="e.g., Color, Size, Material"
                    value={localVariantNames[variantIndex] || ""}
                    onChange={(e) =>
                      handleLocalVariantNameChange(variantIndex, e.target.value)
                    }
                    className="rounded"
                    prefix={<span className="mr-2 text-gray-400">#</span>}
                  />
                </div>

                <div>
                  <Text strong className="block mb-2">
                    Variant Values & Inventory
                  </Text>

                  <div className="mb-4 space-y-3">
                    {variant.values.map((value, valueIndex) =>
                      editingValue?.index === variantIndex &&
                      editingValue?.valueIndex === valueIndex ? (
                        <div
                          className="flex items-center p-3 bg-gray-50 rounded-lg"
                          key={`editing-${value._id || valueIndex}`}
                        >
                          <div className="flex flex-1 items-center">
                            <Input
                              autoFocus
                              size="small"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              onKeyDown={handleEditKeyPress}
                              className="mr-2 w-32"
                              placeholder="Value name"
                            />
                            <InputNumber
                              size="small"
                              value={editQuantity}
                              onChange={(val) => setEditQuantity(val || 0)}
                              min={0}
                              className="mr-2 w-20"
                              placeholder="Qty"
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={
                                <CheckOutlined className="text-green-600" />
                              }
                              onClick={saveEditedValue}
                              className="mr-1"
                            />
                            <Button
                              type="text"
                              size="small"
                              icon={<CloseOutlined className="text-red-600" />}
                              onClick={() => setEditingValue(null)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          key={value._id || valueIndex}
                          className="flex justify-between items-center p-3 bg-white rounded-lg border border-gray-200 transition-colors hover:border-gray-300"
                        >
                          <div className="flex flex-1 items-center">
                            <Tag
                              color={tagColors[valueIndex % tagColors.length]}
                              className="px-3 py-1 text-sm font-medium"
                            >
                              {value.name}
                            </Tag>
                            <div className="flex items-center ml-4">
                              <Text className="mr-2 text-sm text-gray-600">
                                Qty:
                              </Text>
                              <InputNumber
                                size="small"
                                value={value.quantity}
                                onChange={(val) =>
                                  updateQuantity(
                                    variantIndex,
                                    valueIndex,
                                    val || 0,
                                  )
                                }
                                min={0}
                                className="w-20"
                              />
                              <div className="ml-3">
                                <Tag
                                  color={
                                    getQuantityStatus(value.quantity).color
                                  }
                                  className="text-xs"
                                >
                                  {getQuantityStatus(value.quantity).text}
                                </Tag>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <Tooltip title="Edit">
                              <Button
                                type="text"
                                size="small"
                                icon={<EditOutlined />}
                                onClick={() =>
                                  startEditingValue(
                                    variantIndex,
                                    valueIndex,
                                    value.name,
                                    value.quantity,
                                  )
                                }
                                className="text-blue-600 hover:text-blue-800"
                              />
                            </Tooltip>
                            <Tooltip title="Remove">
                              <Button
                                type="text"
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={() =>
                                  removeVariantValue(variantIndex, valueIndex)
                                }
                                className="text-red-600 hover:text-red-800"
                              />
                            </Tooltip>
                          </div>
                        </div>
                      ),
                    )}
                  </div>

                  <div className="flex items-center p-4 bg-blue-50 rounded-lg">
                    <Input
                      placeholder="Add new value"
                      value={newValues[variantIndex] || ""}
                      onChange={(e) =>
                        handleInputChange(variantIndex, e.target.value)
                      }
                      onKeyPress={(e) => handleKeyPress(variantIndex, e)}
                      className="mr-3 w-48 rounded"
                      size="middle"
                    />
                    <InputNumber
                      placeholder="Quantity"
                      value={newQuantities[variantIndex] || 0}
                      onChange={(val) =>
                        handleQuantityChange(variantIndex, val)
                      }
                      min={0}
                      className="mr-3 w-24"
                      size="middle"
                    />
                    <Button
                      type="primary"
                      size="middle"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        addVariantValue(
                          variantIndex,
                          newValues[variantIndex] || "",
                        )
                      }
                      className="flex items-center"
                      disabled={!newValues[variantIndex]?.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </>
            )}
          </Card>
        ))
      )}

      <Button
        type="dashed"
        onClick={handleAddVariant}
        size="large"
        className="flex justify-center items-center mt-6 w-full h-16 rounded-lg border-2 border-blue-200 hover:border-blue-400"
        icon={<PlusOutlined className="text-blue-500" />}
      >
        <span className="ml-2 font-medium text-blue-500">Add New Variant</span>
      </Button>
    </div>
  );
};

export default VariantSection;
