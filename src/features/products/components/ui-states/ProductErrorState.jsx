import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

export default function ProductErrorState({
  message,
  onRetry,
}) {
  return (
    <div className="products-state products-error-state">
      <div className="state-icon state-icon-error">
        <AlertCircle size={26} />
      </div>

      <h3>Something went wrong</h3>

      <p>
        {message ||
          "We couldn't load the products right now. Please try again."}
      </p>

      <button
        type="button"
        className="toolbar-button toolbar-button-primary"
        onClick={onRetry}
      >
        <RefreshCw size={16} />
        Try again
      </button>
    </div>
  );
}