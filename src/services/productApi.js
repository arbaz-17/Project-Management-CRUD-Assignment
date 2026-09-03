const API_URL = "https://6a97c4900e3240db90620c53.mockapi.io/api/products";

export async function getProducts(params = {}) {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

  const url = queryString
    ? `${API_URL}?${queryString}`
    : API_URL;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch products (${response.status} ${response.statusText})`
    );
  }

  return response.json();
}