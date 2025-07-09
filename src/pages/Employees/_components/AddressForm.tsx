import { Form, Input, Modal, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState } from "react";
import { TEmployeeFormProps } from "./CreateEmployeeForm";

const AddressForm = ({
  finalValues,
  setFinalValues,
}: TEmployeeFormProps & { form: any }) => {
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewImage, setPreviewImage] = useState<string | undefined>();

  const handleImageChange = (info: any) => {
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1); // Limiting to single file
    fileList = fileList.map((file) => ({
      ...file,
      url: URL.createObjectURL(file.originFileObj), // Generate preview URL
    }));
    setFileList(fileList);

    if (info.file.status === "done") {
      const uploadedImage = info.file;
      setFinalValues({ ...finalValues, image: uploadedImage });
    }
  };

  const beforeUpload = (file: any) => {
    // Ensure only image files are uploaded
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isImage;
  };

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onloadend = () => {
          const previewUrl = reader.result as string;
          resolve(previewUrl);
        };
      });
    }
    setPreviewImage(file.url || file.preview);
  };

  return (
    <div className="p-6 border rounded-md">
      <h2 className="mb-4 text-lg font-semibold text-gray-900">Address</h2>
      <Form.Item
        name="country"
        label="Country"
        rules={[{ required: true, message: "Please enter country" }]}
      >
        <Input
          placeholder="Country"
          variant="filled"
          size="large"
          value={finalValues.country}
          onChange={(e) =>
            setFinalValues({
              ...finalValues,
              country: e.target.value,
            })
          }
        />
      </Form.Item>
      <Form.Item
        name="city"
        label="City"
        rules={[{ required: true, message: "Please enter city" }]}
      >
        <Input
          placeholder="City"
          variant="filled"
          size="large"
          value={finalValues.city}
          onChange={(e) =>
            setFinalValues({ ...finalValues, city: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[{ required: true, message: "Please enter address" }]}
      >
        <Input
          placeholder="Address"
          variant="filled"
          size="large"
          value={finalValues.address}
          onChange={(e) =>
            setFinalValues({ ...finalValues, address: e.target.value })
          }
        />
      </Form.Item>
      <Form.Item
        name="image"
        label="Image"
        rules={[{ required: true, message: "Please upload image" }]}
      >
        <div>
          <Upload
            className="block w-full"
            name="image"
            listType="picture-card"
            accept="jpg, jpeg, png, webp"
            fileList={fileList}
            beforeUpload={beforeUpload}
            onChange={handleImageChange}
            onPreview={handlePreview}
          >
            {fileList.length === 0 && (
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            )}
          </Upload>
          <Modal
            open={!!previewImage}
            footer={null}
            onCancel={() => setPreviewImage(undefined)}
          >
            <img alt="Preview" style={{ width: "100%" }} src={previewImage} />
          </Modal>
        </div>
      </Form.Item>
    </div>
  );
};

export default AddressForm;
