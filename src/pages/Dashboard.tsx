import TimeRangeChart from "@/components/chart/Chart";
import UserList from "@/components/UserList";
import useMainStore from "@/hooks/use-main-store";
import { UserCard } from "@/interfaces/main-store";
import React from "react";
import { useEffect } from "react";

interface UserTypesData {
  vendor: UserCard[];
  customer: UserCard[];
}

const Dashboard = () => {
  const { userBuffer } = useMainStore();
  const [userList, setUserList] = React.useState<UserTypesData>({
    vendor: [],
    customer: [],
  } as UserTypesData);

  useEffect(() => {
    if (!userBuffer.current) return;

    const interval = setInterval(() => {
      setUserList(() => {
        let dataObject: UserTypesData = {
          vendor: [],
          customer: [],
        };

        Object.entries(userBuffer.current!).forEach(([key, value]) => {
          const dataKey = key.split("-")[0];

          switch (dataKey) {
            case "vendor": {
              dataObject = {
                ...dataObject,
                vendor: [...dataObject["vendor"], value],
              };
              break;
            }
            case "customer": {
              dataObject = {
                ...dataObject,
                customer: [...dataObject["customer"], value],
              };
              break;
            }
          }
        });

        return dataObject;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [userBuffer]);

  return (
    <div
      className="overflow-auto [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-thumb]:rounded-full"
      style={{
        background: "linear-gradient(135deg, #1f1f1f, #2a2a40, #404060)",
        backgroundSize: "cover",
      }}
    >
      <div className="p-4 flex gap-6 w-full items-stretch text-white">
        <div className="flex flex-col gap-6 w-4/12 justify-between">
          <div className="bg-gray-800 rounded-md p-4 shadow-lg">
            <UserList userData={userList.vendor} title="Vendor" />
          </div>
          <div className="bg-gray-800 rounded-md p-4 shadow-lg">
            <UserList userData={userList.customer} title="Customer" />
          </div>
        </div>
        <div className="w-8/12 bg-gray-800 rounded-md border border-gray-700 shadow-lg p-4">
          <TimeRangeChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
