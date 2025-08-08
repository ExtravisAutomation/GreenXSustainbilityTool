import { extendedApi } from "./apis";
import { createSlice, isAnyOf } from "@reduxjs/toolkit";

const initialState = {
  all_data: [],
};

const atomSlice = createSlice({
  name: "atom",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addMatcher(
        extendedApi.endpoints.fetchAtoms.matchFulfilled,
        (state, action) => {
          state.all_data = action.payload;
        }
      )
      .addMatcher(
        extendedApi.endpoints.addAtoms.matchFulfilled,
        (state, action) => {
          action.payload.data.forEach((responseItem) => {
            const indexToUpdate = state.all_data.findIndex((tableItem) => {
              let atomId = responseItem.atom_id;
              let atomTransitionId = responseItem.atom_transition_id;

              if (atomId) {
                return tableItem.atom_id === atomId;
              } else {
                return tableItem.atom_transition_id === atomTransitionId;
              }
            });

            if (indexToUpdate !== -1) {
              state.all_data[indexToUpdate] = responseItem;
            } else {
              state.all_data.push(responseItem);
            }
          });
        }
      )
      .addMatcher(
        extendedApi.endpoints.deleteAtoms.matchFulfilled,
        (state, action) => {
          const deletedIds = action.payload?.data || [];
          if (deletedIds.length > 0) {
            state.all_data = state.all_data.filter((item) => {
              const atomId = item.atom_id;
              const transitionId = item.atom_transition_id;
              const shouldKeepItem = deletedIds.some((id) => {
                if (atomId) {
                  return id.atom_id === atomId;
                } else {
                  return id.atom_transition_id === transitionId;
                }
              });
              return !shouldKeepItem;
            });
          }
        }
      )

      .addMatcher(
        extendedApi.endpoints.addAtom.matchFulfilled,
        (state, action) => {
          action.payload.data.atom_table_id = Date.now();
          state.all_data.push(action.payload.data);
        }
      )
      .addMatcher(
        extendedApi.endpoints.updateAtom.matchFulfilled,
        (state, action) => {
          let objectToReplace = action.payload.data;
          state.all_data = state.all_data.map((item) => {
            const atomId = item.atom_id;
            const transitionId = item.atom_transition_id;
            if (atomId && atomId === objectToReplace.atom_id) {
              return { ...item, ...objectToReplace };
            } else if (
              transitionId &&
              transitionId === objectToReplace.atom_transition_id
            ) {
              return { ...item, ...objectToReplace };
            } else {
              return item;
            }
          });
        }
      );
  },
});

// export const { setNextPage, initiateItem } = atomSlice.actions;
export default atomSlice.reducer;
