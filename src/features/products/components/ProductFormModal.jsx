import {
  DollarSign,
  Package,
  Tag,
  X,
} from "lucide-react";
import { useState } from "react";

const categories = [
  {
    value: "sports",
    label: "Sports",
  },
  {
    value: "electronics",
    label: "Electronics",
  },
  {
    value: "books",
    label: "Books",
  },
  {
    value: "clothing",
    label: "Clothing",
  },
  {
    value: "home-kitchen",
    label: "Home & Kitchen",
  },
];

function getInitialFormData(product) {
  return {
    title: product?.title ?? "",
    price: product?.price ?? "",
    category: product?.category ?? "",
    stock: product?.stock ?? "",
    status: product?.status ?? "active",
  };
}

export default function ProductFormModal({
  mode = "add",
  product = null,
  onClose,
  onSubmit,
}) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState(() =>
    getInitialFormData(product)
  );

  const [errors, setErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!formData.title.trim()) {
      nextErrors.title = "Product name is required.";
    }

    if (
      formData.price === "" ||
      Number(formData.price) < 0
    ) {
      nextErrors.price = "Enter a valid price.";
    }

    if (!formData.category) {
      nextErrors.category = "Select a category.";
    }

    if (
      formData.stock === "" ||
      Number(formData.stock) < 0
    ) {
      nextErrors.stock = "Enter a valid stock quantity.";
    }

    if (!formData.status) {
      nextErrors.status = "Select a status.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await onSubmit({
        ...formData,
        title: formData.title.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
      });
    } finally {
      setIsSubmitting(false);
    }
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
        className="modal modal-form"
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-form-title"
      >
        <div className="modal-header">
          <div>

            <h2 id="product-form-title">
              {isEditMode
                ? "Edit product"
                : "Add product"}
            </h2>

            <p>
              {isEditMode
                ? "Update the details for this product."
                : "Add a new product to your catalog."}
            </p>
          </div>

          <button
            type="button"
            className="modal-close-button"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={19} />
          </button>
        </div>

        <form
          className="product-form"
          onSubmit={handleSubmit}
        >
          <div className="form-field form-field-full">
            <label htmlFor="product-title">
              Product name
            </label>

            <div
              className={`form-input-wrapper ${
                errors.title ? "has-error" : ""
              }`}
            >
              <Tag size={16} />

              <input
                id="product-title"
                type="text"
                value={formData.title}
                onChange={(event) =>
                  updateField(
                    "title",
                    event.target.value
                  )
                }
                placeholder="e.g. Wireless Headphones"
                autoFocus
              />
            </div>

            {errors.title && (
              <span className="form-error">
                {errors.title}
              </span>
            )}
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="product-price">
                Price
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.price ? "has-error" : ""
                }`}
              >
                <DollarSign size={16} />

                <input
                  id="product-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(event) =>
                    updateField(
                      "price",
                      event.target.value
                    )
                  }
                  placeholder="0.00"
                />
              </div>

              {errors.price && (
                <span className="form-error">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="product-stock">
                Stock
              </label>

              <div
                className={`form-input-wrapper ${
                  errors.stock ? "has-error" : ""
                }`}
              >
                <Package size={16} />

                <input
                  id="product-stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={(event) =>
                    updateField(
                      "stock",
                      event.target.value
                    )
                  }
                  placeholder="0"
                />
              </div>

              {errors.stock && (
                <span className="form-error">
                  {errors.stock}
                </span>
              )}
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="product-category">
                Category
              </label>

              <select
                id="product-category"
                className={
                  errors.category ? "has-error" : ""
                }
                value={formData.category}
                onChange={(event) =>
                  updateField(
                    "category",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select category
                </option>

                {categories.map((category) => (
                  <option
                    key={category.value}
                    value={category.value}
                  >
                    {category.label}
                  </option>
                ))}
              </select>

              {errors.category && (
                <span className="form-error">
                  {errors.category}
                </span>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="product-status">
                Status
              </label>

              <select
                id="product-status"
                className={
                  errors.status ? "has-error" : ""
                }
                value={formData.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value
                  )
                }
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>

              {errors.status && (
                <span className="form-error">
                  {errors.status}
                </span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="modal-button modal-button-secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="modal-button modal-button-primary"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Save changes"
                  : "Add product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}