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
  totalTicketCount: number;
  maxPoolTicketCount: number;
  vendors: VendorOption[];
  customers: CustomerOption[];
}
