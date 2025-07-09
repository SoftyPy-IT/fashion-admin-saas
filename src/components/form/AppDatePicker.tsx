import { Controller, useFormContext } from "react-hook-form";
import { Form, DatePicker } from "antd";
import dayjs from "dayjs";

type TPHDatePicker = {
  name: string;
  label: string;
};

dayjs.locale("en");

const AppDatePicker = ({ name, label }: TPHDatePicker) => {
  const { control } = useFormContext();
  return (
    <div style={{ marginBottom: "10px" }}>
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => (
          <Form.Item
            label={label}
            validateStatus={error ? "error" : ""}
            hasFeedback={true}
            help={error && error.message}
            required
          >
            <DatePicker
              {...field}
              showTime
              value={field.value ? dayjs(field.value) : null}
              onChange={(date) => field.onChange(date)}
              size="large"
              style={{ width: "100%" }}
              status={error ? "error" : ""}
              format="YYYY-MM-DD"
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default AppDatePicker;
