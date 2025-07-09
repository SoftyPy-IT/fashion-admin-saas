import React, { useState } from "react";
import { toast } from "sonner";
import { useUpdateAvatarMutation } from "../redux/features/auth/authApi";
import { useAppDispatch } from "../redux/hooks";
import { setProfile } from "../redux/features/auth/authSlice";
import { Avatar, Spin } from "antd";
import { PiPlusCircleDuotone } from "react-icons/pi";
import { LoadingOutlined } from "@ant-design/icons";

const UpdateAvatar = ({
  url,
  firstName,
  lastName,
}: {
  url: string;
  firstName: string;
  lastName: string;
}) => {
  const [image, setImage] = useState(url);
  const [hovering, setHovering] = useState(false);
  const [updateAvatar, { isLoading }] = useUpdateAvatarMutation();
  const dispatch = useAppDispatch();

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Uploading image");

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      // Replace "YOUR_UPLOAD_API_ENDPOINT" with the actual URL
      const res = await updateAvatar(formData).unwrap();

      if (res.success === true) {
        dispatch(setProfile(res?.data));
        setImage(res.data.avatar.url);
        toast.success("Image uploaded", { id: toastId, duration: 2000 });
      } else {
        toast.error("Failed to upload image", { id: toastId, duration: 2000 });
      }
    } catch (error) {
      toast.error("Failed to upload image", { id: toastId, duration: 2000 });
    }
  };

  return (
    <div className="relative text-center">
      <div
        className="relative inline-block"
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
      >
        {isLoading ? (
          <div className="flex items-center justify-center bg-gray-200 rounded-full ">
            <Spin
              indicator={<LoadingOutlined />}
              size="small"
              aria-label="Loading..."
            >
              <Avatar
                src={
                  image
                    ? image
                    : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&color=7F9CF5&background=EBF4FF`
                }
                alt="Uploading"
              />
            </Spin>
          </div>
        ) : (
          <>
            <Avatar
              src={
                image
                  ? image
                  : `https://ui-avatars.com/api/?name=${firstName}+${lastName}&color=7F9CF5&background=EBF4FF`
              }
              alt="Uploaded"
              size="large"
            />
            {hovering && (
              <label
                htmlFor="imageInput"
                className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 rounded-full cursor-pointer"
              >
                <input
                  id="imageInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={isLoading}
                />
                <PiPlusCircleDuotone className="w-6 h-6 text-white" />
              </label>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default UpdateAvatar;
