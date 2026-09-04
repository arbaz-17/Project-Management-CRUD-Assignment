export function validateProductForm(formData) {
  const errors = {};

  if (!formData.title.trim()) {
    errors.title = "Product name is required.";
  }

  if (formData.price === "" || Number(formData.price) < 0) {
    errors.price = "Enter a valid price.";
  }

  if (!formData.category) {
    errors.category = "Select a category.";
  }

  if (formData.stock === "" || Number(formData.stock) < 0) {
    errors.stock = "Enter a valid stock quantity.";
  }

  if (!formData.status) {
    errors.status = "Select a status.";
  }

  return errors;
}