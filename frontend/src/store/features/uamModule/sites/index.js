// import { extendedApi } from "./apis";
// import { createSlice, isAnyOf } from "@reduxjs/toolkit";

// const initialState = {
//   all_data: [],
// };

// const siteSlice = createSlice({
//   name: "site",
//   initialState,
//   reducers: {
//     addUsers: (state, action) => {
//       state.all_data = action.payload;
//     },
//   },
//   extraReducers(builder) {
//     builder
//       .addMatcher(
//         extendedApi.endpoints.fetchSites.matchFulfilled,
//         (state, action) => {
//           state.all_data = action.payload;
//         }
//       )
//       // .addMatcher(
//       //   extendedApi.endpoints.addSite.matchFulfilled,
//       //   (state, action) => {
//       //     action.payload.data.forEach((responseItem) => {
//       //       const indexToUpdate = state.all_data.findIndex((tableItem) => {
//       //         return (
//       //           tableItem.sites_id === responseItem.sites_id
//       //         );
//       //       });
//       //       if (indexToUpdate !== -1) {
//       //         state.all_data[indexToUpdate] = responseItem;
//       //       } else {
//       //         state.all_data.push(responseItem);
//       //       }
//       //     });
//       //   }
//       // )
//       .addMatcher(
//         extendedApi.endpoints.deleteSite.matchFulfilled,
//         (state, action) => {
//           const deletedIds = action.payload?.data || [];
//           if (deletedIds.length > 0) {
//             state.all_data = state.all_data.filter((item) => {
//               const shouldKeepItem = deletedIds.some((deletedId) => {
//                 return deletedId === item.site_id;
//               });
//               return !shouldKeepItem;
//             });
//           }
//         }
//       )
//       .addMatcher(
//         extendedApi.endpoints.addSite.matchFulfilled,
//         (state, action) => {
//           state.all_data.push(action.payload.data);
//         }
//       )
//       .addMatcher(
//         extendedApi.endpoints.updateSite.matchFulfilled,
//         (state, action) => {
//           let objectToReplace = action.payload.data;
//           state.all_data = state.all_data.map((item) => {
//             if (item.site_id === objectToReplace.site_id) {
//               return { ...item, ...objectToReplace };
//             } else {
//               return item;
//             }
//           });
//         }
//       );
//   },
// });

// // export const { setNextPage, initiateItem } = passwordGroupSlice.actions;
// export default siteSlice.reducer;
