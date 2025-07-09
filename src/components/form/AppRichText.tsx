import { Form } from "antd";
import { Controller } from "react-hook-form";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    [{ font: [] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    [
      { list: "ordered" },
      { list: "bullet" },
      { indent: "-1" },
      { indent: "+1" },
    ],
    ["link"],
    ["clean"],
  ],
};

const formats = [
  "header",
  "font",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "clean",
];

interface AppRichTextProps {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
}

const AppRichText = ({
  name,
  label,
  required,
  placeholder,
}: AppRichTextProps) => {
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
            <ReactQuill
              theme="snow"
              defaultValue={placeholder}
              modules={modules}
              formats={formats}
              {...field}
              style={{ height: "200px" }}
              className="mb-2"
            />
          </Form.Item>
        )}
      />
    </div>
  );
};

export default AppRichText;
