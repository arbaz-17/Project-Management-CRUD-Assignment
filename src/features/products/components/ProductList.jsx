import { useProducts } from "../hooks/useProducts";
import { useProductParams } from "../hooks/useProductParams";

export default function ProductList() {
  const { page, updatePage } = useProductParams();

  const { data, isPending, isError, error } = useProducts({
    page,
    limit: 10,
  });

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products: {error.message}</p>;
  }

  return (
    <div>
      <h1>Products</h1>

      {data.map((product) => (
        <article key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          <p>{product.category}</p>
        </article>
      ))}

      <div>
        <button
          onClick={() => updatePage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span> Page {page} </span>

        <button onClick={() => updatePage(page + 1)}>
          Next
        </button>
      </div>
    </div>
  );
}