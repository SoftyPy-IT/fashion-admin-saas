import { Form, Input } from "antd";
import { Controller } from "react-hook-form";

const { TextArea } = Input;

type ITextAreaProps = {
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  required?: boolean;
};

const AppTextArea = ({
  name,
  label,
  disabled,
  placeholder,
  required = true,
}: ITextAreaProps) => {
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
            <TextArea
              {...field}
              id={name}
              size="large"
              disabled={disabled}
              placeholder={placeholder}
              status={error ? "error" : ""}
              style={{ height: 120, resize: "none" }}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default AppTextArea;
