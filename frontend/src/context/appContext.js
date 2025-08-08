// import React, { useState, createContext, useContext } from "react";

// export const AppContext = createContext();

// const Index = (props) => {
//   const [isDarkMode, setDarkMode] = useState(true);

//   return (
//     <AppContext.Provider value={{ isDarkMode, setDarkMode }}>
//       {props.children}
//     </AppContext.Provider>
//   );
// };
// export default Index;

import React, { useState, createContext, useContext, useEffect } from 'react';

export const AppContext = createContext();

const Index = (props) => {
  // const [selectedContextItem, setSelectedContextItem] = useState('sites');
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem('themeMode') || 'blue-dark'
  );
  // const [contextSite, setContextSite] = useState({ siteId: '', siteName: '' });
  const [contextSite, setContextSite] = useState(() => {
    const storedSite = localStorage.getItem('selectedSite');
    return storedSite ? JSON.parse(storedSite) : { siteId: '', siteName: '' };
  });

  // Function to change mode
  const changeThemeMode = (mode) => {
    localStorage.setItem('themeMode', mode);
    setThemeMode(mode);
  };

  const [isMenuVisible, setMenuVisible] = useState(() => {
    const stored = localStorage.getItem('isMenuVisible');
    return stored !== null ? JSON.parse(stored) : true;
  });
  // const [isMenuVisible, setMenuVisible] = useState(true);

  // useEffect(() => {
  //   if (!localStorage.getItem('themeMode')) {
  //     localStorage.setItem('themeMode', 'purple-dark');
  //     setThemeMode('purple-dark');
  //   }
  // }, []);

  useEffect(() => {
    localStorage.setItem('isMenuVisible', JSON.stringify(isMenuVisible));
  }, [isMenuVisible]);
  useEffect(() => {
    if (contextSite && contextSite.siteId) {
      localStorage.setItem('selectedSite', JSON.stringify(contextSite));
    }
  }, [contextSite]);
  return (
    <AppContext.Provider
      value={{
        themeMode,
        changeThemeMode,
        isMenuVisible,
        setMenuVisible,

        contextSite,
        setContextSite,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export default Index;
