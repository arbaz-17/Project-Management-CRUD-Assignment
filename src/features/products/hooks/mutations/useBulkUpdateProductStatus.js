import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProductStatus } from "../../../../services/productApi.js";

export function useBulkUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productIds, status }) => {
      const results = await Promise.allSettled(
        productIds.map((id) =>
          updateProductStatus({
            id,
            status,
          })
        )
      );

      const failedResults = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedResults.length > 0) {
        throw new Error(
          `Failed to update ${failedResults.length} product${
            failedResults.length === 1 ? "" : "s"
          }.`
        );
      }

      return results;
    },

    onMutate: async ({ productIds, status }) => {
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

          return oldProducts.map((product) =>
            productIdSet.has(product.id)
              ? {
                  ...product,
                  status,
                }
              : product
          );
        }
      );

      return {
        previousQueries,
      };
    },

    onError: (_error, _variables, context) => {
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