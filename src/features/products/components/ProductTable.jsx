import { Pencil, Search, Trash2 } from "lucide-react";
import { useEffect, useRef } from "react";

import BulkActionsMenu from "./BulkActionsMenu";
import ProductTableSkeleton from "./ProductTableSkeleton";
import { formatCategory,formatDate,formatPrice } from "../../../utils/formatters";

export default function ProductTable({
  products,
  selectedIds,
  selectedProductCount,
  onToggleRow,
  onToggleAll,
  onEdit,
  onDelete,
  onClearSelection,
  onDeleteSelected,
  onMarkActive,
  onMarkInactive,
  isProcessing,
}) {
  const selectAllRef = useRef(null);

  const selectedCountOnCurrentPage = selectedIds.length;

  const allSelected =
    products.length > 0 && selectedCountOnCurrentPage === products.length;

  const someSelected = selectedCountOnCurrentPage > 0 && !allSelected;

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
          No products match your current search or filters. Try changing your
          filters and search again.
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
              const selected = selectedIds.includes(product.id);

              return (
                <tr
                  key={product.id}
                  className={selected ? "is-selected" : undefined}
                >
                  <td className="checkbox-column">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => onToggleRow(product.id)}
                      aria-label={`Select ${product.title}`}
                    />
                  </td>

                  <td>
                    <div className="product-cell">
                      <div className="product-avatar">
                        {product.title?.charAt(0)?.toUpperCase() || "P"}
                      </div>

                      <div className="product-info">
                        <span className="product-title">{product.title}</span>
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
                        Number(product.stock) <= 5 ? "stock-low" : ""
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

      {selectedProductCount > 0 && (
        <div className="selection-bar">
          <span>
            <strong>{selectedProductCount}</strong>{" "}
            {selectedProductCount === 1 ? "product" : "products"} selected
          </span>

          <div className="selection-bar-actions">
            <button
              type="button"
              className="selection-bar-button"
              onClick={onClearSelection}
            >
              Clear Selection
            </button>

            <BulkActionsMenu
              selectedProductCount={selectedProductCount}
              onDeleteSelected={onDeleteSelected}
              onMarkActive={onMarkActive}
              onMarkInactive={onMarkInactive}
              isProcessing={isProcessing}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export { ProductTableSkeleton };
