/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Select, Spin, Tag } from "antd";
import debounce from "lodash/debounce";
import { useCallback, useState } from "react";
import { Controller } from "react-hook-form";

type TSelectProps = {
  label: string;
  name: string;
  options: { value: string; label: string; disabled?: boolean }[] | undefined;
  disabled?: boolean;
  mode?: "multiple" | undefined;
  loading?: boolean;
  placeholder?: string;
  labelIcon?: boolean;
  required?: boolean;
  onSearch?: (search: string) => Promise<void> | void;
  searchDebounceMs?: number;
};

const AppSelect = ({
  label,
  name,
  options,
  disabled,
  mode,
  loading = false,
  placeholder,
  labelIcon,
  required,
  onSearch,
  searchDebounceMs = 500,
}: TSelectProps) => {
  const [searchLoading, setSearchLoading] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce(async (value: string) => {
      if (onSearch) {
        try {
          setSearchLoading(true);
          await onSearch(value);
        } finally {
          setSearchLoading(false);
        }
      }
    }, searchDebounceMs),
    [onSearch, searchDebounceMs],
  );

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
            allowClear
            mode={mode}
            style={{ width: "100%" }}
            {...field}
            options={options}
            size="large"
            disabled={disabled || searchLoading}
            loading={loading || searchLoading}
            placeholder={placeholder}
            showSearch
            onSearch={debouncedSearch}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            status={error ? "error" : ""}
            value={
              field.value
                ? mode === "multiple"
                  ? field.value.map((item: string) => item)
                  : field.value
                : undefined
            }
            optionRender={
              labelIcon
                ? (node) => (
                    <div className="flex items-center space-x-10">
                      <div>{node.label}</div>
                      <Tag color={`${node.value}`}>{node.value}</Tag>
                    </div>
                  )
                : undefined
            }
            dropdownRender={(menu) => (
              <>
                {searchLoading && (
                  <div className="flex items-center justify-center p-2">
                    <Spin size="small" />
                  </div>
                )}
                {menu}
              </>
            )}
          />
        </Form.Item>
      )}
    />
  );
};

export default AppSelect;
