# Product Components

## 1. Overview

The `components` folder contains the UI components for the Product Management CRUD feature. The components are responsible for displaying products, handling user interactions, collecting form input, showing confirmation dialogs, managing filters, pagination, and presenting loading, error, and empty states.

`ProductCatalog` acts as the main orchestration component. It connects the UI with URL parameters, Redux client state, TanStack Query hooks, mutation hooks, and the individual presentational components.

---

## 2. Component Architecture

```text
ProductCatalog
│
├── ProductToolbar
│   ├── Search
│   ├── Category filter
│   ├── Status filter
│   ├── Refresh
│   ├── Theme toggle
│   └── Add Product
│
├── ProductTable
│   ├── Product rows
│   ├── Row selection
│   ├── Edit / Delete actions
│   └── BulkActionsMenu
│
├── ProductPagination
│
├── ProductFormModal
│   ├── Add product
│   └── Edit product
│
├── DeleteProductModal
│
├── BulkDeleteProductsModal
│
└── UI States
    ├── ProductLoadingState
    ├── ProductErrorState
    └── ProductEmptyState
```

The components follow a feature-oriented structure where `ProductCatalog` coordinates the feature while smaller components focus on specific UI responsibilities.

---

## 3. Component List

| Component | Purpose | Responsibility |
|---|---|---|
| `ProductCatalog` | Main feature container | Coordinates data, state, mutations, and child components |
| `ProductTable` | Product table | Displays products, selection, row actions, and bulk actions |
| `ProductToolbar` | Toolbar and filters | Handles search, filters, refresh, theme, and add-product action |
| `ProductFormModal` | Product form | Creates and edits products with client-side validation |
| `DeleteProductModal` | Delete confirmation | Confirms deletion of one product |
| `BulkDeleteProductsModal` | Bulk delete confirmation | Confirms deletion of multiple selected products |
| `BulkActionsMenu` | Bulk actions | Provides bulk delete and status-update actions |
| `ProductPagination` | Pagination controls | Navigates between product pages |
| `ProductTableSkeleton` | Loading skeleton | Provides a table-oriented loading UI |
| `ProductLoadingState` | Loading state | Displays loading feedback |
| `ProductErrorState` | Error state | Displays an error message and retry action |
| `ProductEmptyState` | Empty state | Handles cases where no products match the current filters |

---

# 4. ProductCatalog

## Purpose

`ProductCatalog` is the main orchestration component for the product management feature. It brings together URL state, Redux state, TanStack Query data, mutation hooks, and UI components.

It does not directly perform API requests. Instead, it delegates server operations to custom hooks and services.

## Responsibilities

- Read and update product URL parameters.
- Fetch products through `useProducts`.
- Handle create, update, delete, and bulk mutations.
- Manage selected product IDs through Redux.
- Manage modal visibility through local React state.
- Pass data and event handlers to child components.
- Handle loading, error, and empty states.
- Display toast feedback after mutations.
- Coordinate pagination and filters.

## State Used

| State | Source | Reason |
|---|---|---|
| Product data | TanStack Query | Server-owned data |
| Selected product IDs | Redux | Shared client-side state |
| Product modal | React `useState` | Local UI state |
| Delete modal | React `useState` | Local UI state |
| Bulk delete modal | React `useState` | Local UI state |
| Search/filter/page | URL parameters | Navigational/filter state |

## Hooks Used

`ProductCatalog` uses several custom hooks:

- `useProductParams` — manages search, filters, and pagination in the URL.
- `useProducts` — fetches and caches product data.
- `useCreateProduct` — creates products.
- `useUpdateProduct` — updates products.
- `useDeleteProduct` — deletes a product.
- `useBulkDeleteProducts` — deletes multiple products.
- `useBulkUpdateProductStatus` — changes the status of multiple products.

Redux is used through `useDispatch` and `useSelector` for product selection.

## Data Flow

```text
URL Parameters
      ↓
useProductParams
      ↓
useProducts
      ↓
TanStack Query
      ↓
Product API Service
      ↓
API
      ↓
ProductCatalog
      ↓
ProductTable
```

For mutations:

```text
User Action
    ↓
ProductCatalog Handler
    ↓
Mutation Hook
    ↓
Product API Service
    ↓
API
    ↓
Cache Update / Rollback
    ↓
Toast Feedback
```

## CRUD Operations

### Create

When the user submits the add-product form:

1. The modal validates the form.
2. `ProductCatalog` closes the modal immediately.
3. `useCreateProduct` sends the request.
4. TanStack Query invalidates the product queries after success.
5. A success or error toast is displayed.

### Update

When editing a product:

1. The form validates the updated values.
2. The modal closes immediately.
3. `useUpdateProduct` performs an optimistic update.
4. The cached product data is updated immediately.
5. If the request fails, the previous cache is restored.
6. A toast communicates the final result.

### Delete

For a single product:

1. A confirmation modal is displayed.
2. The modal closes immediately after confirmation.
3. `useDeleteProduct` optimistically removes the product from the cache.
4. The previous state is restored if the request fails.
5. A toast communicates success or failure.

### Bulk Actions

Selected product IDs are stored in Redux. Bulk operations support:

- Delete selected products.
- Mark selected products as active.
- Mark selected products as inactive.

Selection is cleared immediately when the bulk operation starts, matching the optimistic UI behavior.

---

# 5. ProductTable

## Purpose

`ProductTable` displays the current page of products in a semantic HTML table and provides row-level and bulk selection actions.

## Responsibilities

- Render product information.
- Display formatted category, price, and date values.
- Show stock and status information.
- Handle individual product selection.
- Handle select-all functionality.
- Display an indeterminate checkbox when only some rows are selected.
- Provide edit and delete actions.
- Display the bulk selection action bar.

## Selection Behavior

The component calculates:

```text
allSelected
someSelected
```

based on the products currently visible on the page.

```text
No selected rows
      ↓
Unchecked

Some rows selected
      ↓
Indeterminate

All visible rows selected
      ↓
Checked
```

The actual selected product IDs are managed outside the table through Redux.

---

# 6. ProductToolbar

## Purpose

`ProductToolbar` provides the primary controls for searching, filtering, refreshing, changing the theme, and adding products.

## Key Features

- Debounced product-title search.
- Category filtering.
- Status filtering.
- Clear filters.
- Refresh products.
- Light/dark theme toggle.
- Add-product action.
- Active filter count.

Search uses the shared `debounce` utility with a 500ms delay to avoid updating the URL and triggering product queries on every keystroke.

The toolbar receives state and callbacks from `ProductCatalog` instead of directly managing product data.

---

# 7. ProductFormModal

## Purpose

`ProductFormModal` is a reusable modal form used for both creating and editing products.

## Key Features

- Supports `add` and `edit` modes.
- Controlled form inputs.
- Client-side validation.
- Field-level error messages.
- Numeric conversion for price and stock.
- Category and status selection.
- Auto-focus on the product name.
- Modal backdrop click handling.
- Accessible dialog semantics.

## Form State

Form values are local to the modal because they represent temporary user input rather than shared application state.

```text
User Input
    ↓
Local formData
    ↓
Validation
    ↓
onSubmit()
    ↓
ProductCatalog
    ↓
Mutation Hook
```

The form uses `validateProductForm` from the utilities layer rather than putting validation logic directly into the component.

---

# 8. DeleteProductModal

## Purpose

Provides a confirmation dialog before deleting a single product.

It receives the product to delete and callback functions for confirmation and closing the modal.

The actual deletion logic remains in `ProductCatalog` and the mutation hook.

---

# 9. BulkDeleteProductsModal

## Purpose

Provides confirmation before deleting multiple selected products.

It receives the number of selected products and callbacks for confirming or cancelling the operation.

The actual bulk deletion is handled by `ProductCatalog` through `useBulkDeleteProducts`.

---

# 10. BulkActionsMenu

## Purpose

Provides actions that can be performed on the currently selected products.

Supported actions include:

- Delete selected products.
- Mark selected products as active.
- Mark selected products as inactive.

The component focuses on presenting the actions while `ProductCatalog` handles the actual operations.

---

# 11. ProductPagination

## Purpose

Provides previous and next page controls for navigating through the product list.

It receives the current page and `hasNextPage` information and updates the URL page parameter through callbacks provided by `ProductCatalog`.

Pagination is therefore treated as URL state rather than local component state.

---

# 12. ProductTableSkeleton

## Purpose

Provides a table-shaped loading placeholder while product data is being loaded.

This improves perceived loading behavior by keeping the layout similar to the final product table.

---

# 13. UI State Components

## ProductLoadingState

Displays a loading state when product data is being fetched.

## ProductErrorState

Displays an error message when fetching products fails and provides a retry action.

## ProductEmptyState

Displays a helpful empty state when no products are available for the current search or filters. It can also provide a way to clear active filters.

These components keep loading, error, and empty UI separate from the main product rendering logic.

---

# 14. Component Communication

`ProductCatalog` acts as the feature-level coordinator.

```text
                    ProductCatalog
                          │
          ┌───────────────┼────────────────┐
          ↓               ↓                ↓
 ProductToolbar      ProductTable      Pagination
          │               │
          │               ├── Row actions
          │               ├── Selection
          │               └── Bulk actions
          │
          └── Search / Filters / Add

ProductCatalog
      │
      ├── ProductFormModal
      ├── DeleteProductModal
      └── BulkDeleteProductsModal
```
---

# 15. State Management Responsibilities

| State | Managed By | Why |
|---|---|---|
| Product data | TanStack Query | Server state and caching |
| Selected product IDs | Redux Toolkit | Shared client-side selection state |
| Theme | Redux Toolkit | Application-wide client state |
| Search | URL | Shareable/navigational state |
| Category filter | URL | Shareable/filter state |
| Status filter | URL | Shareable/filter state |
| Current page | URL | Navigational state |
| Form values | `ProductFormModal` | Temporary local form state |
| Modal visibility | `ProductCatalog` | Local UI state |
| Validation errors | `ProductFormModal` | Local form state |


---
