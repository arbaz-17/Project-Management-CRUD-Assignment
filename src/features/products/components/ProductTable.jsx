import {
  Pencil,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useRef } from "react";

function formatCategory(category) {
  if (!category) {
    return "—";
  }

  return category
    .split("-")
    .map(
      (word) =>
        word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
}

function formatPrice(price) {
  const numericPrice = Number(price);

  if (Number.isNaN(numericPrice)) {
    return "—";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "PKR",
  }).format(numericPrice);
}

function formatDate(date) {
  if (!date) {
    return "—";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsedDate);
}

function ProductTableSkeleton() {
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <span className="skeleton skeleton-checkbox" />
              </th>

              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <span className="skeleton skeleton-checkbox" />
                </td>

                <td>
                  <span className="skeleton skeleton-title" />
                </td>

                <td>
                  <span className="skeleton skeleton-text" />
                </td>

                <td>
                  <span className="skeleton skeleton-price" />
                </td>

                <td>
                  <span className="skeleton skeleton-stock" />
                </td>

                <td>
                  <span className="skeleton skeleton-status" />
                </td>

                <td>
                  <span className="skeleton skeleton-date" />
                </td>

                <td>
                  <div className="skeleton-actions">
                    <span className="skeleton skeleton-action" />
                    <span className="skeleton skeleton-action" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ProductTable({
  products,
  selectedIds,
  onToggleRow,
  onToggleAll,
  onEdit,
  onDelete,
}) {
  const selectAllRef = useRef(null);

  const allSelected =
    products.length > 0 &&
    products.every((product) =>
      selectedIds.includes(product.id)
    );

  const someSelected =
    selectedIds.length > 0 && !allSelected;

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = someSelected;
    }
  }, [someSelected]);

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <Search size={24} />
        </div>

        <h3>No products found</h3>

        <p>
          No products match your current search or filters.
          Try changing your filters and search again.
        </p>
      </div>
    );
  }

  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleAll}
                  aria-label="Select all products"
                />
              </th>

              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const selected = selectedIds.includes(
                product.id
              );

              return (
                <tr
                  key={product.id}
                  className={
                    selected ? "is-selected" : undefined
                  }
                >
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() =>
                        onToggleRow(product.id)
                      }
                      aria-label={`Select ${product.title}`}
                    />
                  </td>

                  <td>
                    <div className="product-cell">
                      <div className="product-avatar">
                        {product.title
                          ?.charAt(0)
                          ?.toUpperCase() || "P"}
                      </div>

                      <div className="product-info">
                        <span className="product-title">
                          {product.title}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <span className="category-text">
                      {formatCategory(product.category)}
                    </span>
                  </td>

                  <td>
                    <span className="price-text">
                      {formatPrice(product.price)}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`stock-text ${
                        Number(product.stock) <= 5
                          ? "stock-low"
                          : ""
                      }`}
                    >
                      {product.stock ?? "—"}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${
                        product.status === "active"
                          ? "status-active"
                          : "status-inactive"
                      }`}
                    >
                      <span className="status-dot" />

                      {product.status || "Unknown"}
                    </span>
                  </td>

                  <td>
                    <span className="date-text">
                      {formatDate(product.createdAt)}
                    </span>
                  </td>

                  <td>
                    <div className="row-actions">
                      <button
                        type="button"
                        className="row-action-button"
                        onClick={() => onEdit(product)}
                        title={`Edit ${product.title}`}
                      >
                        <Pencil size={15} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        className="row-action-button row-action-danger"
                        onClick={() => onDelete(product)}
                        title={`Delete ${product.title}`}
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedIds.length > 0 && (
        <div className="selection-bar">
          <span>
            <strong>{selectedIds.length}</strong>{" "}
            {selectedIds.length === 1
              ? "product"
              : "products"}{" "}
            selected
          </span>

          <button
            type="button"
            className="selection-bar-button"
          >
            Bulk Actions
          </button>
        </div>
      )}
    </div>
  );
}

export { ProductTableSkeleton };