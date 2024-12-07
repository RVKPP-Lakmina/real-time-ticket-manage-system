import TimeRangeChart from "@/components/chart/Chart";
import UserList from "@/components/UserList";

const Dashboard = () => {
  const activeVendors = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-vendor.${a.length - i}`
  );

  const activeCustomers = Array.from({ length: 50 }).map(
    (_, i, a) => `v1.2.0-customer.${a.length - i}`
  );
  return (
    <div
      className="overflow-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2a2a40, #404060)",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 flex gap-6 w-full items-stretch text-white">
        {/* User List Section */}
        <div className="flex flex-col gap-6 w-4/12">
          <div className="bg-gray-800 rounded-md p-4 shadow-lg">
            <UserList tags={activeVendors} title="Vendor" />
          </div>
          <div className="bg-gray-800 rounded-md p-4 shadow-lg">
            <UserList tags={activeCustomers} title="Customer" />
          </div>
        </div>

        {/* Chart Section */}
        <div className="w-8/12 bg-gray-800 rounded-md border border-gray-700 shadow-lg p-4">
          <TimeRangeChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
