/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useRef } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import AlertToast from "@/classes/toast";
import Select, { MultiValue } from "react-select";
import useMainStore from "@/hooks/use-main-store";
import { CachedStorege } from "@/service/cache/cachine-storage";
import { ConfigurationData } from "@/interfaces/create-configurations";
import { createConfigurationData } from "@/service/api/create-configs";

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

const customStyles = {
  multiValue: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    maxHeight: "20px",
  }),
};

const TicketBookingForm: React.FC = () => {
  const { register, handleSubmit, setValue, reset } =
    useForm<ConfigurationData>();

  const { filteredData } = useMainStore();
  const latestResponse = filteredData[filteredData.length - 1];
  const errors: any = useRef({});

  const options = useMemo(() => {
    const users = CachedStorege.instance.get("users") || [];
    const vendorsOptions: VendorOption[] = users
      .filter((user: any) => user.prefix === "vendor")
      .map((user: any) => ({
        value: user.id,
        label: user.name,
        rate: user.rate,
      }));

    const customersOptions: CustomerOption[] = users
      .filter((user: any) => user.prefix === "customer")
      .map((user: any) => ({
        value: user.id,
        label: user.name,
        rate: user.rate,
      }));

    return { vendorsOptions, customersOptions };
  }, []);

  const onSubmit: SubmitHandler<ConfigurationData> = async (
    data: ConfigurationData
  ) => {
    try {
      const { maxPoolTicketCount, totalTicketCount, customers, vendors } = data;
      const errorItems: any = {};
      if (!totalTicketCount) {
        errorItems["totalTicketCount"] = {
          message: "Total Ticket Count is required",
        };
      }

      if (!maxPoolTicketCount) {
        errorItems["maxPoolTicketCount"] = {
          message: "Maximum Pool Ticket Count is required",
        };
      }

      if (
        maxPoolTicketCount &&
        totalTicketCount &&
        maxPoolTicketCount > totalTicketCount
      ) {
        errorItems["maxPoolTicketCount"] = {
          message:
            "Maximum Pool Ticket Count must be less than Total Ticket Count",
        };
      }

      if (!customers) {
        errorItems["customers"] = {
          message: "At least one customer is required",
        };
      }

      if (!vendors) {
        errorItems["vendors"] = { message: "At least one vendor is required" };
      }

      if (Object.keys(errorItems).length) {
        errors.current = errorItems;
        return;
      }

      const responseData: any = {
        maxPoolTicketCount,
        totalTicketCount,
        customers: {},
        vendors: {},
      };

      customers.forEach((customer) => {
        responseData.customers[customer.id] = {
          rate: customer.rate,
          name: customer.name,
        };
      });

      vendors.forEach((vendor) => {
        responseData.vendors[vendor.id] = {
          rate: vendor.rate,
          name: vendor.name,
        };
      });

      console.log(responseData);

      const response = await createConfigurationData(responseData);

      if (response.status !== 200) {
        AlertToast.error("Failed to submit the form");
        return;
      }

      AlertToast.success("Form submitted successfully");
      reset();
      setValue("customers", []);
      setValue("vendors", []);
      errors.current = {};
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
              {errors.current.totalTicketCount && (
                <p className="text-red-500">
                  {errors.current.totalTicketCount.message}
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
              {errors.current.maxPoolTicketCount && (
                <p className="text-red-500">
                  {errors.current.maxPoolTicketCount.message}
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
              {errors.current.vendors && (
                <p className="text-red-500">{errors.current.vendors.message}</p>
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
              {errors.current.customers && (
                <p className="text-red-500">
                  {errors.current.customers.message}
                </p>
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
