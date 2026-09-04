# Query Hooks

## 1. Overview

The `queries` folder contains custom hooks responsible for reading product data from the server through TanStack Query.

The main query hook is `useProducts`, which combines:

- API data fetching.
- TanStack Query caching.
- Query keys.
- Request cancellation through `AbortSignal`.
- Placeholder data for pagination transitions.
- Client-side transformation of the API response.
- Detection of whether another page exists.

---

# 2. useProducts

## Purpose

`useProducts` is the main data-fetching hook for the product catalog.

It receives product parameters such as:

```js
{
  page,
  limit,
  title,
  category,
  status
}
```

and uses them to fetch the corresponding product list.

---

## 3. Query Key

The hook uses:

```js
queryKey: ["products", params]
```

The query key uniquely identifies a particular product query.

For example:

```text
["products", { page: 1, limit: 10, title: "", category: "", status: "" }]
```

and:

```text
["products", { page: 2, limit: 10, title: "", category: "", status: "" }]
```

represent different cached queries.

Changing a parameter therefore creates or retrieves a different cache entry.

---

# 4. Query Function

The query function calls `getProducts` from the product API service.

The requested limit is increased by one:

```js
limit: requestedLimit + 1
```

For example, if the UI wants 10 products:

```text
UI page size = 10
API request = 11
```

The extra product is used to determine whether another page exists.

---

# 5. Pagination Detection

The API response is inspected using:

```js
const hasNextPage = products.length > requestedLimit;
```

Example:

```text
Request 11 products

Returned 11
→ There is another page

Returned 7
→ This is the last page
```

The extra item is not displayed. The result is limited back to the requested page size:

```js
products.slice(0, requestedLimit)
```

This allows the pagination UI to know whether the Next button should be enabled without requiring a separate total-count endpoint.

---

# 6. Query Result Transformation

The `select` function transforms the raw API array into:

```js
{
  products,
  hasNextPage
}
```

The UI therefore receives only the information it needs.

Conceptually:

```text
Raw API response
      ↓
[product, product, ...]
      ↓
select()
      ↓
{
  products: [...],
  hasNextPage: true
}
```

An important detail is that TanStack Query's underlying cache still contains the raw API array. `select` transforms the data returned to the observer without replacing the underlying cached value.

This is why mutation hooks can update the cached product array directly.

---

# 7. keepPreviousData

The hook uses:

```js
placeholderData: keepPreviousData
```

This allows the previous query result to remain available while a new query is being fetched, such as when moving between pages.

Without this behavior, pagination could briefly show an empty/loading state between page transitions.

Conceptually:

```text
Page 1 displayed
      ↓
User clicks Next
      ↓
Page 1 remains visible temporarily
      ↓
Page 2 request runs
      ↓
Page 2 data arrives
      ↓
Page 2 displayed
```

The UI can use `isPlaceholderData` to distinguish this temporary state.

---

# 8. AbortSignal

TanStack Query provides an `AbortSignal` to the query function:

```js
queryFn: ({ signal }) => ...
```

The hook passes this signal to `getProducts`.

This allows an in-flight request to be cancelled when TanStack Query determines that the request is no longer needed.

This is preferable to manually creating an `AbortController` inside the hook because TanStack Query already manages the request lifecycle.

---

# 9. Caching

Because `useProducts` uses TanStack Query, product responses are cached according to their query keys.

For example:

```text
Query A
["products", page 1]

Query B
["products", page 2]

Query C
["products", category "books"]
```

These can exist as separate cache entries.

This reduces unnecessary network requests and allows previously fetched product data to be reused.
