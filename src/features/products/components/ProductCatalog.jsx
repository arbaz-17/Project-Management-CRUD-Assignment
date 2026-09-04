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

  const handleClearSelection = () => {
    dispatch(clearSelection());
  };

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

  const handleDelete = (product) => {
    setProductToDelete(product);
  };

  const handleCloseDeleteModal = () => {
    setProductToDelete(null);
  };

  const handleDeleteConfirm = (product) => {
    const productId = product.id;

    setProductToDelete(null);

    deleteProductMutation.mutate(productId);
  };

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

    const productIds = [...selectedIds];

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

  /*
   * Keep the product form modal independent from the catalog's
   * loading/error/empty states.
   *
   * Without this, clicking "Create Product" could update
   * productModal state while the component returned early from
   * one of those states, meaning the modal was never rendered.
   */
  const productFormModal = productModal && (
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

        <ProductErrorState
          message={error?.message}
          onRetry={refetch}
        />

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
          {products.length}{" "}
          {products.length === 1 ? "item" : "items"}
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

      {productFormModal}

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
