import {
  VendorOption,
  CustomerOption,
  ConfigurationData,
} from "@/interfaces/create-configurations";
import { Api } from "./api-handler";

const api = Api.getInstance();

const createVendors = async (data: VendorOption[]) => {
  try {
    const res = await api.post("/ticket-service/vendor/batch", data);
    return { data: res.data, status: res.status };
  } catch {
    return { data: null, status: 500 };
  }
};

const createCustomers = async (data: CustomerOption[]) => {
  try {
    const res = await api.post("/ticket-service/customer/batch", data);
    return { data: res.data, status: res.status };
  } catch {
    return { data: null, status: 500 };
  }
};

const addConfigs = async (data: {
  totalTickets: number;
  maxCapacity: number;
}) => {
  try {
    const res = await api.post("/configuration", data);
    return { data: res.data, status: res.status };
  } catch {
    return { data: null, status: 500 };
  }
};

export const createConfigurationData = async (data: ConfigurationData) => {
  try {
    const [configs, customers, vendors] = await Promise.all([
      addConfigs({
        totalTickets: data.totalTickets,
        maxCapacity: data.maxCapacity,
      }),
      createCustomers(data.customers),
      createVendors(data.vendors),
    ]);

    if (
      configs.status === 200 &&
      customers.status === 200 &&
      vendors.status === 200
    ) {
      return {
        data: {
          configs: configs.data,
          customers: customers.data,
          vendors: vendors.data,
        },
        status: 200,
      };
    }
    return { data: null, status: 500 };
  } catch (error) {
    console.log(error);
    return { data: null, status: 500 };
  }
};
