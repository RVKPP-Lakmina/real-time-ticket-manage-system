import Dashboard from "@/pages/Dashboard";
import TicketBookingForm from "../forms/VendorCustomerForm";

const pageMapping: Record<string, React.FC> = {
  "/home": Dashboard,
  "/dashboard": Dashboard,
  "/settings": TicketBookingForm,
};

export default pageMapping;
