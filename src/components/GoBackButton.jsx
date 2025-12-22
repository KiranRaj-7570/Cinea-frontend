import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const GoBackButton = ({ label = "Back" }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-1 text-md font-semibold bg-[#181818] hover:text-[#FF7A1A] transition poppins-regular px-3 m-3 mt-3 md:mt-3 py-2 rounded-full"
    >
      <ArrowLeft size={18} />
      {label}
    </button>
  );
};

export default GoBackButton;
