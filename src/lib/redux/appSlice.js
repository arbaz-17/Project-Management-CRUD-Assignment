import { createSlice } from "@reduxjs/toolkit";

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(
    "product-management-theme"
  );

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

const initialState = {
  theme: getInitialTheme(),
  selectedProductIds: [],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme =
        state.theme === "dark" ? "light" : "dark";
    },

    setTheme(state, action) {
      state.theme = action.payload;
    },

    toggleProductSelection(state, action) {
      const productId = action.payload;

      const exists = state.selectedProductIds.includes(
        productId
      );

      if (exists) {
        state.selectedProductIds =
          state.selectedProductIds.filter(
            (id) => id !== productId
          );
      } else {
        state.selectedProductIds.push(productId);
      }
    },

    selectProducts(state, action) {
      const ids = action.payload;

      state.selectedProductIds = [
        ...new Set([
          ...state.selectedProductIds,
          ...ids,
        ]),
      ];
    },

    deselectProducts(state, action) {
      const ids = new Set(action.payload);

      state.selectedProductIds =
        state.selectedProductIds.filter(
          (id) => !ids.has(id)
        );
    },

    clearSelection(state) {
      state.selectedProductIds = [];
    },
  },
});

export const {
  toggleTheme,
  setTheme,
  toggleProductSelection,
  selectProducts,
  deselectProducts,
  clearSelection,
} = appSlice.actions;

export default appSlice.reducer;