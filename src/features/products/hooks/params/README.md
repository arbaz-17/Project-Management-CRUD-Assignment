# URL Parameter Hook

## 1. Overview

The `params` folder contains hooks responsible for synchronizing product catalog controls with the browser URL.

The main hook, `useProductParams`, manages:

- Current page.
- Product title search.
- Category filter.
- Status filter.
- Updating URL query parameters.
- Browser back/forward navigation.

URL state is useful for product filters and pagination because the current catalog view can be represented directly in the browser URL.

---

# 2. useProductParams

## Purpose

`useProductParams` provides a simple interface for reading and updating product-related URL parameters.

It returns:

```js
{
  page,
  title,
  category,
  status,
  updateParams
}
```

---

# 3. Reading URL Parameters

The hook reads the current query string using:

```js
new URLSearchParams(window.location.search)
```

It extracts:

```text
page
title
category
status
```

Default values are applied when parameters are missing:

```text
page     → 1
title    → ""
category → ""
status   → ""
```

This means the rest of the application can work with predictable values.

---

# 4. Updating URL Parameters

The `updateParams` function accepts an object containing the values that should change.

Example:

```js
updateParams({
  category: "books",
  page: 1,
});
```

The hook:

1. Reads the current URL parameters.
2. Applies the requested updates.
3. Removes parameters whose values are empty, `null`, or `undefined`.
4. Builds the new URL.
5. Uses `history.pushState()` to update the browser URL without a full page reload.
6. Dispatches a `popstate` event so React components can react to the URL change.

---

# 5. Removing Empty Parameters

The hook intentionally removes empty values instead of creating URLs such as:

```text
?page=1&category=&status=
```

For example:

```js
updateParams({
  category: "",
});
```

removes the `category` parameter from the URL.

This keeps URLs cleaner.

---

# 6. Browser Back / Forward Support

The hook listens for the browser's `popstate` event:

```js
window.addEventListener("popstate", handlePopState);
```

This is important because `history.pushState()` changes the URL but does not automatically trigger a React render.

When the user presses Back or Forward:

```text
Browser navigation
      ↓
popstate event
      ↓
setUrlVersion()
      ↓
React re-renders
      ↓
URL parameters are read again
      ↓
Product query updates
```

The event listener is removed during cleanup to prevent memory leaks.

---

# 7. Why URL State Is Used

Search, filters, and pagination describe **which products the user wants to view**, rather than being purely temporary UI state.

Keeping them in the URL provides useful behavior:

- The current view can be bookmarked.
- The URL can be shared.
- Browser Back/Forward can restore previous views.
- Refreshing the page preserves the current filters.
- The application has a single representation of the current catalog view.

