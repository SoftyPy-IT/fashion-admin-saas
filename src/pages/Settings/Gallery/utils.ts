import { TypedMutationTrigger } from "@reduxjs/toolkit/query/react";
import { toast } from "sonner";

export const handleDelete = async (
  public_id: string,
  id: string,
  deleteImage: TypedMutationTrigger<any, any, any>,
) => {
  const toastId = toast.loading("Deleting image");
  try {
    const res = await deleteImage({
      public_id,
      id,
    }).unwrap();

    if (res.success === true) {
      toast.success("Image deleted successfully", { id: toastId });
    }
  } catch (error) {
    toast.error("Something went wrong", { id: toastId });
  }
};
