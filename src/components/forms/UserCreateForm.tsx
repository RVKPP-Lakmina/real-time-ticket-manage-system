import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { saveUser } from "@/service/api/create-user-api";
import AlertToast from "@/classes/toast";

const schema = z.object({
  name: z.string().min(1, { message: "User Name is required" }),
  rate: z
    .number()
    .min(1, { message: "Maximu Rate is required" })
    .max(10, { message: "Maximum Rate must be less than 10" }),
  userType: z
    .enum(["vendor", "customer"])
    .refine((value) => value, { message: "User type must be selected" }),
});

type FormData = z.infer<typeof schema>;

const UserCreateForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      userType: undefined,
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      const { name, rate, userType } = data;

      const response = await saveUser({ name, rate, prefix: userType });

      if (response.status === 200) {
        AlertToast.success("User Created SuccessFully");
        reset();
        return;
      }
      AlertToast.error("Failed to create user");
    } catch {
      AlertToast.error("Failed to create user");
    }
  };

  const watchUserType = watch("userType");

  return (
    <div className="w-full h-3/4 flex justify-center items-center">
      <div className="max-w-md w-full mx-auto p-6 rounded-lg bg-gray-800 text-white shadow-lg">
        <h2 className="font-bold text-2xl mb-6">Sign Up</h2>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="flex space-x-4">
            <LabelInputContainer>
              <Label htmlFor="name" className="text-gray-400">
                User Name
              </Label>
              <Input
                id="name"
                type="string"
                placeholder="John Doe"
                className="bg-gray-700 text-white border border-gray-600 rounded-md"
                {...register("name", {})}
              />
              {errors.name && (
                <p className="text-red-500">{errors.name.message}</p>
              )}
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="rate" className="text-gray-400">
                Maximum Rate
              </Label>
              <Input
                id="rate"
                type="number"
                placeholder="1"
                className="bg-gray-700 text-white border border-gray-600 rounded-md"
                {...register("rate", {
                  valueAsNumber: true,
                })}
              />
              {errors.rate && (
                <p className="text-red-500">{errors.rate.message}</p>
              )}
            </LabelInputContainer>
          </div>
          <div>
            <Label className="text-gray-400 mb-2">User Type</Label>
            <div className="flex items-center space-x-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="vendor"
                    checked={watchUserType === "vendor"}
                    className="accent-blue-500"
                    onChange={() => setValue("userType", "vendor")}
                  />
                  <span>Vendor</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value="customer"
                    checked={watchUserType === "customer"}
                    className="accent-blue-500"
                    onChange={() => setValue("userType", "customer")}
                  />
                  <span>Customer</span>
                </label>
              </div>
            </div>
            {errors.userType && (
              <p className="text-red-500">{errors.userType.message}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-md font-medium"
          >
            Sign up &rarr;
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserCreateForm;

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
