import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteProduct } from "../../../../services/productApi.js";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (productId) => {
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

          return oldProducts.filter((product) => product.id !== productId);
        },
      );
      return {
        previousQueries,
      };
    },

    onError: (_error, _productId, context) => {
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
