import * as React from 'react';
import { useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { RouterProvider } from 'react-router-dom';
import { store } from './store';
import store2 from './store/store';
import { Provider } from 'react-redux';
import {
  lightTheme,
  darkTheme,
  lightBlueTheme,
  darkGreenTheme,
  darkPurpleTheme,
  lightPurpleTheme,
} from './themes';
import router from './routes';
import { AppContext } from './context/appContext';
import Login from '../src/containers/login/index';
import './index.css';
import Notification from './components/notification';

export const THEME_LABELS = {
  GREEN_DARK: 'Green Dark',
  BLUE_DARK: 'Blue Dark',
  GREEN_LIGHT: 'Green Light',
  BLUE_LIGHT: 'Blue Light',
  // mycode added here
  PURPLE_LIGHT: 'Purple Light',
  PURPLE_DARK: 'Purple Dark',
};

function App() {
  const { themeMode } = useContext(AppContext);
  const theme =
    themeMode === THEME_LABELS.GREEN_DARK.toLowerCase().replace(' ', '-')
      ? darkGreenTheme
      : themeMode === THEME_LABELS.GREEN_LIGHT.toLowerCase().replace(' ', '-')
        ? lightTheme
        : themeMode === THEME_LABELS.BLUE_DARK.toLowerCase().replace(' ', '-')
          ? darkTheme
          : themeMode ===
              THEME_LABELS.BLUE_LIGHT.toLowerCase().replace(' ', '-')
            ? lightBlueTheme
            : themeMode ===
                THEME_LABELS.PURPLE_DARK.toLowerCase().replace(' ', '-')
              ? darkPurpleTheme
              : themeMode ===
                  THEME_LABELS.PURPLE_LIGHT.toLowerCase().replace(' ', '-')
                ? lightPurpleTheme
                : darkTheme;

  return (
    <div
      className="relative"
      style={{
        backgroundColor: theme.palette.background.default,
        height: 'auto',
        width: '100%',
      }}
    >
      <Provider store={store}>
        <Notification />

        <ThemeProvider theme={theme}>
          <RouterProvider router={router} />
        </ThemeProvider>
      </Provider>

      {/* <Login/> */}
    </div>
  );
}

export default App;
