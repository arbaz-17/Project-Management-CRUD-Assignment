import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { deleteProduct } from "../../../../services/productApi.js";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProduct,

    onMutate: async (productId) => {
      /*
       * Prevent an in-flight product query from
       * overwriting our optimistic deletion.
       */
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      /*
       * Save all currently cached product lists so
       * we can restore them if DELETE fails.
       */
      const previousQueries =
        queryClient.getQueriesData({
          queryKey: ["products"],
        });

      /*
       * Remove the product immediately from every
       * cached product list.
       */
      queryClient.setQueriesData(
        {
          queryKey: ["products"],
        },
        (oldProducts) => {
          if (!Array.isArray(oldProducts)) {
            return oldProducts;
          }

          return oldProducts.filter(
            (product) => product.id !== productId
          );
        }
      );

      /*
       * Return the snapshot for rollback.
       */
      return {
        previousQueries,
      };
    },

    onError: (_error, _productId, context) => {
      /*
       * Restore every cached product query to the
       * state it had before the optimistic delete.
       */
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
      /*
       * Confirm the cache against the server whether
       * the DELETE succeeded or failed.
       */
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}