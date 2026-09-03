import { useEffect } from "react";
import { useSelector } from "react-redux";

import ProductCatalog from "./features/products/components/ProductCatalog";
import { selectTheme } from "./lib/redux/selectors.js";

function App() {
  const theme = useSelector(selectTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    window.localStorage.setItem(
      "product-management-theme",
      theme
    );
  }, [theme]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <div>
          <span className="app-eyebrow">
            PROJECT MANAGEMENT SYSTEM - WEEK 7 ASSIGNMENT
          </span>

          <h1>Products</h1>
        </div>
      </header>

      <ProductCatalog />
    </main>
  );
}

export default App;