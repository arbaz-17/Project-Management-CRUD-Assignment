import { useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useProductParams } from "../hooks/useProductParams";

import DeleteProductModal from "./DeleteProductModal";
import ProductEmptyState from "./ui-states/ProductEmptyState";
import ProductErrorState from "./ui-states/ProductErrorState";
import ProductFormModal from "./ProductFormModal";
import ProductLoadingState from "./ui-states/ProductLoadingState";
import ProductPagination from "./ProductPagination";
import ProductTable from "./ProductTable";
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

  /*
   * Controls the Add/Edit modal.
   *
   * Example:
   * { mode: "add", product: null }
   *
   * or:
   * { mode: "edit", product: selectedProduct }
   */
  const [productModal, setProductModal] =
    useState(null);

  /*
   * Product currently waiting for delete confirmation.
   */
  const [productToDelete, setProductToDelete] =
    useState(null);

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

  const products = data?.products ?? [];
  const hasNextPage = data?.hasNextPage ?? false;

  const hasActiveFilters = Boolean(
    title || category || status
  );

  const visibleSelectedIds = selectedIds.filter((id) =>
    products.some((product) => product.id === id)
  );

  /*
   * --------------------------------------------------
   * Search / filters
   * --------------------------------------------------
   */

  const handleSearch = (searchTitle) => {
    updateParams({
      title: searchTitle,
      page: 1,
    });

    setSelectedIds([]);
  };

  const handleCategoryChange = (event) => {
    updateParams({
      category: event.target.value,
      page: 1,
    });

    setSelectedIds([]);
  };

  const handleStatusChange = (event) => {
    updateParams({
      status: event.target.value,
      page: 1,
    });

    setSelectedIds([]);
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

  /*
   * --------------------------------------------------
   * Row selection
   * --------------------------------------------------
   */

  const handleToggleRow = (id) => {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter(
          (selectedId) => selectedId !== id
        );
      }

      return [...current, id];
    });
  };

  const handleToggleAll = () => {
    if (products.length === 0) {
      return;
    }

    const productIds = products.map(
      (product) => product.id
    );

    const allSelected = productIds.every((id) =>
      selectedIds.includes(id)
    );

    if (allSelected) {
      setSelectedIds((current) =>
        current.filter(
          (id) => !productIds.includes(id)
        )
      );

      return;
    }

    setSelectedIds((current) => [
      ...current.filter(
        (id) => !productIds.includes(id)
      ),
      ...productIds,
    ]);
  };

  /*
   * --------------------------------------------------
   * Add / Edit modal
   * --------------------------------------------------
   */

  const handleAdd = () => {
    setProductModal({
      mode: "add",
      product: null,
    });
  };

  const handleEdit = (product) => {
    setProductModal({
      mode: "edit",
      product,
    });
  };

  const handleCloseProductModal = () => {
    setProductModal(null);
  };

  const handleProductSubmit = async (formData) => {
    if (!productModal) {
      return;
    }

    if (productModal.mode === "edit") {
      /*
       * Placeholder for future TanStack Query mutation:
       *
       * await updateProductMutation.mutateAsync({
       *   id: productModal.product.id,
       *   data: formData,
       * });
       */
      console.log("Update product:", {
        id: productModal.product.id,
        data: formData,
      });
    } else {
      /*
       * Placeholder for future TanStack Query mutation:
       *
       * await createProductMutation.mutateAsync(formData);
       */
      console.log("Create product:", formData);
    }

    /*
     * For now, close after the placeholder action.
     *
     * When we add the real mutation, this can stay here
     * after mutateAsync succeeds.
     */
    setProductModal(null);
  };

  /*
   * --------------------------------------------------
   * Delete modal
   * --------------------------------------------------
   */

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
  };

  const handleDeleteConfirm = async (product) => {
    /*
     * Placeholder for future TanStack Query mutation:
     *
     * await deleteProductMutation.mutateAsync(product.id);
     */
    console.log("Delete product:", product);

    /*
     * Once the mutation succeeds, close the dialog.
     */
    setProductToDelete(null);

    /*
     * Later, the mutation's onSuccess can invalidate:
     *
     * queryClient.invalidateQueries({
     *   queryKey: ["products"],
     * });
     */
  };

  /*
   * --------------------------------------------------
   * Toolbar
   * --------------------------------------------------
   */

  const toolbar = (
    <ProductToolbar
      key={title}
      title={title}
      category={category}
      status={status}
      onSearch={handleSearch}
      onCategoryChange={handleCategoryChange}
      onStatusChange={handleStatusChange}
      onClearFilters={handleClearFilters}
      hasActiveFilters={hasActiveFilters}
      onAdd={handleAdd}
      onRefresh={refetch}
      isFetching={isFetching}
      theme={theme}
      onThemeToggle={onThemeToggle}
    />
  );

  if (isPending) {
    return (
      <div className="products-page">
        {toolbar}

        <ProductLoadingState />
      </div>
    );
  }



  if (isError) {
    return (
      <div className="products-page">
        {toolbar}

        <ProductErrorState
          message={error?.message}
          onRetry={refetch}
        />
      </div>
    );
  }

  /*
   * --------------------------------------------------
   * Loading during page/filter changes
   * --------------------------------------------------
   *
   * keepPreviousData means TanStack Query can keep
   * the previous response while the new request runs.
   *
   * We intentionally hide that previous table and show
   * the centered loading state instead.
   */

  if (isFetching && isPlaceholderData) {
    return (
      <div className="products-page">
        {toolbar}

        <ProductLoadingState
          message="Loading products..."
        />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="products-page">
        {toolbar}

        <ProductEmptyState
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
        />

        <ProductPagination
          page={page}
          hasNextPage={false}
          onPrevious={() =>
            updateParams({
              page: page - 1,
            })
          }
          onNext={() =>
            updateParams({
              page: page + 1,
            })
          }
          isDisabled={true}
          isFetching={false}
        />
      </div>
    );
  }


  return (
    <div className="products-page">
      {toolbar}

      <div className="table-heading">
        <div>
          <p>
            Browse, search, filter, and manage your
            products.
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
        onPrevious={() =>
          updateParams({
            page: page - 1,
          })
        }
        onNext={() =>
          updateParams({
            page: page + 1,
          })
        }
        isDisabled={isPlaceholderData}
        isFetching={isFetching}
      />

      {productModal && (
        <ProductFormModal
          key={`${productModal.mode}-${productModal.product?.id ?? "new"}`}
          mode={productModal.mode}
          product={productModal.product}
          onClose={handleCloseProductModal}
          onSubmit={handleProductSubmit}
        />
      )}


      {productToDelete && (
        <DeleteProductModal
          product={productToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
        />
      )}
    </div>
  );
}