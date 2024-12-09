interface CinamaticButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
}

const CinamaticButton: React.FC<CinamaticButtonProps> = ({
  children,
  onClick,
}: CinamaticButtonProps): React.ReactNode => {
  return (
    <button className="p-[3px] relative" onClick={onClick}>
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg" />
      <div className="px-8 py-2  bg-black rounded-[6px]  relative group transition duration-200 text-white hover:bg-transparent">
        {children}
      </div>
    </button>
  );
};

export default CinamaticButton;
