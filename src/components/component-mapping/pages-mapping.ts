import Dashboard from "@/pages/Dashboard";
import TicketBookingForm from "../forms/VendorCustomerForm";
import Home from "@/pages/MainPage";
import UserCreateForm from "../forms/UserCreateForm";

const pageMapping: Record<string, React.FC> = {
  "/home": Home,
  "/dashboard": Dashboard,
  "/settings": TicketBookingForm,
  "/sign-up": UserCreateForm,
};

export default pageMapping;
