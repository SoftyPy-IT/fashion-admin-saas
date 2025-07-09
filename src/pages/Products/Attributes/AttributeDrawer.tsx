import { Drawer, Button, Divider, Typography } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import AppForm from "../../../components/form/AppForm";
import AppInputWithWatch from "../../../components/form/AppInputWithWatch";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import {
  useCreateAttributeMutation,
  useUpdateAttributeMutation,
} from "../../../redux/features/product/attributes.api";

const { Text } = Typography;

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required("Please enter attribute name")
    .min(3, "Attribute name must be at least 3 characters"),
  items: yup
    .array()
    .of(
      yup.object().shape({
        name: yup.string().required("Please enter item name"),
      })
    )
    .required("Please add at least one item."),
});

interface Props {
  open: boolean;
  onClose: () => void;
  initialValues?: any | null;
  needToUpdate?: boolean;
  loading?: boolean;
}

const VariantDrawer = ({
  open,
  onClose,
  initialValues = null,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [items, setItems] = useState<{ name: string }[]>(
    initialValues?.items || [{ name: "" }]
  );

  const [createAttribute, { isSuccess, isLoading }] =
    useCreateAttributeMutation();
  const [
    updateAttribute,
    { isSuccess: isSuccessUpdate, isLoading: isLoadingUpdate },
  ] = useUpdateAttributeMutation();
  const resolver = useYupValidationResolver(validationSchema);

  const defaultValues = {
    name: initialValues?.name || "",
    items: initialValues?.items || [{ name: "" }],
  };

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(`${needToUpdate ? "Updating" : "Creating"}`);
    const finalData = {
      ...data,
      items: items.map((item) => ({
        name: item.name,
        value: item.name,
      })),
    };

    try {
      let res;
      if (needToUpdate && initialValues) {
        res = await updateAttribute({
          id: initialValues.key,
          data: finalData,
        }).unwrap();
      } else {
        res = await createAttribute(finalData).unwrap();
      }

      if (res.success === true) {
        toast.success(res.message, { id: toastId, duration: 2000 });
        setError(null);
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

  const handleAddItem = () => {
    setItems([...items, { name: "" }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleItemChange = (index: number, value: string) => {
    const newItems = items.map((item, i) =>
      i === index ? { ...item, name: value } : item
    );
    setItems(newItems);
  };

  const renderItemFields = () => {
    return (
      <div>
        {items.map((_item, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              marginBottom: "10px",
              alignItems: "center",
            }}
          >
            <div style={{ flex: 1, marginRight: "10px" }}>
              <AppInputWithWatch
                name={`items[${index}].name`}
                type="text"
                label={`Item ${index + 1}`}
                placeholder="Enter item name"
                onValueChange={(value) => handleItemChange(index, value)}
              />
            </div>
            <Button
              type="dashed"
              danger
              onClick={() => handleRemoveItem(index)}
            >
              Remove Item
            </Button>
          </div>
        ))}
        <Button
          className="btn_outline"
          onClick={handleAddItem}
          icon={<PlusOutlined />}
          block
        >
          Add Item
        </Button>
      </div>
    );
  };

  return (
    <>
      <Drawer
        title={needToUpdate ? "Update Attribute" : "Create Attribute"}
        onClose={onClose}
        open={open}
        width={400}
        getContainer={false}
      >
        <div>
          {error && <ErrorMessage errorMessage={error} />}
          {(isSuccess || isSuccessUpdate) && (
            <SuccessMessage
              successMessage={
                needToUpdate
                  ? "Attribute updated successfully"
                  : "Attribute created successfully"
              }
            />
          )}
        </div>
        <AppForm
          onSubmit={onSubmit}
          resolver={resolver}
          defaultValues={defaultValues}
        >
          <AppInputWithWatch
            type="text"
            name="name"
            label="Attribute Name"
            placeholder="Enter attribute name"
            onValueChange={() => {}}
          />

          <Divider>
            <Text strong>Items</Text>
          </Divider>
          {renderItemFields()}

          <Button
            loading={isLoading || isLoadingUpdate}
            disabled={isLoading || isLoadingUpdate}
            htmlType="submit"
            className="w-full mt-5 btn"
          >
            {needToUpdate ? "Update Attribute" : "Create Attribute"}
          </Button>
        </AppForm>
      </Drawer>
    </>
  );
};

export default VariantDrawer;
