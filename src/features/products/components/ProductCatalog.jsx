import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner"; // Added sonner import

import { useProducts } from "../hooks/queries/useProducts.js";
import { useProductParams } from "../hooks/params/useProductParams.js";
import { useCreateProduct } from "../hooks/mutations/useCreateProduct.js";
import { useUpdateProduct } from "../hooks/mutations/useUpdateProduct.js";
import { useDeleteProduct } from "../hooks/mutations/useDeleteProduct.js";
import { useBulkDeleteProducts } from "../hooks/mutations/useBulkDeleteProducts.js";
import { useBulkUpdateProductStatus } from "../hooks/mutations/useBulkUpdateProductStatus.js";

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

  const [productModal, setProductModal] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
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
  const visibleSelectedIds = selectedIds.filter((id) =>
    products.some((product) => product.id === id),
  );

  const handleSearch = (searchTitle) => {
    updateParams({ title: searchTitle, page: 1 });
    dispatch(clearSelection());
  };

  const handleCategoryChange = (event) => {
    updateParams({ category: event.target.value, page: 1 });
    dispatch(clearSelection());
  };

  const handleStatusChange = (event) => {
    updateParams({ status: event.target.value, page: 1 });
    dispatch(clearSelection());
  };

  const handleClearFilters = () => {
    updateParams({ title: "", category: "", status: "", page: 1 });
    dispatch(clearSelection());
  };

  const handleToggleRow = (id) => {
    dispatch(toggleProductSelection(id));
  };

  const handleToggleAll = () => {
    if (products.length === 0) return;
    const productIds = products.map((product) => product.id);
    const allSelected = productIds.every((id) => selectedIds.includes(id));

    if (allSelected) {
      dispatch(deselectProducts(productIds));
      return;
    }
    dispatch(selectProducts(productIds));
  };

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

  const handleAdd = () => {
    setProductModal({ mode: "add", product: null });
  };

  const handleEdit = (product) => {
    setProductModal({ mode: "edit", product });
  };

  const handleCloseProductModal = () => {
    setProductModal(null);
  };

  const handleProductSubmit = (formData) => {
    if (!productModal) return;

    if (productModal.mode === "edit") {
      const productId = productModal.product.id;
      
      // Close modal immediately
      setProductModal(null);

      updateProductMutation.mutate(
        { id: productId, data: formData },
        {
          onSuccess: () => toast.success("Product updated successfully"),
          onError: () => toast.error("Failed to update product"),
        }
      );
      return;
    }

    // Close modal immediately for Create
    setProductModal(null);

    createProductMutation.mutate(formData, {
      onSuccess: () => toast.success("Product created successfully"),
      onError: () => toast.error("Failed to create product"),
    });
  };

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
  };

  const handleDeleteConfirm = (product) => {
    const productId = product.id;
    
    // Close modal immediately
    setProductToDelete(null);

    deleteProductMutation.mutate(productId, {
      onSuccess: () => toast.success("Product deleted successfully"),
      onError: () => toast.error("Failed to delete product"),
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    setShowBulkDeleteModal(true);
  };

  const handleCloseBulkDeleteModal = () => {
    setShowBulkDeleteModal(false);
  };

  const handleBulkDeleteConfirm = () => {
    if (selectedIds.length === 0) return;
    const productIds = [...selectedIds];

    // Close immediately and clear selection for optimistic UX
    setShowBulkDeleteModal(false);
    dispatch(clearSelection());

    bulkDeleteProductsMutation.mutate(productIds, {
      onSuccess: () => toast.success("Products deleted successfully"),
      onError: () => toast.error("Failed to delete products"),
    });
  };

  const handleBulkStatusUpdate = (status) => {
    if (selectedIds.length === 0) return;
    const productIds = [...selectedIds];

    // Clear selection instantly to match the immediate optimistic UI update
    dispatch(clearSelection());

    bulkUpdateProductStatusMutation.mutate(
      { productIds, status },
      {
        onSuccess: () => toast.success(`Products marked as ${status}`),
        onError: () => toast.error("Failed to update product status"),
      }
    );
  };

  const handleMarkActive = () => {
    handleBulkStatusUpdate("active");
  };

  const handleMarkInactive = () => {
    handleBulkStatusUpdate("inactive");
  };

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

  const productFormModal = productModal && (
    <ProductFormModal
      key={`${productModal.mode}-${productModal.product?.id ?? "new"}`}
      mode={productModal.mode}
      product={productModal.product}
      onClose={handleCloseProductModal}
      onSubmit={handleProductSubmit}
      // Removed isSubmitting and submissionError since it closes immediately
    />
  );

  if (isPending) {
    return (
      <div className="products-page">
        {toolbar}
        <ProductLoadingState />
        {productFormModal}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="products-page">
        {toolbar}
        <ProductErrorState message={error?.message} onRetry={refetch} />
        {productFormModal}
      </div>
    );
  }

  if (isFetching && isPlaceholderData) {
    return (
      <div className="products-page">
        {toolbar}
        <ProductLoadingState message="Loading products..." />
        {productFormModal}
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
          onPrevious={() => updateParams({ page: page - 1 })}
          onNext={() => updateParams({ page: page + 1 })}
          isDisabled={true}
          isFetching={false}
        />
        {productFormModal}
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
        onPrevious={() => updateParams({ page: page - 1 })}
        onNext={() => updateParams({ page: page + 1 })}
        isDisabled={isPlaceholderData}
        isFetching={isFetching}
      />

      {productFormModal}

      {productToDelete && (
        <DeleteProductModal
          product={productToDelete}
          onClose={handleCloseDeleteModal}
          onConfirm={handleDeleteConfirm}
          // Removed isDeleting and deletionError props
        />
      )}

      {showBulkDeleteModal && (
        <BulkDeleteProductsModal
          productCount={selectedProductCount}
          onClose={handleCloseBulkDeleteModal}
          onConfirm={handleBulkDeleteConfirm}
          // Removed isDeleting and deletionError props
        />
      )}
    </div>
  );
}