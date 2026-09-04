export default function ProductTableSkeleton() {
  return (
    <div className="table-card">
      <div className="table-scroll">
        <table className="product-table">
          <thead>
            <tr>
              <th className="checkbox-column">
                <span className="skeleton skeleton-checkbox" />
              </th>

              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Created</th>
              <th className="action-column">Action</th>
            </tr>
          </thead>

          <tbody>
            {Array.from({ length: 6 }).map((_, index) => (
              <tr key={index}>
                <td>
                  <span className="skeleton skeleton-checkbox" />
                </td>

                <td>
                  <span className="skeleton skeleton-title" />
                </td>

                <td>
                  <span className="skeleton skeleton-text" />
                </td>

                <td>
                  <span className="skeleton skeleton-price" />
                </td>

                <td>
                  <span className="skeleton skeleton-stock" />
                </td>

                <td>
                  <span className="skeleton skeleton-status" />
                </td>

                <td>
                  <span className="skeleton skeleton-date" />
                </td>

                <td>
                  <div className="skeleton-actions">
                    <span className="skeleton skeleton-action" />
                    <span className="skeleton skeleton-action" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
