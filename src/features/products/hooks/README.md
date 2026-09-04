# Product Hooks

## Overview

The `hooks` folder contains custom React hooks that separate product-related behavior from UI components.

The hooks are divided into three responsibilities:

| Folder | Responsibility | README |
|---|---|---|
| `mutations` | Create, update, delete, and bulk product operations | [Mutation Hooks](./mutations/README.md) |
| `queries` | Fetching and caching product server state | [Query Hooks](./queries/README.md) |
| `params` | Managing search, filters, pagination, and URL state | [URL Parameter Hook](./params/README.md) |

## Architecture

```text
Components
    │
    ├── queries/useProducts
    │       ↓
    │   TanStack Query
    │       ↓
    │   Product API
    │
    ├── mutations/*
    │       ↓
    │   TanStack Query
    │       ↓
    │   Product API
    │
    └── params/useProductParams
            ↓
        Browser URL
```

## Responsibilities

### Mutations

Handles operations that change server-side product data and manages optimistic updates, rollback, invalidation, and bulk operations.

### Queries

Handles reading product data, query keys, caching, pagination, placeholder data, and request cancellation.

### Params

Handles product search, filters, pagination, URL synchronization, and browser Back/Forward behavior.

