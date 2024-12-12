/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import AlertToast from "@/classes/toast";
import Select, { MultiValue } from "react-select";
import useMainStore from "@/hooks/use-main-store";
import { CachedStorege } from "@/service/cache/cachine-storage";
import { createConfigurationData } from "@/service/api/create-configs";
import { ConfigurationData } from "@/interfaces/create-configurations";

interface VendorOption {
  value: string;
  label: string;
  rate: number;
}

interface CustomerOption {
  value: string;
  label: string;
  rate: number;
}

const schema = z.object({
  totalTicketCount: z.number().min(1, "Total Ticket Count is required"),
  maxPoolTicketCount: z
    .number()
    .min(1, "Maximum Pool Ticket Count is required")
    .max(10, "Maximum Pool Ticket Count must be less than 10"),
  vendors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        rate: z.number().min(0, "Rate must be positive"),
      })
    )
    .min(1, "At least one vendor is required"),
  customers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        rate: z.number().min(0, "Rate must be positive"),
      })
    )
    .min(1, "At least one customer is required"),
});

type FormData = z.infer<typeof schema>;

const customStyles = {
  multiValue: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    maxHeight: "20px",
  }),
};

const TicketBookingForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const { filteredData } = useMainStore();
  const latestResponse = filteredData[filteredData.length - 1];

  const options = useMemo(() => {
    const users = CachedStorege.instance.get("users") || [];

    const vendorsOptions: VendorOption[] = users
      .filter((user: any) => user.prefix === "vendor")
      .map((user: any) => ({
        value: user.id,
        label: `${user.name} (rate: ${user.rate})`,
        rate: user.rate,
      }));

    const customersOptions: CustomerOption[] = users
      .filter((user: any) => user.prefix === "customer")
      .map((user: any) => ({
        value: user.id,
        label: user.name,
      }));

    return { vendorsOptions, customersOptions };
  }, []);

  const onSubmit: SubmitHandler<FormData> = async (data: ConfigurationData) => {
    try {
      const response = await createConfigurationData(data);

      console.log(response);

      AlertToast.success("Form submitted successfully");
      reset();
      setValue("customers", []);
      setValue("vendors", []);
    } catch {
      AlertToast.error("Failed to submit the form");
    }
  };

  const handleVendorsChange = (selectedOptions: MultiValue<VendorOption>) => {
    const vendors = selectedOptions.map((option) => ({
      id: option.value,
      name: option.label,
      rate: option.rate,
    }));
    setValue("vendors", vendors);
  };

  const handleCustomersChange = (
    selectedOptions: MultiValue<CustomerOption>
  ) => {
    const customers = selectedOptions.map((option) => ({
      id: option.value,
      name: option.label,
      rate: option.rate,
    }));
    setValue("customers", customers);
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div
        className={cn("bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg")}
      >
        <h2 className="text-2xl font-bold text-white mb-6">
          Ticket Booking Form
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="totalTicketCount" className="text-gray-400">
                Total Ticket Count
              </Label>
              <Input
                className="mt-1 bg-gray-700 text-white border border-gray-600 rounded-md"
                type="number"
                {...register("totalTicketCount", { valueAsNumber: true })}
                disabled={latestResponse?.activeStatus}
              />
              {errors.totalTicketCount && (
                <p className="text-red-500">
                  {errors.totalTicketCount.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="maxPoolTicketCount" className="text-gray-400">
                Maximum Pool Ticket Count
              </Label>
              <Input
                type="number"
                className="mt-1 bg-gray-700 text-white border border-gray-600 rounded-md"
                {...register("maxPoolTicketCount", { valueAsNumber: true })}
                disabled={latestResponse?.activeStatus}
              />
              {errors.maxPoolTicketCount && (
                <p className="text-red-500">
                  {errors.maxPoolTicketCount.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-gray-400">Vendors</Label>
              <Select
                isMulti
                className="mt-1 bg-gray-700  border border-gray-600 rounded-md"
                options={options.vendorsOptions}
                classNamePrefix="select"
                onChange={handleVendorsChange}
                styles={customStyles}
              />
              {errors.vendors && (
                <p className="text-red-500">{errors.vendors.message}</p>
              )}
            </div>

            <div>
              <Label className="text-gray-400">Customers</Label>
              <Select
                isMulti
                className="mt-1 bg-gray-700  border border-gray-600 rounded-md"
                options={options.customersOptions}
                classNamePrefix="select"
                onChange={handleCustomersChange}
              />
              {errors.customers && (
                <p className="text-red-500">{errors.customers.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={latestResponse?.activeStatus}
            className={cn(
              "bg-purple-600 text-white py-2 px-4 rounded-md w-full active:bg-purple-800"
            )}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketBookingForm;
