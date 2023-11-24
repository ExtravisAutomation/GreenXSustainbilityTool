import React, { useState, createContext, useContext } from "react";

export const AppContext = createContext();

const Index = (props) => {
  const [isDarkMode, setDarkMode] = useState(true);

  return (
    <AppContext.Provider value={{ isDarkMode, setDarkMode }}>
      {props.children}
    </AppContext.Provider>
  );
};
export default Index;