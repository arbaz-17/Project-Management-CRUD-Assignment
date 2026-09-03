import {
  PackageOpen,
  SearchX,
} from "lucide-react";

export default function ProductEmptyState({
  hasFilters,
  onClearFilters,
}) {
  return (
    <div className="products-state products-empty-state">
      <div className="state-icon">
        {hasFilters ? (
          <SearchX size={26} />
        ) : (
          <PackageOpen size={26} />
        )}
      </div>

      <h3>
        {hasFilters
          ? "No products match your filters"
          : "No products yet"}
      </h3>

      <p>
        {hasFilters
          ? "Try adjusting your search or filters to find what you're looking for."
          : "Your product catalog is currently empty."}
      </p>

      {hasFilters && (
        <button
          type="button"
          className="toolbar-button toolbar-button-secondary"
          onClick={onClearFilters}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}