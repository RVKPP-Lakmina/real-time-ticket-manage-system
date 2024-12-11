export interface UserCreate {
  name: string;
  rate: number;
  prefix: "vendor" | "customer";
}
