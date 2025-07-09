import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
  accept?: string;
  max?: number;
};

const AppInput = ({
  type,
  name,
  label,
  disabled,
  placeholder,
  required = true,
  accept,
  max,
}: TInputProps) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <Controller
        name={name}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label={label}
            validateStatus={error ? "error" : ""}
            hasFeedback={true}
            help={error && error.message}
            required={required}
          >
            <Input
              {...field}
              type={type}
              id={name}
              max={type === "number" && max ? max : undefined}
              size="large"
              disabled={disabled}
              placeholder={placeholder}
              status={error ? "error" : ""}
              accept={accept}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default AppInput;
