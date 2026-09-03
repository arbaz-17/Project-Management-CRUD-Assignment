import {
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import { updateProduct } from "../../../services/productApi.js";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateProduct,

    onMutate: async ({ id, data }) => {
      /*
       * Stop any product queries that are currently
       * fetching so they don't overwrite our optimistic
       * change with older server data.
       */
      await queryClient.cancelQueries({
        queryKey: ["products"],
      });

      /*
       * Save every cached product query so we can
       * restore the previous state if the mutation fails.
       */
      const previousQueries =
        queryClient.getQueriesData({
          queryKey: ["products"],
        });

      /*
       * Update every cached product list immediately.
       *
       * The actual query cache contains the raw API array,
       * not the data returned by useProducts' select function.
       */
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
              : product
          );
        }
      );

      /*
       * This context is passed to onError so we can
       * rollback the optimistic update.
       */
      return {
        previousQueries,
      };
    },

    onError: (_error, _variables, context) => {
      /*
       * Restore every cached query to the exact state
       * it had before the optimistic update.
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
       * Whether the request succeeds or fails, refetch
       * the server state so the cache ends up authoritative.
       */
      queryClient.invalidateQueries({
        queryKey: ["products"],
      });
    },
  });
}