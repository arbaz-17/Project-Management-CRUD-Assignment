import { useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useProductParams } from "../hooks/useProductParams";

import ProductPagination from "./ProductPagination";
import ProductTable, { ProductTableSkeleton } from "./ProductTable";
import ProductToolbar from "./ProductToolbar";

export default function ProductCatalog({
  theme,
  onThemeToggle,
}) {
  const {
    page,
    title,
    category,
    status,
    updateParams,
  } = useProductParams();

  const [selectedIds, setSelectedIds] = useState([]);

  const {
    data,
    isPending,
    isError,
    error,
    isFetching,
    isPlaceholderData,
    refetch,
  } = useProducts({
    page,
    limit: 10,
    title,
    category,
    status,
  });

  const handleCategoryChange = (event) => {
    updateParams({
      category: event.target.value,
      page: 1,
    });
  };

  const handleStatusChange = (event) => {
    updateParams({
      status: event.target.value,
      page: 1,
    });
  };

  const handleClearFilters = () => {
    updateParams({
      title: "",
      category: "",
      status: "",
      page: 1,
    });

    setSelectedIds([]);
  };

  const handleAdd = () => {
    // Placeholder for future Add Product functionality.
    console.log("Add product");
  };

  const handleEdit = (product) => {
    // Placeholder for future Edit Product functionality.
    console.log("Edit product:", product);
  };

  const handleDelete = (product) => {
    // Placeholder for future Delete Product functionality.
    console.log("Delete product:", product);
  };

  const handleToggleRow = (id) => {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((selectedId) => selectedId !== id)
        : [...current, id]
    );
  };

  const products = data?.products ?? [];

  const visibleSelectedIds = selectedIds.filter((id) =>
    products.some((product) => product.id === id)
  );

  const handleToggleAll = () => {
    const allIds = products.map((product) => product.id);

    const allSelected =
      allIds.length > 0 &&
      allIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !allIds.includes(id))
      );
      return;
    }

    setSelectedIds((current) => [
      ...current.filter((id) => !allIds.includes(id)),
      ...allIds,
    ]);
  };

  const hasActiveFilters = Boolean(title || category || status);

  const toolbar = (
    <ProductToolbar
      key={title}
      title={title}
      category={category}
      status={status}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      onAdd={handleAdd}
      onRefresh={refetch}
      isFetching={isFetching}
      theme={theme}
      onThemeToggle={onThemeToggle}
      onSearch={(searchTitle) => {
        updateParams({
          title: searchTitle,
          page: 1,
        });
      }}
    />
  );

  if (isPending) {
    return (
      <div className="products-page">
        {toolbar}
        <ProductTableSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="products-page">
        {toolbar}

        <div className="error-state">
          <div className="error-state-content">
            <span className="error-state-label">
              Unable to load products
            </span>

            <h3>Something went wrong</h3>

            <p>{error.message}</p>

            <button
              type="button"
              className="toolbar-button toolbar-button-primary"
              onClick={refetch}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { hasNextPage } = data;

  return (
    <div className="products-page">
      {toolbar}

      <div className="table-heading">
        <div>
          <h2>Product catalog</h2>

          <p>
            Browse, search, filter, and manage your products.
          </p>
        </div>

        <div className="table-meta">
          {products.length}{" "}
          {products.length === 1 ? "item" : "items"}
        </div>
      </div>

      <ProductTable
        products={products}
        selectedIds={visibleSelectedIds}
        onToggleRow={handleToggleRow}
        onToggleAll={handleToggleAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <ProductPagination
        page={page}
        hasNextPage={hasNextPage}
        onPrevious={() => updateParams({ page: page - 1 })}
        onNext={() => updateParams({ page: page + 1 })}
        isDisabled={isPlaceholderData}
        isFetching={isFetching}
      />
    </div>
  );
}