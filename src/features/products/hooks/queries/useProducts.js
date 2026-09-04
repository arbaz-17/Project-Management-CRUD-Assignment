import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getProducts } from "../../../../services/productApi.js";

export function useProducts(params) {
  const requestedLimit = params.limit;

  return useQuery({
    queryKey: ["products", params],

    queryFn: ({ signal }) =>
      getProducts(
        {
          ...params,
          limit: requestedLimit + 1,
        },
        signal,
      ),

    placeholderData: keepPreviousData,

    select: (products) => {
      const hasNextPage = products.length > requestedLimit;

      return {
        products: products.slice(0, requestedLimit),
        hasNextPage,
      };
    },
  });
}
