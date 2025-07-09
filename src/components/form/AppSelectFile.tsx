import { Form, Upload } from "antd";
import { Controller } from "react-hook-form";
import { InboxOutlined } from "@ant-design/icons";

type TSelectProps = {
  name: string;
  label: string;
  disabled?: boolean;
  defaultValue?: {
    url: string;
    public_id: string;
  } | null;
  accept?: string;
};

const AppSelectFile = ({
  name,
  label,
  disabled,
  defaultValue,
  accept = ".jpg,.jpeg,.png,.svg,.webp",
}: TSelectProps) => {
  return (
    <div>
      <Controller
        name={name}
        render={({ field: { onChange }, fieldState: { error } }) => (
          <Form.Item
            label={label}
            validateStatus={error ? "error" : ""}
            help={error?.message || null}
            required
          >
            <Upload.Dragger
              name={name}
              accept={accept}
              disabled={disabled}
              multiple
              listType="picture"
              maxCount={3}
              beforeUpload={() => false}
              onChange={(info) => onChange(info.fileList)}
              defaultFileList={
                defaultValue
                  ? [
                      {
                        uid: "-1",
                        name: defaultValue.url,
                        status: "done",
                        url: defaultValue.url,
                      },
                    ]
                  : []
              }
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="">Click or drag file to this area to upload</p>
            </Upload.Dragger>
          </Form.Item>
        )}
      />
    </div>
  );
};
export default AppSelectFile;
