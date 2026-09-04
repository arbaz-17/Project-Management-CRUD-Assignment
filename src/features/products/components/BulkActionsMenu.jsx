import {
  ChevronDown,
  Trash2,
} from "lucide-react";
import { useState } from "react";

export default function BulkActionsMenu({
  selectedProductCount,
  onDeleteSelected,
  onMarkActive,
  onMarkInactive,
  isProcessing = false,
}) {
  const [isOpen, setIsOpen] = useState(false);

  if (selectedProductCount === 0) {
    return null;
  }

  const handleAction = (action) => {
    setIsOpen(false);
    action();
  };

  return (
    <div className="bulk-actions-menu">
      <button
        type="button"
        className="selection-bar-button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-haspopup="menu"
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Bulk Actions"}
        <ChevronDown size={15} />
      </button>

      {isOpen && !isProcessing && (
        <div className="bulk-actions-dropdown" role="menu">
          <button
            type="button"
            className="bulk-action-item"
            role="menuitem"
            onClick={() => handleAction(onDeleteSelected)}
          >
            <Trash2 size={15} />
            Delete selected
          </button>

          <button
            type="button"
            className="bulk-action-item"
            role="menuitem"
            onClick={() => handleAction(onMarkActive)}
          >
            Mark active
          </button>

          <button
            type="button"
            className="bulk-action-item"
            role="menuitem"
            onClick={() => handleAction(onMarkInactive)}
          >
            Mark inactive
          </button>
        </div>
      )}
    </div>
  );
}