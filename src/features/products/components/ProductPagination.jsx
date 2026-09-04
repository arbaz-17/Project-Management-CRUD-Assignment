import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  page,
  hasNextPage,
  onPrevious,
  onNext,
  isDisabled,
  isFetching,
}) {
  return (
    <footer className="pagination">
      <span className="pagination-status">
        {isFetching ? "Updating products..." : `Page ${page}`}
      </span>

      <div className="pagination-controls">
        <button
          type="button"
          className="pagination-button"
          onClick={onPrevious}
          disabled={page === 1 || isDisabled}
          aria-label="Previous page"
        >
          <ChevronLeft size={17} />
          <span>Previous</span>
        </button>

        <span className="page-indicator">{page}</span>

        <button
          type="button"
          className="pagination-button"
          onClick={onNext}
          disabled={!hasNextPage || isDisabled}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={17} />
        </button>
      </div>
    </footer>
  );
}
