import { Button, Col, Divider, Drawer, Row } from "antd";
import { useEffect, useState } from "react";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import * as yup from "yup";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import ProductSelectTable from "../../../components/data-display/ProductSelectTable";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppTextArea from "../../../components/form/AppTextArea";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { useGetAllProductQuery } from "../../../redux/features/product/product.api";
import {
  useCreateSectionMutation,
  useUpdateSectionMutation,
} from "../../../redux/features/storefront/sections.api";
import { TQueryParam } from "../../../types";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: any;
  needToUpdate?: boolean;
}

const sectionSchema = yup.object().shape({
  title: yup
    .string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(50, "Title can't be longer than 50 characters"),
  subTitle: yup
    .string()
    .required("Sub Title is required")
    .min(3, "Sub Title must be at least 3 characters")
    .max(50, "Sub Title can't be longer than 50 characters"),
});

const SectionDrawer = ({
  open,
  onClose,
  defaultValues,
  needToUpdate,
}: Props) => {
  const [error, setError] = useState<any | null>(null);

  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultValues?.products || [],
  );
  const [createSection, { isSuccess: isCreateSuccess, isLoading: isCreating }] =
    useCreateSectionMutation();
  const [updateSection, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] =
    useUpdateSectionMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const resolver = useYupValidationResolver(sectionSchema);

  const defaultFormValues = {
    title: defaultValues?.title || "",
    subTitle: defaultValues?.subTitle || "",
    description: defaultValues?.description || "",
    type: "product",
  };

  const {
    data: productData,
    isLoading: productLoading,
    isFetching: productFetching,
    refetch,
  } = useGetAllProductQuery([...params]);

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
      code,
    }) => ({
      key: _id,
      name,
      thumbnail,
      price,
      discount_price,
      productCost,
      category,
      subCategory,
      code,
    }),
  );
  const metaData = productData?.meta;

  useEffect(() => {
    if (error) {
      toast.error("Something went wrong");
    }
  }, [error]);

  const onSubmit = async (data: FieldValues) => {
    const toastId = toast.loading(needToUpdate ? "Updating" : "Creating");
    try {
      const sectionData = {
        products: selectedProducts,
        title: data.title,
        subTitle: data.subTitle,
        description: data.description,
        type: "product",
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
          {
            id: toastId,
            duration: 2000,
          },
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

  const defaultSelected = defaultValues?.products.map(
    (product: any) => product._id,
  );

  return (
    <Drawer
      title={needToUpdate ? "Update Section" : "Create Section With Products"}
      placement="right"
      width="70%"
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

      <div className="mb-20">
        <ProductSelectTable
          data={tableData || ([] as any)}
          total={metaData?.total || 0}
          loading={productLoading || productFetching}
          refetch={refetch}
          onSelect={(selected) => setSelectedProducts(selected)}
          onSearch={handleSearch}
          onPageChange={handlePageChange}
          showUpdateButton={false}
          defaultSelected={defaultSelected || selectedProducts}
          page={metaData?.page || 1}
          pageSize={metaData?.limit || 10}
        />
        <Divider>Section Details</Divider>
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
      </div>
    </Drawer>
  );
};

export default SectionDrawer;
