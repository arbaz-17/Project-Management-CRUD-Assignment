# Lib

## Overview

The `lib` folder contains application-level infrastructure and configuration for state management and server-state caching.

It is divided into two areas:

| Folder | Responsibility |
|---|---|
| `query/` | TanStack Query client configuration |
| `redux/` | Redux Toolkit client-state management |

## State Management Architecture

This project deliberately uses two different tools for two different kinds of state.

```text
                    Application State
                           │
             ┌─────────────┴─────────────┐
             │                           │
        Client State                Server State
             │                           │
       Redux Toolkit              TanStack Query
             │                           │
       ┌─────┴─────┐                    │
       │           │                    │
     Theme     Product Selection     Products/API data
```

### Redux Toolkit

Redux manages client-owned state such as:

- Theme
- Selected product IDs

### TanStack Query

TanStack Query manages server-owned product data such as:

- Product list
- Loading state
- Errors
- Cached responses
- Stale/fresh state
- Mutations
- Optimistic updates

This separation prevents server data from being unnecessarily duplicated inside Redux.

## Folder Responsibilities

### `query/`

Contains the configured `QueryClient` used by TanStack Query.

The configuration defines defaults for query behavior, including how long successfully fetched data remains fresh.

### `redux/`

Contains the Redux Toolkit store, application slice, and selectors.

It provides a structured place for client-side state that needs to be shared across unrelated parts of the application.
