interface ProgressProps {
  title?: string;
}

const Progress: React.FC<ProgressProps> = ({ title }: ProgressProps) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black">
      {/* Spinning Loader */}
      <div className="relative w-16 h-16 mb-4">
        <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-transparent border-white"></div>
        <div className="absolute inset-0 m-2 rounded-full border-4 border-t-transparent border-white animate-spin-reverse"></div>
      </div>

      {/* Text with Fade In and Out Animation */}
      <p className="text-white text-lg font-medium animate-fade">
        {title || "Please wait, the page is getting ready..."}
      </p>
    </div>
  );
};

export default Progress;
