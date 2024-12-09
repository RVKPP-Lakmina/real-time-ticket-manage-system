import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import UserCreateForm from "../forms/UserCreateForm";

export function CreateUserFormModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Create User</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Create a new user by filling the form below.
          </DialogDescription>
        </DialogHeader>
        <UserCreateForm />
      </DialogContent>
    </Dialog>
  );
}
