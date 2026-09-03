export const selectTheme = (state) =>
  state.app.theme;

export const selectSelectedProductIds = (state) =>
  state.app.selectedProductIds;

export const selectSelectedProductCount = (state) =>
  state.app.selectedProductIds.length;

export const selectHasSelectedProducts = (state) =>
  state.app.selectedProductIds.length > 0;

export const selectIsProductSelected =
  (productId) => (state) =>
    state.app.selectedProductIds.includes(productId);