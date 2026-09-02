import { useQuery } from "@tanstack/react-query";

import { getProducts } from "../../../services/productApi.js";

export function useProducts(params) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () => getProducts(params),
  });
}