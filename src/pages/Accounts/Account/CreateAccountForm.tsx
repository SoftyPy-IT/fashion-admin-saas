import { Drawer, Form, Input, Button, Select } from "antd";

interface Props {
  open: boolean;
  onClose: () => void;
}

const CreateAccountForm = ({ open, onClose }: Props) => {
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    console.log("Received values:", values);
    // Add your logic here for form submission
  };

  return (
    <Drawer title="Create New Vat Tax" onClose={onClose} open={open}>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please input the title!" }]}
        >
          <Input placeholder="Enter title" />
        </Form.Item>
        <Form.Item
          name="type"
          label="Account Type"
          rules={[{ required: true, message: "Please select account type!" }]}
        >
          <Select placeholder="Select account type">
            <Select.Option value="cash">Cash</Select.Option>
            <Select.Option value="bank">Bank</Select.Option>
            <Select.Option value="expense">Expense</Select.Option>
            <Select.Option value="income">Income</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default CreateAccountForm;
