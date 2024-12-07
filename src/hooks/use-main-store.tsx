import { MainStoreContextInterface } from "@/interfaces/main-store";
import { MainStoreContext } from "@/providers/context/contexts";
import React from "react";

const useMainStore = (): MainStoreContextInterface => {
  const context = React.useContext(MainStoreContext);

  if (context === undefined) {
    throw new Error("useMainStore must be used within a MainStoreProvider");
  }
  return context;
};

export default useMainStore;
