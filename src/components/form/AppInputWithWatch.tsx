/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Input } from "antd";
import { Controller, useWatch, useFormContext } from "react-hook-form";
import { useEffect } from "react";

type TInputProps = {
  type: string;
  name: string;
  label?: string;
  disabled?: boolean;
  placeholder?: string;
  onValueChange: (value: any) => void;
};

const AppInputWithWatch = ({
  type,
  name,
  label,
  disabled,
  placeholder,
  onValueChange,
}: TInputProps) => {
  const method = useFormContext();
  const inputValue = useWatch({
    control: method.control,
    name,
  });

  useEffect(() => {
    onValueChange(inputValue);
  }, [inputValue]);

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
            required
          >
            <Input
              {...field}
              type={type}
              ref={field.ref}
              id={name}
              size="large"
              disabled={disabled}
              placeholder={placeholder}
              status={error ? "error" : ""}
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default AppInputWithWatch;
