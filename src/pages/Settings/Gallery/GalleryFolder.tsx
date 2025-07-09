import { FaFolderOpen, FaTrash } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { useDeleteFolderMutation } from "../../../redux/features/gallery/gallery.api";
import { toast } from "sonner";
import { Popconfirm } from "antd";

interface GalleryFolderProps {
  folder: {
    _id: string;
    name: string;
    totalImages: number;
  };
}

export const GalleryFolder = ({ folder }: GalleryFolderProps) => {
  const navigate = useNavigate();
  const [deleteFolder, { isLoading }] = useDeleteFolderMutation();

  const handleClick = () => {
    navigate(`/dashboard/settings/gallery/manage/${folder._id}`, {
      state: { folder: folder._id },
    });
  };

  const handeleDelete = async (values: any) => {
    const toastId = toast.loading("Creating folder...");
    try {
      await deleteFolder(values).unwrap();
      toast.success("Folder deleted successfully", {
        id: toastId,
        duration: 3000,
      });
    } catch (error: any) {
      toast.error(
        error.data?.message || "An error occurred. Please try again.",
        {
          id: toastId,
          duration: 3000,
        },
      );
    }
  };

  return (
    <div className="relative flex flex-col items-center p-6 transition-transform duration-300 bg-white border rounded-lg cursor-pointer hover:scale-105 group">
      <Popconfirm
        title="Are you sure to delete this folder?"
        onConfirm={() => handeleDelete(folder._id)}
        okText="Yes"
        cancelText="No"
        disabled={isLoading}
      >
        <FaTrash className="absolute transition-opacity duration-300 opacity-0 top-2 right-2 group-hover:opacity-100" />
      </Popconfirm>

      <div
        onClick={handleClick}
        className="flex flex-col items-center justify-center w-full"
      >
        <FaFolderOpen className="mb-3 text-yellow-500 text-8xl" />
        <span className="text-xl font-semibold text-gray-900 capitalize">
          {folder.name}
        </span>
      </div>
    </div>
  );
};

export default GalleryFolder;
