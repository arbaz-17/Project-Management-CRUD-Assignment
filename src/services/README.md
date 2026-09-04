# Services

## Overview

The `services` folder contains the application's API communication layer.

Its responsibility is to communicate with the backend API and provide simple functions for fetching and modifying product data. It keeps HTTP and API-specific logic separate from React components and TanStack Query hooks.

### Folder Structure

```text
services/
└── productApi.js
```

---

# `productApi.js`

`productApi.js` contains all API functions related to products.

It communicates with the MockAPI backend using the browser's native `fetch()` API.

The service layer does **not** manage React state, Redux state, TanStack Query caching, optimistic updates, or UI behavior. It only handles communication with the API.

## API Endpoint

```js
const API_URL = "https://6a97c4900e3240db90620c53.mockapi.io/api/products";
```

This is the base endpoint used by all product operations.

In a production application, the API URL would normally be stored in an environment variable rather than hardcoded.

---

# API Functions

## `getProducts(params = {}, signal)`

Fetches products from the API.

### Responsibilities

- Builds URL query parameters from the supplied `params`.
- Ignores empty, `null`, and `undefined` values.
- Sends the request using `fetch()`.
- Passes TanStack Query's `AbortSignal` to `fetch()`.
- Handles HTTP errors.
- Returns the parsed product data.

### Query Parameters

The function converts the supplied object into URL parameters:

```js
Object.entries(params).forEach(([key, value]) => {
  if (value !== undefined && value !== null && value !== "") {
    searchParams.set(key, String(value));
  }
});
```

For example:

```js
{
  page: 2,
  limit: 10,
  category: "Sport"
}
```

becomes a request similar to:

```text
/products?page=2&limit=10&category=Sport
```

This allows the same API function to support pagination and filtering without manually constructing every URL.

### AbortSignal

The function accepts a `signal`:

```js
fetch(url, {
  signal,
});
```

TanStack Query provides this signal to the query function. If the query becomes unnecessary or is cancelled, the request can be aborted instead of continuing unnecessarily.

### 404 Handling

A `404` response returns an empty array:

```js
if (response.status === 404) {
  return [];
}
```

This allows the application to treat the situation as having no products rather than crashing the query.

### Error Handling

Other unsuccessful responses throw an error:

```js
if (!response.ok) {
  throw new Error(...);
}
```

This error is then available to TanStack Query and eventually to the UI's error state.

---

## `createProduct(productData)`

Creates a new product using a `POST` request.

Before sending the request, the service creates timestamps:

```js
const now = new Date().toISOString();
```

Both `createdAt` and `updatedAt` are initially set to the same timestamp.

The product is then sent as JSON:

```text
POST /products
```

The created product returned by the API is returned to the caller.

### Responsibility

The service handles:

- Building the request body
- HTTP method
- Headers
- JSON serialization
- Error handling
- Returning the API response

The mutation hook handles what happens to the application cache after creation.

---

## `updateProduct({ id, data })`

Updates an existing product.

It sends:

```text
PUT /products/:id
```

The function also updates the `updatedAt` timestamp before sending the request.

The service returns the updated product from the API.

The corresponding mutation hook is responsible for the optimistic update, rollback, and cache invalidation.

---

## `deleteProduct(id)`

Deletes a product using:

```text
DELETE /products/:id
```

The service only handles the HTTP request and error handling.

The `useDeleteProduct` hook handles the application-side optimistic removal, rollback, and query invalidation.

---

## `updateProductStatus({ id, status })`

Updates only the product's status.

It sends:

```text
PUT /products/:id
```

with a small JSON body:

```js
{
  status
}
```

This function is used by the bulk status update flow as the API operation for each selected product.

---

# Data Flow

For reading products:

```text
ProductCatalog
      ↓
useProducts()
      ↓
getProducts()
      ↓
fetch()
      ↓
MockAPI
      ↓
Product data
      ↓
TanStack Query cache
      ↓
ProductCatalog
```

For mutations:

```text
ProductForm / Modal
      ↓
useCreateProduct / useUpdateProduct
      ↓
productApi.js
      ↓
fetch()
      ↓
MockAPI
```