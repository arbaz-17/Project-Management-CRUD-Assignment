# Mutation Hooks

## 1. Overview

The `mutations` folder contains custom React Query hooks responsible for changing product data on the server.

These hooks provide a consistent mutation layer between UI components and the product API service. They also handle TanStack Query cache management, optimistic updates, rollback behavior, and server-state synchronization.

### Mutation Flow

```text
Component
    ↓
Mutation Hook
    ↓
Product API Service
    ↓
Server / Mock API
    ↓
TanStack Query Cache
```

The mutation hooks keep API and cache-management logic out of the UI components.

---

## 2. Mutation Hooks

| Hook | Purpose | Optimistic Update |
|---|---|---|
| `useCreateProduct` | Creates a new product | No |
| `useUpdateProduct` | Updates an existing product | Yes |
| `useDeleteProduct` | Deletes one product | Yes |
| `useBulkDeleteProducts` | Deletes multiple products | Yes |
| `useBulkUpdateProductStatus` | Updates status of multiple products | Yes |

---

# 3. useCreateProduct

## Purpose

`useCreateProduct` handles creation of a new product.

## Implementation

The hook uses `useMutation` with `createProduct` as its mutation function.

After a successful creation, it invalidates all product queries:

```text
Create Product
     ↓
Server creates product
     ↓
Invalidate ["products"]
     ↓
TanStack Query refetches relevant product data
```

## Why It Does Not Use an Optimistic Update

Creating a product could technically be implemented optimistically, but the assignment keeps creation simpler by waiting for the server response and then refreshing the product queries.

This also avoids having to predict server-generated fields such as the product ID or creation timestamp.

---

# 4. useUpdateProduct

## Purpose

`useUpdateProduct` updates an existing product and demonstrates an optimistic update with rollback.

## Mutation Function

The mutation receives:

```js
{
  id,
  data
}
```

and passes this information to `updateProduct`.

## Optimistic Update Flow

Before the server responds:

1. Cancel active product queries.
2. Save all currently cached product queries.
3. Update matching products in the cache immediately.
4. Send the update request.
5. Roll back the cache if the request fails.
6. Invalidate product queries when the mutation settles.

```text
User saves changes
       ↓
Cancel product queries
       ↓
Save cache snapshot
       ↓
Update cache immediately
       ↓
Send API request
       ↓
 ┌─────┴─────┐
 ↓           ↓
Success     Failure
 ↓           ↓
Invalidate  Rollback
 ↓           ↓
Refetch     Restore snapshot
```

## Why Cancel Queries?

An active fetch could return older server data and overwrite the optimistic update.

Cancelling in-flight product queries reduces that race condition.

## Why Save Previous Queries?

The previous cache is stored as mutation context so the exact previous state can be restored if the server update fails.

## Cache Scope

The hook updates all cached queries beginning with:

```js
["products"]
```

This is useful because multiple product query variants can be cached at the same time, for example different pages or filters.

## Final Synchronization

`onSettled` invalidates the `["products"]` queries regardless of success or failure.

This makes the server the final authority after the optimistic UI phase.

---

# 5. useDeleteProduct

## Purpose

`useDeleteProduct` deletes a single product using an optimistic update.

## Optimistic Behavior

The product is removed from every cached product list immediately.

```text
Delete requested
      ↓
Remove product from cache
      ↓
UI updates immediately
      ↓
DELETE request
      ↓
Success → invalidate
Failure → rollback → invalidate
```

## Rollback

If deletion fails, the previously cached product lists are restored using the snapshot returned from `onMutate`.

---

# 6. useBulkDeleteProducts

## Purpose

`useBulkDeleteProducts` deletes multiple products.

Because the Mock API does not provide a dedicated bulk-delete endpoint, the hook sends individual delete requests for each selected product.

## Promise.allSettled

The hook uses:

```js
Promise.allSettled(...)
```

instead of `Promise.all`.

This allows every delete request to finish even if one request fails.

The results are then inspected to determine whether any requests failed.

```text
Selected IDs
     ↓
Create individual DELETE requests
     ↓
Promise.allSettled()
     ↓
Check rejected results
     ↓
 ┌──────────────┴──────────────┐
 ↓                             ↓
No failures                 Failures
 ↓                             ↓
Success                    Throw error
```

## Optimistic Update

All selected products are removed from the cached product lists immediately.

A `Set` is used for selected IDs so membership checks are efficient:

```js
const productIdSet = new Set(productIds);
```

## Failure Handling

If one or more requests fail:

- The mutation is considered failed.
- The previous cached queries are restored.
- The product queries are invalidated afterward.

---

# 7. useBulkUpdateProductStatus

## Purpose

`useBulkUpdateProductStatus` changes the status of multiple products.

It supports operations such as:

- Mark selected products as `active`.
- Mark selected products as `inactive`.

## Mutation Input

```js
{
  productIds,
  status
}
```

## Request Strategy

Like bulk deletion, the Mock API requires individual requests, so the hook uses `Promise.allSettled`.

## Optimistic Update

Selected products are immediately updated in every cached product list:

```text
Selected products
      ↓
Update status in cache
      ↓
UI reflects new status immediately
      ↓
Send individual API requests
```

## Rollback

If one or more requests fail, the previous cached queries are restored.

## Final Synchronization

The `["products"]` queries are invalidated after the mutation settles.
