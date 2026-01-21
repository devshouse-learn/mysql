import { useState, useEffect } from 'react';
import { reportService, productService, categoryService, warehouseService } from '../services';

function Dashboard() {
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState(null);
  const [lowStock, setLowStock] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    setLoading(true);
    setError('');
    try {
      // Cargar estadísticas directamente desde los endpoints básicos
      await loadBasicStats();
    } catch (err) {
      console.error('Error loading reports:', err);
      setError('Error al cargar estadísticas. Por favor, intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const loadBasicStats = async () => {
    try {
      const [productsRes, categoriesRes, warehousesRes] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        warehouseService.getAll()
      ]);

      const products = productsRes.data;
      const categories = categoriesRes.data;
      const warehouses = warehousesRes.data;

      // Calcular estadísticas manualmente
      const totalStock = products.reduce((sum, p) => sum + (p.quantityInStock || 0), 0);
      const totalValue = products.reduce((sum, p) => sum + ((p.quantityInStock || 0) * (p.price || 0)), 0);
      const lowStockProducts = products.filter(p => p.quantityInStock <= p.reorderLevel);

      // Agrupar por categoría
      const categoryMap = {};
      products.forEach(p => {
        const catName = p.category?.name || 'Sin categoría';
        if (!categoryMap[catName]) {
          categoryMap[catName] = {
            categoryName: catName,
            categoryId: p.categoryId,
            productCount: 0,
            totalStock: 0,
            totalValue: 0
          };
        }
        categoryMap[catName].productCount++;
        categoryMap[catName].totalStock += (p.quantityInStock || 0);
        categoryMap[catName].totalValue += ((p.quantityInStock || 0) * (p.price || 0));
      });

      setSummary({
        totalProducts: products.length,
        totalCategories: categories.length,
        totalWarehouses: warehouses.length,
        totalStock: totalStock,
        totalValue: totalValue,
        lowStockCount: lowStockProducts.length
      });

      setLowStock(lowStockProducts);
      setCategoryDist(Object.values(categoryMap));
    } catch (err) {
      console.error('Error loading basic stats:', err);
      setError('Error al cargar estadísticas');
    }
  };

  if (loading) return <div className="loading">Cargando reportes...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Dashboard</h1>
        <button onClick={loadReports} className="btn btn-secondary">
          🔄 Actualizar
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {summary && (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📦</div>
            <div className="stat-details">
              <div className="stat-label">Total Productos</div>
              <div className="stat-value">{summary.totalProducts}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📂</div>
            <div className="stat-details">
              <div className="stat-label">Categorías</div>
              <div className="stat-value">{summary.totalCategories}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">🏪</div>
            <div className="stat-details">
              <div className="stat-label">Bodegas</div>
              <div className="stat-value">{summary.totalWarehouses || 0}</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-details">
              <div className="stat-label">Valor Total</div>
              <div className="stat-value">${summary.totalValue?.toLocaleString()} COP</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">📊</div>
            <div className="stat-details">
              <div className="stat-label">Stock Total</div>
              <div className="stat-value">{summary.totalStock}</div>
            </div>
          </div>

          <div className="stat-card warning">
            <div className="stat-icon">⚠️</div>
            <div className="stat-details">
              <div className="stat-label">Stock Bajo</div>
              <div className="stat-value">{summary.lowStockCount || 0}</div>
            </div>
          </div>
        </div>
      )}

      <div className="reports-grid">
        <div className="report-card">
          <h3>⚠️ Productos con Stock Bajo</h3>
          {lowStock.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Nivel Reorden</th>
                  </tr>
                </thead>
                <tbody>
                  {lowStock.map((item) => (
                    <tr key={item.id}>
                      <td>{item.name}</td>
                      <td className="text-danger">{item.quantityInStock}</td>
                      <td>{item.reorderLevel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">✅ Todos los productos tienen stock suficiente</div>
          )}
        </div>

        <div className="report-card">
          <h3>📊 Distribución por Categoría</h3>
          {categoryDist.length > 0 ? (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Categoría</th>
                    <th>Productos</th>
                    <th>Stock Total</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryDist.map((cat) => (
                    <tr key={cat.categoryId}>
                      <td>{cat.categoryName}</td>
                      <td>{cat.productCount}</td>
                      <td>{cat.totalStock}</td>
                      <td>${cat.totalValue?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-state">No hay datos disponibles</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
