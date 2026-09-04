import { LoaderCircle } from "lucide-react";

export default function ProductLoadingState({
  message = "Loading products...",
}) {
  return (
    <div className="products-state products-loading-state">
      <div className="loading-spinner">
        <LoaderCircle size={30} />
      </div>

      <h3>{message}</h3>

      <p>Please wait while we fetch the latest products.</p>
    </div>
  );
}
