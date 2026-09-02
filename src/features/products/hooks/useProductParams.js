import { useCallback, useEffect, useState } from "react";

export function useProductParams() {
  const [, setUrlVersion] = useState(0);

  useEffect(() => {
    const handlePopState = () => {
      setUrlVersion((version) => version + 1);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const searchParams = new URLSearchParams(window.location.search);

  const page = Number(searchParams.get("page")) || 1;
  const title = searchParams.get("title") || "";
  const category = searchParams.get("category") || "";
  const status = searchParams.get("status") || "";

  const updateParams = useCallback((updates) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    window.history.pushState(
      {},
      "",
      `${window.location.pathname}?${params.toString()}`
    );

    window.dispatchEvent(new PopStateEvent("popstate"));
  }, []);

  return {
    page,
    title,
    category,
    status,
    updateParams,
  };
}