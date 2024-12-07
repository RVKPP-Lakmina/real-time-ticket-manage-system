import MainStoreProvider from "./providers/MainStoreProvider";
import "./App.css";
import React from "react";
import useMainStore from "./hooks/use-main-store";
import pageMapping from "./components/component-mapping/pages-mappint";

function App() {
  return (
    <MainStoreProvider>
      <ScreenManager />
    </MainStoreProvider>
  );
}

export default App;

const ScreenManager = () => {
  const { currentPage } = useMainStore();

  return <>{React.createElement(pageMapping[currentPage])}</>;
};
