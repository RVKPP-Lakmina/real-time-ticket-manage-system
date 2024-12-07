import React from "react";

const Button: React.FC<{ children: React.ReactNode; onClick?: () => void }> = ({
  children,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="h-12 w-12 bg-indigo-500 text-white font-semibold rounded-md shadow-lg hover:bg-indigo-600 active:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2 transition-all"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </button>
  );
};

export default Button;
