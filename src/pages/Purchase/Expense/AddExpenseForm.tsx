import { toast } from "sonner";
import AppDatePicker from "../../../components/form/AppDatePicker";
import AppForm from "../../../components/form/AppForm";
import AppInput from "../../../components/form/AppInput";
import AppSelect from "../../../components/form/AppSelect";
import AppSelectFile from "../../../components/form/AppSelectFile";
import AppTextArea from "../../../components/form/AppTextArea";
import useYupValidationResolver from "../../../libs/useYupValidationResolver";
import { useGetAllExpenseCategoriesQuery } from "../../../redux/features/purchase/expense-category.api";
import { Row, Col, Form, Button } from "antd";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useCreateExpenseMutation } from "../../../redux/features/purchase/expense.api";

const validationSchema = yup.object().shape({
  date: yup.date().required("Date is required"),
  reference: yup.string().required("Reference is required"),
  category: yup.string().required("Category is required"),
  amount: yup.number().required("Amount is required"),
  note: yup.string().required("Note is required"),
});

const AddExpenseForm = () => {
  const { data: expenseCategories, isLoading: expenseCategoriesLoading } =
    useGetAllExpenseCategoriesQuery(undefined);
  const [createExpense, { isLoading: createExpenseLoading }] =
    useCreateExpenseMutation();

  const navigate = useNavigate();

  const resolver = useYupValidationResolver(validationSchema);

  const onFinish = async (values: any) => {
    const toastId = toast.loading("Creating purchase...");

    // Initialize formData
    const formData = new FormData();

    // Handle simple fields
    formData.append("date", values.date.toISOString());
    formData.append("reference", values.reference);
    formData.append("category", values.category);
    formData.append("amount", values.amount.toString());
    formData.append("note", values.note);

    // Handle file uploads
    if (values.attachDocument && values.attachDocument[0]) {
      formData.append("attachDocument", values.attachDocument[0].originFileObj);
    }

    try {
      await createExpense(formData).unwrap();
      toast.success("Purchase created successfully", { id: toastId });
      navigate("/dashboard/purchases/expenses/manage");
    } catch (error: any) {
      toast.error(error.message || "An error occurred", { id: toastId });
    } finally {
      toast.dismiss(toastId);
    }
  };

  return (
    <AppForm onSubmit={onFinish} resolver={resolver}>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <AppDatePicker name="date" label="Date" />
        </Col>
        <Col span={12}>
          <AppInput
            type="text"
            name="reference"
            label="Reference"
            placeholder="Enter Reference"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <AppSelect
            name="category"
            label="Category"
            options={expenseCategories?.data?.map((category: any) => ({
              value: category._id,
              label: category.name,
            }))}
            placeholder="Select Category"
            loading={expenseCategoriesLoading}
          />
        </Col>
        <Col span={12}>
          <AppInput
            name="amount"
            label="Amount"
            type="number"
            placeholder="Enter Amount"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-5">
        <Col span={24}>
          <AppTextArea
            name="note"
            label="Note"
            placeholder="Enter any notes or instructions"
          />
        </Col>
        <Col span={8}>
          <AppSelectFile name="attachDocument" label="Attach Document" />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={createExpenseLoading}
            >
              Submit Purchase
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </AppForm>
  );
};

export default AddExpenseForm;
