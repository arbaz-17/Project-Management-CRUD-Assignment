import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateProduct } from "../../../../services/productApi.js";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      const previousQueries = queryClient.getQueriesData({
        queryKey: ["products"],
      });

      queryClient.setQueriesData(
        {
          queryKey: ["products"],
        },
        (oldProducts) => {
          if (!Array.isArray(oldProducts)) {
            return oldProducts;
          }

          return oldProducts.map((product) =>
            product.id === id
              ? {
                  ...product,
                  ...data,
                }
              : product,
          );
        },
      );

      return {
        previousQueries,
      };
    },

    onError: (_error, _variables, context) => {
      context?.previousQueries?.forEach(([queryKey, previousData]) => {
        queryClient.setQueryData(queryKey, previousData);
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}
