import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useProducts } from "../hooks/useProducts";
import { useProductParams } from "../hooks/useProductParams";
import { useCreateProduct } from "../hooks/useCreateProduct";
import { useUpdateProduct } from "../hooks/useUpdateProduct";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import { useBulkDeleteProducts } from "../hooks/useBulkDeleteProducts";
import { useBulkUpdateProductStatus } from "../hooks/useBulkUpdateProductStatus";

import {
  clearSelection,
  deselectProducts,
  selectProducts,
  toggleProductSelection,
} from "../../../lib/redux/appSlice.js";

import {
  selectSelectedProductCount,
  selectSelectedProductIds,
} from "../../../lib/redux/selectors.js";

import BulkDeleteProductsModal from "./BulkDeleteProductsModal";
import DeleteProductModal from "./DeleteProductModal";
import ProductEmptyState from "./ui-states/ProductEmptyState";
import ProductErrorState from "./ui-states/ProductErrorState";
import ProductFormModal from "./ProductFormModal";
import ProductLoadingState from "./ui-states/ProductLoadingState";
import ProductPagination from "./ProductPagination";
import ProductTable from "./ProductTable";
import ProductToolbar from "./ProductToolbar";

export default function ProductCatalog() {
  const { page, title, category, status, updateParams } = useProductParams();

  const dispatch = useDispatch();

  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();
  const bulkDeleteProductsMutation = useBulkDeleteProducts();
  const bulkUpdateProductStatusMutation = useBulkUpdateProductStatus();

  const selectedIds = useSelector(selectSelectedProductIds);

  const selectedProductCount = useSelector(selectSelectedProductCount);

  /*
   * Controls the Add/Edit modal.
   *
   * Example:
   * { mode: "add", product: null }
   *
   * or:
   * { mode: "edit", product: selectedProduct }
   */
  const [productModal, setProductModal] = useState(null);

  /*
   * Product currently waiting for delete confirmation.
   */
  const [productToDelete, setProductToDelete] = useState(null);

  /*
   * Controls the bulk delete confirmation modal.
   */
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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

  const hasActiveFilters = Boolean(title || category || status);

  /*
   * Only keep selected IDs that belong to the
   * currently visible products.
   *
   * This is derived state, not Redux state.
   */
  const visibleSelectedIds = selectedIds.filter((id) =>
    products.some((product) => product.id === id),
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

    dispatch(clearSelection());
  };

  const handleCategoryChange = (event) => {
    updateParams({
      category: event.target.value,
      page: 1,
    });

    dispatch(clearSelection());
  };

  const handleStatusChange = (event) => {
    updateParams({
      status: event.target.value,
      page: 1,
    });

    dispatch(clearSelection());
  };

  const handleClearFilters = () => {
    updateParams({
      title: "",
      category: "",
      status: "",
      page: 1,
    });

    dispatch(clearSelection());
  };

  /*
   * --------------------------------------------------
   * Row selection
   * --------------------------------------------------
   */

  const handleToggleRow = (id) => {
    dispatch(toggleProductSelection(id));
  };

  const handleToggleAll = () => {
    if (products.length === 0) {
      return;
    }

    const productIds = products.map((product) => product.id);

    const allSelected = productIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      dispatch(deselectProducts(productIds));

      return;
    }

    dispatch(selectProducts(productIds));
  };

  /*
   * Clear all selected products.
   *
   * Selection is global client state owned by Redux.
   * ProductTable remains presentational and receives
   * this handler through props.
   */
  const handleClearSelection = () => {
    dispatch(clearSelection());
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
      const productId = productModal.product.id;

      /*
       * Close the modal immediately because the update
       * is optimistic.
       */
      setProductModal(null);

      updateProductMutation.mutate({
        id: productId,
        data: formData,
      });

      return;
    }

    await createProductMutation.mutateAsync(formData);

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

  const handleDeleteConfirm = (product) => {
    const productId = product.id;

    /*
     * Close the confirmation modal immediately
     * because delete is optimistic.
     */
    setProductToDelete(null);

    deleteProductMutation.mutate(productId);
  };

  /*
   * --------------------------------------------------
   * Bulk delete
   * --------------------------------------------------
   */

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) {
      return;
    }

    setShowBulkDeleteModal(true);
  };

  const handleCloseBulkDeleteModal = () => {
    if (bulkDeleteProductsMutation.isPending) {
      return;
    }

    setShowBulkDeleteModal(false);
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) {
      return;
    }

    /*
     * Take a snapshot of the IDs before starting the
     * mutation so the mutation receives the correct
     * selection even though the UI changes immediately.
     */
    const productIds = [...selectedIds];

    /*
     * Close the confirmation modal immediately because
     * the bulk delete is optimistic.
     */
    setShowBulkDeleteModal(false);

    bulkDeleteProductsMutation.mutate(productIds, {
      onSuccess: () => {
        dispatch(clearSelection());
      },
    });
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedIds.length === 0) {
      return;
    }

    const productIds = [...selectedIds];

    bulkUpdateProductStatusMutation.mutate(
      {
        productIds,
        status,
      },
      {
        onSuccess: () => {
          dispatch(clearSelection());
        },
      },
    );
  };

  const handleMarkActive = () => {
    handleBulkStatusUpdate("active");
  };

  const handleMarkInactive = () => {
    handleBulkStatusUpdate("inactive");
  };

  /*
   * --------------------------------------------------
   * Toolbar
   * --------------------------------------------------
   */

  const toolbar = (
    <ProductToolbar
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

        <ProductErrorState message={error?.message} onRetry={refetch} />
      </div>
    );
  }

  /*
   * keepPreviousData is enabled in useProducts.
   *
   * During a page/filter change we temporarily have
   * the previous query's data while the new request runs.
   *
   * For this UI we intentionally show the loading state
   * rather than displaying the old page.
   */
  if (isFetching && isPlaceholderData) {
    return (
      <div className="products-page">
        {toolbar}

        <ProductLoadingState message="Loading products..." />
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
          <p>Browse, search, filter, and manage your products.</p>
        </div>

        <div className="table-meta">
          {products.length} {products.length === 1 ? "item" : "items"}
        </div>
      </div>

      <ProductTable
        products={products}
        selectedIds={visibleSelectedIds}
        selectedProductCount={selectedProductCount}
        onToggleRow={handleToggleRow}
        onToggleAll={handleToggleAll}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onClearSelection={handleClearSelection}
        onDeleteSelected={handleBulkDelete}
        onMarkActive={handleMarkActive}
        onMarkInactive={handleMarkInactive}
        isProcessing={
          bulkDeleteProductsMutation.isPending ||
          bulkUpdateProductStatusMutation.isPending
        }
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
          isSubmitting={
            productModal.mode === "edit"
              ? updateProductMutation.isPending
              : createProductMutation.isPending
          }
          submissionError={
            productModal.mode === "edit"
              ? updateProductMutation.error
              : createProductMutation.error
          }
        />
      )}

      {productToDelete && (
        <DeleteProductModal
          product={productToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          isDeleting={deleteProductMutation.isPending}
          deletionError={deleteProductMutation.error}
        />
      )}

      {showBulkDeleteModal && (
        <BulkDeleteProductsModal
          productCount={selectedProductCount}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleBulkDeleteConfirm}
          isDeleting={bulkDeleteProductsMutation.isPending}
          deletionError={bulkDeleteProductsMutation.error}
        />
      )}
    </div>
  );
}
