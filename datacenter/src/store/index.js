import { configureStore } from "@reduxjs/toolkit";
import { monetxApi } from "./features/apiSlice";
import atomReducer from "./features/atomModule/atom";
import passwordGroupReducer from "./features/atomModule/passwordGroup";
import siteReducer from "./features/uamModule/sites"
import rackReducer from "./features/uamModule/racks"
import locationReducer from "./features/uamModule/location";
import inventoryReducer from "./features/uamModule/inventory";
import deviceReducer from "./features/uamModule/devices"
import boardReducer from "./features/uamModule/boards"
import subBoardReducer from "./features/uamModule/subBoards"
import sfpsReducer from "./features/uamModule/sfps";
import licenseReducer from "./features/uamModule/licences"
import apsReducer from "./features/uamModule/aps"
import hwLiveCycleReducer from "./features/uamModule/hwLiveCycle";
import dropDownsReducer from "./features/dropDowns";


export const store = configureStore({
  reducer: {
    atom: atomReducer,
    password_group: passwordGroupReducer,
    site:siteReducer,
    rack:rackReducer,
    location:locationReducer,
    inventory:inventoryReducer,
    device:deviceReducer,
    board:boardReducer,
    sub_board:subBoardReducer,
    sfps:sfpsReducer,
    license:licenseReducer,
    aps:apsReducer,
    hwlivecycle:hwLiveCycleReducer,
    drop_downs: dropDownsReducer,
    [monetxApi.reducerPath]: monetxApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(monetxApi.middleware),
});
