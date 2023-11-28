import * as React from "react";
import { useContext } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { RouterProvider } from "react-router-dom";
import { store } from "./store";
import { Provider } from "react-redux";
import { lightTheme, darkTheme } from "./themes";
import router from "./routes";
import { AppContext } from "./context/appContext";
import Login from "../src/containers/login/index"
import "./index.css";


function App() {

  const { isDarkMode } = useContext(AppContext);
  const theme = isDarkMode ? darkTheme : lightTheme;
  return (
    <div 
    className="relative"   style={{
      backgroundColor: theme.palette.background.default,
      height: "auto",
      width: "100%",
    }}
    >
      <Provider store={store}>
<ThemeProvider theme={theme}>
  <RouterProvider router={router}/>
</ThemeProvider>



      </Provider>
      
      {/* <Login/> */}
    </div>
  );
}

export default App;
