import { useEffect, useState } from "react";

import { useProducts } from "../hooks/useProducts";
import { useProductParams } from "../hooks/useProductParams";

export default function ProductList() {
  const {
    page,
    title,
    category,
    status,
    updateParams,
  } = useProductParams();

  const [titleInput, setTitleInput] = useState(title);

  const { data, isPending, isError, error } = useProducts({
    page,
    limit: 10,
    title,
    category,
    status,
  });

  // Debounce title changes before updating the URL.
  useEffect(() => {
    if (titleInput === title) {
      return;
    }

    const timeoutId = setTimeout(() => {
      updateParams({
        title: titleInput,
        page: 1,
      });
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [titleInput, title, updateParams]);

  // Keep local input synchronized with browser Back/Forward.
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);

      setTitleInput(params.get("title") || "");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const handleTitleChange = (event) => {
    setTitleInput(event.target.value);
  };

  const handleCategoryChange = (event) => {
    updateParams({
      category: event.target.value,
      page: 1,
    });
  };

  const handleStatusChange = (event) => {
    updateParams({
      status: event.target.value,
      page: 1,
    });
  };

  if (isPending) {
    return <p>Loading products...</p>;
  }

  if (isError) {
    return <p>Failed to load products: {error.message}</p>;
  }

  return (
    <div>
      <h1>Products</h1>

      <div>
        <input
          type="text"
          placeholder="Search by title"
          value={titleInput}
          onChange={handleTitleChange}
        />

        <select value={category} onChange={handleCategoryChange}>
          <option value="">All categories</option>
          <option value="sports">Sports</option>
          <option value="electronics">Electronics</option>
          <option value="books">Books</option>
          <option value="clothing">Clothing</option>
          <option value="home-kitchen">Home & Kitchen</option>
        </select>

        <select value={status} onChange={handleStatusChange}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {data.map((product) => (
        <article key={product.id}>
          <h2>{product.title}</h2>
          <p>${product.price}</p>
          <p>{product.category}</p>
          <p>{product.status}</p>
        </article>
      ))}

      <div>
        <button
          onClick={() => updateParams({ page: page - 1 })}
          disabled={page === 1}
        >
          Previous
        </button>

        <span> Page {page} </span>

        <button
          onClick={() => updateParams({ page: page + 1 })}
        >
          Next
        </button>
      </div>
    </div>
  );
}