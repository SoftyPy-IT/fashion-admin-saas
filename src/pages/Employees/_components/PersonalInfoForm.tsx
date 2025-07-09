import { Form, Input } from "antd";
import { TEmployeeFormProps } from "./CreateEmployeeForm";

const PersonalInfoForm = ({
  finalValues,
  setFinalValues,
}: TEmployeeFormProps & { form: any }) => {
  return (
    <div className="p-6 border rounded-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">
        Personal Information
      </h2>
      <Form.Item
        name="firstName"
        label="First Name"
        rules={[{ required: true, message: "Please enter first name" }]}
      >
        <Input
          variant="filled"
          size="large"
          placeholder="First Name"
          value={finalValues.givenName}
          onChange={(e) =>
            setFinalValues({
              ...finalValues,
              givenName: e.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item
        name="lastName"
        label="Last Name"
        rules={[{ required: true, message: "Please enter last name" }]}
      >
        <Input
          variant="filled"
          size="large"
          placeholder="Last Name"
          value={finalValues.familyName}
          onChange={(e) =>
            setFinalValues({
              ...finalValues,
              familyName: e.target.value,
            })
          }
        />
      </Form.Item>

      <Form.Item
        name="email"
        label="Email"
        rules={[{ required: true, message: "Please enter email" }]}
      >
        <Input
          variant="filled"
          size="large"
          placeholder="Email"
          value={finalValues.email}
          onChange={(e) =>
            setFinalValues({
              ...finalValues,
              email: e.target.value,
            })
          }
        />
      </Form.Item>

      <Form.Item
        name="phone"
        label="Phone"
        rules={[{ required: true, message: "Please enter phone" }]}
      >
        <Input
          variant="filled"
          size="large"
          placeholder="Phone"
          value={finalValues.phone}
          onChange={(e) =>
            setFinalValues({
              ...finalValues,
              phone: e.target.value,
            })
          }
        />
      </Form.Item>
    </div>
  );
};

export default PersonalInfoForm;
