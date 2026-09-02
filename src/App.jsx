import { useEffect, useState } from "react";

import ProductCatalog from "./features/products/components/ProductCatalog";

function getInitialTheme() {
  const savedTheme = window.localStorage.getItem(
    "product-management-theme"
  );

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)")
    .matches
    ? "dark"
    : "light";
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    window.localStorage.setItem(
      "product-management-theme",
      theme
    );
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme((currentTheme) =>
      currentTheme === "dark" ? "light" : "dark"
    );
  };

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

      <ProductCatalog
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    </main>
  );
}

export default App;