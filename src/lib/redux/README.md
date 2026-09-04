# Redux

## Overview

The `redux` folder contains the Redux Toolkit setup for client-side application state.

The project uses Redux only for state that is owned by the client/application.

Current Redux state contains:

- Theme
- Selected product IDs

Product API data itself is managed by TanStack Query.

---

# `store.js`

`store.js` creates the application's Redux store.

```js
import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./appSlice.js";

export const store = configureStore({
  reducer: {
    app: appReducer,
  },
});
```

## Responsibility

The store:

- Creates the Redux store
- Registers reducers
- Defines the top-level state structure

# `appSlice.js`

`appSlice.js` defines the client-side application state and the reducers that modify it.

It uses Redux Toolkit's `createSlice()`.

## Initial State

```js
const initialState = {
  theme: getInitialTheme(),
  selectedProductIds: [],
};
```

The slice therefore owns two pieces of state:

### Theme

Stores either:

```text
light
dark
```

### Selected Product IDs

Stores the IDs of products currently selected for bulk operations.

Example:

```js
selectedProductIds: ["1", "4", "8"]
```

Only IDs are stored rather than complete product objects.

This avoids duplicating product data that already belongs to TanStack Query.

---

# `getInitialTheme()`

This function determines the initial theme.

It checks:

1. Whether a previously saved theme exists in `localStorage`.
2. Whether that saved value is valid.
3. Otherwise, the user's system color preference.

The priority is:

```text
Saved theme
    ↓
System preference
```

This gives the user a persistent theme preference while still providing a sensible default.

---

# Reducers

## `toggleTheme`

Switches between light and dark mode.

```text
light → dark
dark → light
```

---

## `setTheme`

Directly sets the theme from the dispatched action payload.

Conceptually:

```text
dispatch(setTheme("dark"))
```

updates:

```js
theme: "dark"
```

---

## `toggleProductSelection`

Toggles one product ID.

If the ID is already selected, it is removed.

If it is not selected, it is added.

```text
Selected → Deselect
Not selected → Select
```

---

## `selectProducts`

Adds multiple product IDs to the current selection.

A `Set` is used to prevent duplicates:

```js
new Set([
  ...state.selectedProductIds,
  ...ids,
])
```

This ensures the selection remains unique.

---

## `deselectProducts`

Removes multiple IDs from the selection.

The incoming IDs are converted to a `Set`, making membership checks straightforward.

---

## `clearSelection`

Removes all selected product IDs:

```js
selectedProductIds = []
```

This is used when the application needs to reset the current selection.

---

# Redux Toolkit and Mutation Style

The reducers appear to directly modify `state`:

```js
state.theme = ...
state.selectedProductIds.push(productId)
```

This is intentional.

Redux Toolkit uses **Immer** internally, which allows developers to write mutation-like code while producing an immutable state update behind the scenes.

So this:

```js
state.selectedProductIds.push(productId)
```

does not mean the Redux state is being unsafely mutated.

---

# `selectors.js`

`selectors.js` contains reusable functions for reading Redux state.

Selectors keep components from repeatedly knowing the exact Redux state structure.

## `selectTheme`

Returns the current theme.

```js
selectTheme(state)
```

---

## `selectSelectedProductIds`

Returns the complete selected-product ID array.

---

## `selectSelectedProductCount`

Derives the number of selected products:

```js
state.app.selectedProductIds.length
```

This is **derived state**.

The count does not need to be stored separately because it can be calculated from the source array.

---

## `selectHasSelectedProducts`

Returns whether at least one product is selected.

```js
state.app.selectedProductIds.length > 0
```

Again, this is derived state rather than separately stored state.

---

## `selectIsProductSelected`

This is a selector factory.

It first receives a product ID:

```js
selectIsProductSelected(productId)
```

and returns a selector that receives Redux state:

```js
(state) => state.app.selectedProductIds.includes(productId)
```

This makes it convenient to check whether a particular product is selected.

---

# State Flow

The Redux flow is:

```text
User interaction
      ↓
dispatch(action)
      ↓
Reducer
      ↓
Redux store
      ↓
Selector
      ↓
Component
```