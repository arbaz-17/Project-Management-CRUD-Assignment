import { useEffect, useState } from "react";
import {
  Filter,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Sun,
  X,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../lib/redux/appSlice.js";
import { selectTheme } from "../../../lib/redux/selectors.js";



export default function ProductToolbar({
  title,
  category,
  status,
  onSearch,
  onCategoryChange,
  onStatusChange,
  onClearFilters,
  hasActiveFilters,
  onAdd,
  onRefresh,
  isFetching,
}) {
  const [showFilters, setShowFilters] = useState(
    Boolean(category || status)
  );

  const dispatch = useDispatch();
  const theme = useSelector(selectTheme);
  const [searchInput, setSearchInput] = useState(title);

  const activeFilterCount = [category, status].filter(Boolean).length;

  useEffect(() => {
    if (searchInput === title) {
      return;
    }

    const timeoutId = setTimeout(() => {
      onSearch(searchInput);
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchInput, title, onSearch]);

  const handleClearSearch = () => {
    setSearchInput("");
  };

  return (
    <section className="product-toolbar">
      <div className="toolbar-main">
        <div className="search-box">
          <Search size={18} aria-hidden="true" />

          <input
            type="search"
            placeholder="Search products..."
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            aria-label="Search products by title"
          />

          {searchInput && (
            <button
              type="button"
              className="icon-button input-clear"
              onClick={handleClearSearch}
              aria-label="Clear search"
              title="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="toolbar-actions">
          <button
            type="button"
            className={`toolbar-button toolbar-button-secondary ${
              showFilters ? "is-active" : ""
            }`}
            onClick={() => setShowFilters((value) => !value)}
          >
            <Filter size={17} />

            <span>Filters</span>

            {activeFilterCount > 0 && (
              <span className="filter-count">
                {activeFilterCount}
              </span>
            )}
          </button>

          <button
            type="button"
            className="toolbar-button toolbar-button-secondary"
            onClick={onRefresh}
            disabled={isFetching}
            title="Refresh products"
          >
            <RefreshCw
              size={17}
              className={isFetching ? "spin" : undefined}
            />

            <span className="refresh-label">Refresh</span>
          </button>

<button
  type="button"
  className="theme-toggle"
  onClick={() => dispatch(toggleTheme())}
  aria-label={`Switch to ${
    theme === "dark" ? "light" : "dark"
  } mode`}
  title={`Switch to ${
    theme === "dark" ? "light" : "dark"
  } mode`}
>
  {theme === "dark" ? (
    <Sun size={18} />
  ) : (
    <Moon size={18} />
  )}
</button>

          <button
            type="button"
            className="toolbar-button toolbar-button-primary"
            onClick={onAdd}
          >
            <Plus size={18} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {showFilters && (
        <div className="filter-panel">
          <div className="filter-group">
            <label htmlFor="category-filter">
              Category
            </label>

            <select
              id="category-filter"
              value={category}
              onChange={onCategoryChange}
            >
              <option value="">All categories</option>
              <option value="sports">Sports</option>
              <option value="electronics">
                Electronics
              </option>
              <option value="books">Books</option>
              <option value="clothing">Clothing</option>
              <option value="home-kitchen">
                Home & Kitchen
              </option>
            </select>
          </div>

          <div className="filter-group">
            <label htmlFor="status-filter">
              Status
            </label>

            <select
              id="status-filter"
              value={status}
              onChange={onStatusChange}
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              className="clear-filters"
              onClick={onClearFilters}
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      )}
    </section>
  );
}