# Product Management CRUD Assignment - Week 7 Assignment

## Overview

A React-based Product Management application demonstrating modern frontend state-management patterns and CRUD operations.

The application supports product listing, searching, filtering, pagination, product creation, editing, deletion, bulk actions, optimistic updates, and responsive UI states.

---

## Module Responsibility

| Module | Responsibility |
|---|---|
| `components/` | UI components, user interactions, forms, tables, modals, pagination, and UI states |
| `hooks/` | Custom React hooks for product queries, mutations, URL parameters, and application behavior |
| `lib/redux/` | Redux Toolkit store, client-side application state, reducers, and selectors |
| `lib/query/` | TanStack Query client configuration and server-state caching defaults |
| `services/` | Product API communication and CRUD requests |
| `utils/` | Reusable validation, formatting, and debounce utilities |

Detailed documentation for each module is available in its respective folder README.

---

## Week 7 Concepts Used

### 1. State Classification & State Ownership

The application separates local, client, server, URL, and form state based on who owns the data and who needs it.

This prevents unnecessary global state and keeps each piece of state in the appropriate layer.

### 2. Redux Toolkit

Redux Toolkit manages client-owned application state that needs to be shared across the application.

In this project, it manages the theme and selected product IDs for bulk operations.

### 3. Redux Store & Slices

The Redux store provides the centralized state container, while `appSlice` defines the state and reducers for application-level state.

The slice contains actions such as theme changes, product selection, deselection, and clearing the selection.

### 4. Selectors & Derived State

Selectors provide reusable functions for reading Redux state without tightly coupling components to the store structure.

Values such as selected product count and whether any products are selected are derived instead of stored separately.

### 5. TanStack Query

TanStack Query manages server-owned product data and the lifecycle of API requests.

It handles fetching, caching, loading, errors, refetching, mutations, and query invalidation.

### 6. Query Keys

Query keys uniquely identify cached queries, using product parameters such as search, filters, and pagination.

This allows TanStack Query to maintain separate cached results for different product views.

### 7. Caching & `staleTime`

The application configures a 30-second `staleTime`, allowing recently fetched product data to remain fresh.

Caching reduces unnecessary requests while still allowing data to become stale and be refreshed when appropriate.

### 8. Mutations

TanStack Query mutations are used for creating, updating, deleting, and changing product status.

Mutation hooks coordinate the API operation with cache updates, rollback behavior, and invalidation.

### 9. Optimistic Updates

Product updates and deletions update the UI immediately instead of waiting for the server response.

The previous cache is stored so the changes can be rolled back if the server operation fails.

### 10. Query Cancellation & `AbortSignal`

The product query receives TanStack Query's `AbortSignal` and passes it to the native `fetch()` request.

This allows unnecessary or cancelled requests to be aborted rather than continuing in the background.

### 11. URL State

Search, filters, and pagination are stored in the URL so the current product view can be represented by a shareable URL.

Browser history events are also handled so navigation between previous and next URL states can update the application.

### 12. Debounced Search

The search input uses a 500ms debounce so the application does not update the search state on every keystroke.

The callback runs only after the user stops typing for the configured delay.

### 13. Pagination

The product API requests one additional record (`limit + 1`) to determine whether another page exists.

Only the requested page size is displayed, while the extra record is used to calculate `hasNextPage`.

### 14. Custom Hooks

Custom hooks separate reusable application behavior from UI components.

Examples include `useProducts` for queries, mutation hooks for CRUD operations, and `useProductParams` for URL state.

### 15. Loading, Error & Empty States

The UI explicitly handles loading, error, and empty-product scenarios instead of assuming that data always exists.

This provides clearer feedback to users during API requests, failures, and searches with no matching products.

### 16. Bulk Operations

Bulk actions allow multiple selected products to be updated or deleted together.

Product IDs are stored in Redux, while the actual API operations are performed through mutation hooks and the service layer.

### 17. `Promise.allSettled()`

Bulk operations use `Promise.allSettled()` because multiple API requests can succeed or fail independently.

This allows the application to wait for every requested operation and then determine whether the overall operation succeeded.

### 18. Form & UI State

Form values, validation errors, modal visibility, and submission-related UI state remain local to the relevant components.

These values are temporary UI concerns and do not need to be stored in Redux or TanStack Query.

---

## Local Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd Product-Management-CRUD-Assignment
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the development server

```bash
npm run dev
```

The application will be available at the local URL shown by Vite, typically:

```text
http://localhost:5173
```

### 4. Build for production

```bash
npm run build
```

### 5. Run linting

```bash
npm run lint
```

---

## Demo Link

**Live Demo:** _To be added_
