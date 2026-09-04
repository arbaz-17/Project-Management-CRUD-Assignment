import { AlertTriangle, Trash2 } from "lucide-react";

export default function BulkDeleteProductsModal({
  productCount,
  onClose,
  onConfirm,
  isDeleting = false,
  deletionError = null,
}) {
  const handleConfirm = async () => {
    await onConfirm();
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
        aria-labelledby="bulk-delete-products-title"
      >
        <div className="delete-icon">
          <AlertTriangle size={27} />
        </div>

        <div className="delete-content">
          <h2 id="bulk-delete-products-title">Delete selected products?</h2>

          <p>
            You are about to delete <strong>{productCount} products</strong>.
            This action cannot be undone.
          </p>

          {deletionError && (
            <div className="form-error">
              {deletionError.message ||
                "Failed to delete selected products. Please try again."}
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

            {isDeleting ? "Deleting..." : "Delete products"}
          </button>
        </div>
      </div>
    </div>
  );
}
