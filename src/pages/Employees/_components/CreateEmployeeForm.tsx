import { Button, Form } from "antd";
import { useState } from "react";
import PersonalInfoForm from "./PersonalInfoForm";
import AddressForm from "./AddressForm";

export interface TEmployeeFormProps {
  finalValues: any;
  setFinalValues: (finalValue: any) => void;
}

interface Props {
  initialValues?: any;
  isEditable?: boolean;
}

const CreateEmployeeForm = ({ initialValues, isEditable }: Props) => {
  const [form] = Form.useForm();
  const [finalValues, setFinalValues] = useState(initialValues);

  const onFinish = (values: any) => {
    if (isEditable) {
      console.log("Updated values: ", values);
    }
    console.log("Submitted values: ", values);
  };

  return (
    <div>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        initialValues={initialValues}
        className="space-y-6"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <PersonalInfoForm
            finalValues={finalValues}
            setFinalValues={setFinalValues}
            form={form}
          />
          <AddressForm
            finalValues={finalValues}
            setFinalValues={setFinalValues}
            form={form}
          />
        </div>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Add Employee
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateEmployeeForm;
