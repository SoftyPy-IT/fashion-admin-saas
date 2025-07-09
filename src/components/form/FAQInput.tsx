import { Form, Input, Row, Col, Button } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { Controller, useFormContext } from "react-hook-form";

type FAQInputProps = {
  name: string;
  index: number;
  questionLabel?: string;
  answerLabel?: string;
  disabled?: boolean;
  placeholderQuestion?: string;
  placeholderAnswer?: string;
  onRemove?: (index: number) => void;
};

const FAQInput = ({
  name,
  index,
  questionLabel,
  answerLabel,
  disabled,
  placeholderQuestion,
  placeholderAnswer,
  onRemove,
}: FAQInputProps) => {
  const { control } = useFormContext();

  return (
    <div>
      <Row gutter={16} align="middle">
        <Col span={12}>
          <Controller
            name={`${name}.question`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label={questionLabel}
                validateStatus={error ? "error" : ""}
                help={error && error.message}
                required
              >
                <Input
                  {...field}
                  size="large"
                  disabled={disabled}
                  placeholder={placeholderQuestion}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col span={11}>
          <Controller
            name={`${name}.answer`}
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Form.Item
                label={answerLabel}
                validateStatus={error ? "error" : ""}
                help={error && error.message}
                required
              >
                <Input
                  {...field}
                  size="large"
                  disabled={disabled}
                  placeholder={placeholderAnswer}
                />
              </Form.Item>
            )}
          />
        </Col>
        <Col span={1} style={{ textAlign: "right" }}>
          <Button
            type="text"
            onClick={() => onRemove && onRemove(index)}
            icon={<DeleteOutlined />}
            className="text-red-500"
          />
        </Col>
      </Row>
    </div>
  );
};

export default FAQInput;
