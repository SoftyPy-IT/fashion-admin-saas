/* eslint-disable react-hooks/exhaustive-deps */
import { Select, Form } from "antd";
import { useEffect } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";

interface TPHSelectProps {
  label: string;
  name: string;
  options: any[];
  disabled?: boolean;
  mode?: "multiple" | "tags";
  onValueChange?: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  loading?: boolean;
  value?: any;
}

const AppSelectWithWatch = ({
  label,
  name,
  options,
  disabled,
  mode,
  onValueChange,
  placeholder,
  required,
  loading,
  value,
}: TPHSelectProps) => {
  const method = useFormContext();
  const inputValue = useWatch({
    control: method.control,
    name,
  });

  useEffect(() => {
    if (onValueChange) {
      onValueChange(inputValue);
    }
  }, [inputValue]);

  return (
    <Controller
      name={name}
      render={({ field, fieldState: { error } }) => (
        <Form.Item
          label={label}
          required={required}
          validateStatus={error ? "error" : ""}
          hasFeedback={true}
          help={error && error.message}
        >
          <Select
            mode={mode}
            style={{ width: "100%" }}
            {...field}
            defaultValue={value}
            options={options}
            showSearch
            onSearch={(value) => {
              if (value === "" && onValueChange) {
                onValueChange(false);
              }
            }}
            size="large"
            disabled={disabled}
            placeholder={placeholder}
            loading={loading}
            allowClear
          />
        </Form.Item>
      )}
    />
  );
};

export default AppSelectWithWatch;
