const API_URL = "https://6a97c4900e3240db90620c53.mockapi.io/api/products";


export async function getProducts(params = {}, signal) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const response = await fetch(url, {
    signal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products (${response.status} ${response.statusText})`,
    );
  }

  const data = await response.json();
  return data;
}


export async function createProduct(productData) {
  const now = new Date().toISOString();

  const product = {
    ...productData,
    createdAt: now,
    updatedAt: now,
  };

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to create product (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}

export async function updateProduct({ id, data }) {
  const product = {
    ...data,
    updatedAt: new Date().toISOString(),
  };

  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update product (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error(
      `Failed to delete product (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}

export async function updateProductStatus({ id, status }) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to update product status (${response.status} ${response.statusText})`,
    );
  }

  return response.json();
}
