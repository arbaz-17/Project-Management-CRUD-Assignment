import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteProduct } from "../../../services/productApi.js";

export function useBulkDeleteProducts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productIds) => {
      const results = await Promise.allSettled(
        productIds.map((id) => deleteProduct(id))
      );

      const failedResults = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedResults.length > 0) {
        throw new Error(
          `Failed to delete ${failedResults.length} product${
            failedResults.length === 1 ? "" : "s"
          }.`
        );
      }

      return results;
    },

    onMutate: async (productIds) => {
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      const previousQueries =
        queryClient.getQueriesData({
          queryKey: ["products"],
        });

      const productIdSet = new Set(productIds);

      queryClient.setQueriesData(
        {
          queryKey: ["products"],
        },
        (oldProducts) => {
          if (!Array.isArray(oldProducts)) {
            return oldProducts;
          }

          return oldProducts.filter(
            (product) => !productIdSet.has(product.id)
          );
        }
      );

      return {
        previousQueries,
      };
    },

    onError: (_error, _productIds, context) => {
      context?.previousQueries?.forEach(
        ([queryKey, previousData]) => {
          queryClient.setQueryData(
            queryKey,
            previousData
          );
        }
      );
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}