import { GoCheckCircle } from "react-icons/go";

const SuccessMessage = ({ successMessage }: { successMessage: string }) => (
  <div className="text-green-500 text-sm mt-2 flex items-center space-x-2">
    <GoCheckCircle className="text-lg" />
    <span>{successMessage}</span>
  </div>
);

export default SuccessMessage;
