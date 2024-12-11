import { IoMdPersonAdd } from "react-icons/io";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "@radix-ui/react-select";
import { FiMinusCircle } from "react-icons/fi";
import { UserCard } from "@/interfaces/main-store";
import useMainStore from "@/hooks/use-main-store";
import AlertDialogModal from "./AlertDialog";

const UserList = ({
  userData,
  title,
}: {
  userData: UserCard[];
  title: string;
}) => {
  const { wsService } = useMainStore();

  const handleRemoveUser = (userId: string) => {
    wsService.sendMessage(`removeUser:${userId}`);
  };

  return (
    <ScrollArea className="h-52 rounded-md border border-gray-700 bg-gray-800 text-white shadow-md">
      <div className="p-4">
        {/* Header Section */}
        <div className="sticky top-1 bg-gray-800 w-full">
          <div className="mb-2  bg-gray-900 flex flex-row justify-between items-center gap-3 p-3 rounded-md">
            <h4 className="text-sm font-medium leading-none">
              {title} - ({userData.length})
            </h4>
            <div className="cursor-pointer">
              <IoMdPersonAdd color="green" size="25px" title="Add User" />
            </div>
          </div>
        </div>

        {/* User List */}
        {userData.length > 0 ? (
          userData.map((user) => (
            <div key={user.id}>
              <div className="text-sm flex justify-between items-center p-2 rounded-md hover:bg-gray-700 transition-colors">
                <span>
                  Name: {user.name.toLocaleUpperCase()} (Rate: {user.rate})
                </span>
                <span>Total Ticket owned: {user.totalPurchase}</span>
                {user?.active ? (
                  <AlertDialogModal onClick={() => handleRemoveUser(user.id)}>
                    <FiMinusCircle
                      color="red"
                      size="18px"
                      className="cursor-pointer"
                      title="Remove User"
                    />
                  </AlertDialogModal>
                ) : (
                  <IoMdPersonAdd color="green" size="25px" title="Add User" />
                )}
              </div>
              <Separator className="my-2 border-gray-700" />
            </div>
          ))
        ) : (
          <div className="text-sm text-gray-400 text-center mt-4">
            No users available.
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default UserList;
