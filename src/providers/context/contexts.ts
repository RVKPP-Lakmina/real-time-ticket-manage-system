import { MainStoreContextInterface } from "@/interfaces/main-store";
import { createContext } from "react";

export const MainStoreContext = createContext<
  MainStoreContextInterface | undefined
>(undefined);
