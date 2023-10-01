import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import App from "../App";
import AppContext from "./context/appContext";

let MainApp = () => {
  let location = useLocation();
  let appStates = {
    loginStatus: false,
    user: null,
    activeFeedTab: "relevent",
    currentPath: location.pathname,
    location,
    navigateTo: useNavigate(),
  };
  const [state, setState] = useState(appStates);
  return (
    <>
      <AppContext.Provider
        value={{
          state,
          setState,
        }}
      >
        <App />
      </AppContext.Provider>
    </>
  );
};

export default MainApp;
