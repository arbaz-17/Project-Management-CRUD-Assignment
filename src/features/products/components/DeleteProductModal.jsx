import {
  AlertTriangle,
  Trash2,
} from "lucide-react";

export default function DeleteProductModal({
  product,
  onClose,
  onConfirm,
  isDeleting = false,
  deletionError = null,
}) {
  const handleConfirm = async () => {
    await onConfirm(product);
  };

  return (
    <div
      className="modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="modal modal-delete"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-product-title"
      >
        <div className="delete-icon">
          <AlertTriangle size={27} />
        </div>

        <div className="delete-content">
          <h2 id="delete-product-title">
            Delete this product?
          </h2>

          <p>
            You are about to delete{" "}
            <strong>{product?.title}</strong>. This action
            cannot be undone.
          </p>

          {deletionError && (
            <div className="form-error">
              {deletionError.message ||
                "Failed to delete product. Please try again."}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="modal-button modal-button-secondary"
            onClick={onClose}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="modal-button modal-button-danger"
            onClick={handleConfirm}
            disabled={isDeleting}
          >
            <Trash2 size={16} />

            {isDeleting
              ? "Deleting..."
              : "Delete product"}
          </button>
        </div>
      </div>
    </div>
  );
}