# Utils

## Overview

The `utils` folder contains small reusable helper functions that are independent of React components and application-specific state.

---

## `productValidation.js`

Contains `validateProductForm(formData)`, which validates product form fields and returns an `errors` object.

It checks required fields such as title, category, and status, as well as valid non-negative values for price and stock.

---

## `formatters.js`

Contains functions used to prepare values for display:

- `formatCategory()` — converts values such as `home-office` into `Home Office`.
- `formatPrice()` — formats numeric prices as PKR currency.
- `formatDate()` — converts valid dates into a readable format such as `Sep 4, 2026`.

Invalid or missing values return `—` instead of causing display issues.

---

## `debounce.js`

Contains a reusable `debounce()` utility.

It delays a callback until the specified amount of time has passed without another call.

In this project it is used for **product search**, so the URL/API-related search update does not happen on every keystroke.

```text
User types
   ↓
Wait 500ms
   ↓
No new input?
   ↓
Run callback
```


