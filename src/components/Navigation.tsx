import useMainStore from "@/hooks/use-main-store";
import { cn } from "@/lib/utils";
import routes from "@/routes";
import React from "react";
import { ClassNameValue } from "tailwind-merge";

const Navbar: React.FC = () => {
  const { useRouter, currentPage } = useMainStore();
  const router = useRouter();

  return (
    <nav className="w-full flex flex-row justify-between items-center px-6 py-4  shadow-md">
      {/* Logo Section */}
      <div className="cursor-pointer" onClick={() => router.push("/home")}>
        <img
          src="/logo.svg"
          alt="Logo"
          className="w-24 h-24 rounded-xl bg-gray-800 p-2 transition-transform transform hover:scale-110"
        />
      </div>

      {/* Navigation Items */}
      <ul className="flex flex-row gap-6">
        {Object.entries(routes).map(([key, value]) => {
          return (
            <NavItem
              key={key + value.label}
              onClick={() => router.push(value.id)}
              className={cn(
                `${
                  currentPage === value.id ? "border-b-4 border-indigo-500" : ""
                }`
              )}
            >
              {value.label}
            </NavItem>
          );
        })}
      </ul>
    </nav>
  );
};

const NavItem: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: ClassNameValue;
}> = ({ children, onClick, className }) => {
  return (
    <li
      onClick={onClick}
      className={cn(
        "text-white cursor-pointer list-none px-4 py-2 hover:border-b-4 border-indigo-500 transition-colors duration-200 rounded-md hover:bg-indigo-700",
        className
      )}
    >
      <small className="text-sm font-medium leading-none">{children}</small>
    </li>
  );
};

export default Navbar;
