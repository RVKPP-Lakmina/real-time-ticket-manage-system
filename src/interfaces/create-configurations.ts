export interface VendorOption {
  id: string;
  name: string;
  rate: number;
}

export interface CustomerOption {
  id: string;
  name: string;
  rate: number;
}

export interface ConfigurationData {
  totalTickets: number;
  maxCapacity: number;
  vendors: VendorOption[];
  customers: CustomerOption[];
}
