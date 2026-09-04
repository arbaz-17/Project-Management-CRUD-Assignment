# Query

## Overview

The `query` folder contains the TanStack Query configuration used by the application.

# `queryClient.js`

The file creates and exports the application's shared TanStack Query `QueryClient`.

## `QueryClient`

`QueryClient` is the central object TanStack Query uses to manage server-state behavior.

It coordinates things such as:

- Query caching
- Stale/fresh status
- Refetching
- Query invalidation
- Query cancellation
- Mutations and cache updates

The same client is provided to the React application through `QueryClientProvider`.

---

# `staleTime`

The project configures:

```js
staleTime: 30 * 1000
```

which means **30 seconds**.

During those 30 seconds, successfully fetched query data is considered fresh.

After that period, the data becomes stale and TanStack Query may refetch it when a refetch trigger occurs.


