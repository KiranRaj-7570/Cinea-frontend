import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GoBackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 text-sm text-[#F6E7C6] hover:text-[#FF7A1A] transition poppins-regular"
    >
      <ArrowLeft size={16} />
      {label}
    </button>
  );
};

export default GoBackButton;
