import { Button, Col, Divider, Drawer, Row } from "antd";
import ErrorMessage from "../../../components/ErrorMessage";
import SuccessMessage from "../../../components/SuccessMessage";
import ProductSelectTable from "../../../components/data-display/ProductSelectTable";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { TQueryParam } from "../../../types";
import {
  useCreateOfferMutation,
  useUpdateOfferMutation,
  useGetAllOffersProductsQuery,
} from "../../../redux/features/storefront/offers.api";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppDatePicker from "../../../components/form/AppDatePicker";
import * as yup from "yup";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { FieldValues } from "react-hook-form";
import UpdateProductDrawer from "./UpdateProductDrawer";
import dayjs from "dayjs";

interface Props {
  open: boolean;
  onClose: () => void;
  defaultValues?: any;
  needToUpdate?: boolean;
}

const offerSchema = yup.object().shape({
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
  startDate: yup
    .date()
    .required("Start Date is required")
    .typeError("Start Date must be a valid date"),
  endDate: yup
    .date()
    .required("End Date is required")
    .typeError("End Date must be a valid date")
    .min(yup.ref("startDate"), "End Date can't be before Start Date"),
});

const OfferDrawer = ({
  open,
  onClose,
  defaultValues,
  needToUpdate = false,
}: Props) => {
  const [error, setError] = useState<any | null>(null);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [currentProductId, setCurrentProductId] = useState<string | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>(
    defaultValues?.products || []
  );
  const [createOffer, { isSuccess: isCreateSuccess, isLoading: isCreating }] =
    useCreateOfferMutation();
  const [updateOffer, { isSuccess: isUpdateSuccess, isLoading: isUpdating }] =
    useUpdateOfferMutation();
  const [params, setParams] = useState<TQueryParam[]>([]);
  const resolver = useYupValidationResolver(offerSchema);

  const defaultFormValues = {
    title: defaultValues?.title || "",
    subTitle: defaultValues?.subTitle || "",
    startDate: defaultValues?.startDate
      ? dayjs(defaultValues.startDate).format("YYYY-MM-DD")
      : undefined,
    endDate: defaultValues?.endDate
      ? dayjs(defaultValues.endDate).format("YYYY-MM-DD")
      : null,
  };

  const {
    data: productData,
    isLoading: productLoading,
    isFetching: productFetching,
    refetch,
  } = useGetAllOffersProductsQuery([...params]);

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
    }) => ({
      key: _id,
      name,
      thumbnail,
      price,
      discount_price,
      productCost,
      category,
      subCategory,
    })
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
      const offerData = {
        products: selectedProducts,
        title: data.title,
        subTitle: data.subTitle,
        startDate: data.startDate,
        endDate: data.endDate,
      };

      const updateData = {
        id: needToUpdate && defaultValues.key ? defaultValues.key : null,
        ...offerData,
      };

      const res =
        needToUpdate && defaultValues.key
          ? await updateOffer(updateData).unwrap()
          : await createOffer(offerData).unwrap();

      if (res.success) {
        toast.success(
          `Offer ${needToUpdate ? "updated" : "created"} successfully`,
          {
            id: toastId,
            duration: 2000,
          }
        );
        onClose();
      }
    } catch (err: any) {
      setError(
        err?.data?.errorSources?.map((error: any) => error.message).join(", ")
      );
      toast.error(err, { id: toastId, duration: 2000 });
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

  const handleUpdateClick = (id: string) => {
    setCurrentProductId(id);
    setUpdateModalVisible(true);
  };

  return (
    <Drawer
      title={needToUpdate ? "Update Offer" : "Create Offer"}
      placement="right"
      width="60%"
      onClose={onClose}
      open={open}
      size="large"
    >
      <div>
        {error && <ErrorMessage errorMessage={error} />}
        {isCreateSuccess && (
          <SuccessMessage successMessage="Added product to featured products successfully" />
        )}
        {isUpdateSuccess && (
          <SuccessMessage successMessage="Offer updated successfully" />
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
          onUpdateClick={handleUpdateClick}
        />
        <Divider>Offer Details</Divider>
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
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <AppDatePicker name="startDate" label="Start Date" />
            </Col>
            <Col span={12}>
              <AppDatePicker name="endDate" label="End Date" />
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
            {needToUpdate ? "Update Offer" : "Add Product to Featured"}
          </Button>
        </AppForm>
      </div>

      {updateModalVisible && (
        <UpdateProductDrawer
          open={updateModalVisible}
          onClose={() => setUpdateModalVisible(false)}
          productId={currentProductId}
          refetch={refetch}
        />
      )}
    </Drawer>
  );
};

export default OfferDrawer;
