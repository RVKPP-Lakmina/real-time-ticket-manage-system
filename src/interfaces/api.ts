import { UserCreate } from "./form";

export interface UserCreateResponse extends UserCreate {
  id: string;
}
