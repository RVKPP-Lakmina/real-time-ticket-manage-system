/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Select from "react-select";
import * as z from "zod";
import { CachedStorege } from "@/service/cache/cachine-storage";
import { UserCreateResponse } from "@/interfaces/api";

const schema = z.object({
  totalTicketCount: z
    .number()
    .min(1, { message: "Total Ticket Count is required" }),
  maxPoolTicketCount: z
    .number()
    .min(1, { message: "Maximum Pool Ticket Count is required" }),
  vendors: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        rate: z.number().min(0, { message: "Rate must be positive" }),
      })
    )
    .min(1, { message: "At least one vendor is required" }),
  customers: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
      })
    )
    .min(1, { message: "At least one customer is required" }),
});

type FormData = z.infer<typeof schema>;

const customStyles = {
  multiValue: (provided: any) => ({
    ...provided,
    overflowY: "auto",
    maxHeight: "20px", // Set the height limit
  }),
};

const TicketBookingForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const users = CachedStorege.instance.get("users") as UserCreateResponse[];

  const options = useMemo(() => {
    const vendorsOptions = (users || [])
      .map((user: UserCreateResponse) => {
        if (user.prefix === "vendor") {
          return { value: user.id, label: user.name, rate: user.rate };
        }
      })
      .filter((option: { value: string; label: string } | undefined) => option);

    const customersOptions = (users || [])
      .map((user: UserCreateResponse) => {
        if (user.prefix === "customer") {
          return { value: user.id, label: user.name };
        }
      })
      .filter((option: { value: string; label: string } | undefined) => option);

    return { vendorsOptions, customersOptions };
  }, [users]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log(data);
  };

  const handleVendorsChange = (selectedOptions: any) => {
    const vendors = selectedOptions.map((option: any) => ({
      id: option.value,
      name: option.label,
      rate: option.rate,
    }));
    setValue("vendors", vendors);
  };

  const handleCustomersChange = (selectedOptions: any) => {
    const customers = selectedOptions.map((option: any) => ({
      id: option.value,
      name: option.label,
    }));
    setValue("customers", customers);
  };

  return (
    <div className="flex items-center justify-center p-10">
      <div className="bg-gray-700 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold text-white mb-6">
          Ticket Booking Form
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-3 items-center">
            <div>
              <label className="block text-white">Total Ticket Count</label>
              <input
                {...register("totalTicketCount")}
                type="number"
                className="mt-1 p-2 block w-full bg-gray-600 text-white rounded-md"
              />
              {errors.totalTicketCount && (
                <p className="text-red-500">
                  {errors.totalTicketCount.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-white">
                Maximum Pool Ticket Count
              </label>
              <input
                {...register("maxPoolTicketCount")}
                type="number"
                className="mt-1 p-2 block w-full bg-gray-600 text-white rounded-md"
              />
              {errors.maxPoolTicketCount && (
                <p className="text-red-500">
                  {errors.maxPoolTicketCount.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-3 items-stretch">
            <div className="w-1/2">
              <label className="block text-white">Vendors</label>
              <Select
                isMulti
                options={options.vendorsOptions}
                className="basic-multi-select mb-2"
                classNamePrefix="select"
                onChange={handleVendorsChange}
                styles={customStyles}
              />
              {errors.vendors && (
                <p className="text-red-500">{errors.vendors.message}</p>
              )}
            </div>
            <div className="w-1/2">
              <label className="block text-white">Customers</label>
              <Select
                isMulti
                options={options.customersOptions}
                className="basic-multi-select mb-2"
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
            className="bg-purple-600 text-white py-2 px-4 rounded-md w-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketBookingForm;
