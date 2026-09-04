import { PackageOpen, SearchX } from "lucide-react";

export default function ProductEmptyState({ hasFilters, onClearFilters }) {
  return (
    <div className="products-state products-empty-state">
      <div className="state-icon">
        {hasFilters ? <SearchX size={26} /> : <PackageOpen size={26} />}
      </div>

      <h3>
        {hasFilters ? "No such product exists" : "No products yet"}
      </h3>

      <p>
        {hasFilters
          ? "No product matches the current search or filters. Try changing your filters."
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
