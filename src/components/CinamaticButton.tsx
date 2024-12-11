import { cn } from "@/lib/utils";

interface CinamaticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  activeStatus?: boolean;
}

const CinamaticButton: React.FC<CinamaticButtonProps> = ({
  children,
  onClick,
  activeStatus = false,
}: CinamaticButtonProps): React.ReactNode => {
  return (
    <button className="p-[3px] relative" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div
        className={cn(
          `px-14 py-8  bg-black rounded-[6px] text-lg  relative group transition duration-200 text-white hover:bg-transparent, ${
            activeStatus ? "text-red-500" : "text-cyan-300"
          }`
        )}
      >
        {children}
      </div>
    </button>
  );
};

export default CinamaticButton;
