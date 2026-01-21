import { useState, useEffect } from 'react';
import { reportService, productService, categoryService, warehouseService, movementService } from '../services';

function Reports() {
  const [loading, setLoading] = useState(false);
  const [reportType, setReportType] = useState('inventory');
  const [reportData, setReportData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadReport();
  }, [reportType]);

  const loadReport = async () => {
    setLoading(true);
    setError('');
    try {
      let data;
      
      switch (reportType) {
        case 'inventory':
          data = await loadInventoryReport();
          break;
        case 'movements':
          data = await loadMovementsReport();
          break;
        case 'categories':
          data = await loadCategoriesReport();
          break;
        case 'warehouses':
          data = await loadWarehousesReport();
          break;
        default:
          data = await loadInventoryReport();
      }
      
      setReportData(data);
    } catch (err) {
      console.error('Error loading report:', err);
      setError('Error al cargar el reporte');
    } finally {
      setLoading(false);
    }
  };

  const loadInventoryReport = async () => {
    const productsRes = await productService.getAll();
    const products = productsRes.data;
    
    const totalStock = products.reduce((sum, p) => sum + (p.quantityInStock || 0), 0);
    const totalValue = products.reduce((sum, p) => sum + ((p.quantityInStock || 0) * (parseFloat(p.price) || 0)), 0);
    const lowStock = products.filter(p => p.quantityInStock <= p.reorderLevel);
    const outOfStock = products.filter(p => p.quantityInStock === 0);
    
    return {
      type: 'inventory',
      summary: {
        totalProducts: products.length,
        totalStock,
        totalValue,
        lowStockCount: lowStock.length,
        outOfStockCount: outOfStock.length
      },
      products: products.map(p => ({
        id: p.id,
        name: p.name,
        sku: p.sku,
        category: p.category?.name || 'Sin categoría',
        warehouse: p.warehouse?.name || 'Sin bodega',
        stock: p.quantityInStock,
        price: parseFloat(p.price) || 0,
        value: (p.quantityInStock || 0) * (parseFloat(p.price) || 0),
        status: p.quantityInStock === 0 ? 'Sin stock' : p.quantityInStock <= p.reorderLevel ? 'Bajo stock' : 'Normal'
      }))
    };
  };

  const loadMovementsReport = async () => {
    const movementsRes = await movementService.getAll();
    const movements = movementsRes.data;
    
    const entries = movements.filter(m => m.type === 'entry');
    const exits = movements.filter(m => m.type === 'exit');
    const adjustments = movements.filter(m => m.type === 'adjustment');
    
    const totalEntries = entries.reduce((sum, m) => sum + (m.quantity || 0), 0);
    const totalExits = exits.reduce((sum, m) => sum + (m.quantity || 0), 0);
    
    return {
      type: 'movements',
      summary: {
        totalMovements: movements.length,
        entries: entries.length,
        exits: exits.length,
        adjustments: adjustments.length,
        totalEntries,
        totalExits,
        netMovement: totalEntries - totalExits
      },
      movements: movements.slice(0, 50).map(m => ({
        id: m.id,
        date: new Date(m.movementDate).toLocaleDateString(),
        type: m.type === 'entry' ? 'Entrada' : m.type === 'exit' ? 'Salida' : 'Ajuste',
        product: m.product?.name || 'N/A',
        warehouse: m.warehouse?.name || 'N/A',
        quantity: m.quantity,
        user: m.user?.username || 'N/A',
        notes: m.notes || '-'
      }))
    };
  };

  const loadCategoriesReport = async () => {
    const categoriesRes = await categoryService.getAll();
    const productsRes = await productService.getAll();
    const categories = categoriesRes.data;
    const products = productsRes.data;
    
    const categoryStats = categories.map(cat => {
      const catProducts = products.filter(p => p.categoryId === cat.id);
      const totalStock = catProducts.reduce((sum, p) => sum + (p.quantityInStock || 0), 0);
      const totalValue = catProducts.reduce((sum, p) => sum + ((p.quantityInStock || 0) * (parseFloat(p.price) || 0)), 0);
      
      return {
        id: cat.id,
        name: cat.name,
        description: cat.description || '-',
        productCount: catProducts.length,
        totalStock,
        totalValue,
        isActive: cat.isActive
      };
    });
    
    return {
      type: 'categories',
      summary: {
        totalCategories: categories.length,
        activeCategories: categories.filter(c => c.isActive).length,
        totalProducts: products.length
      },
      categories: categoryStats
    };
  };

  const loadWarehousesReport = async () => {
    const warehousesRes = await warehouseService.getAll();
    const productsRes = await productService.getAll();
    const warehouses = warehousesRes.data;
    const products = productsRes.data;
    
    const warehouseStats = warehouses.map(wh => {
      const whProducts = products.filter(p => p.warehouseId === wh.id);
      const totalStock = whProducts.reduce((sum, p) => sum + (p.quantityInStock || 0), 0);
      const totalValue = whProducts.reduce((sum, p) => sum + ((p.quantityInStock || 0) * (parseFloat(p.price) || 0)), 0);
      
      return {
        id: wh.id,
        name: wh.name,
        location: wh.location || '-',
        productCount: whProducts.length,
        totalStock,
        totalValue,
        capacity: wh.capacity || '-'
      };
    });
    
    return {
      type: 'warehouses',
      summary: {
        totalWarehouses: warehouses.length,
        totalProducts: products.length
      },
      warehouses: warehouseStats
    };
  };

  const renderInventoryReport = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{reportData.summary.totalProducts}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-details">
            <div className="stat-label">Stock Total</div>
            <div className="stat-value">{reportData.summary.totalStock}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-details">
            <div className="stat-label">Valor Total</div>
            <div className="stat-value">${reportData.summary.totalValue.toLocaleString()} COP</div>
          </div>
        </div>
        <div className="stat-card warning">
          <div className="stat-icon">⚠️</div>
          <div className="stat-details">
            <div className="stat-label">Bajo Stock</div>
            <div className="stat-value">{reportData.summary.lowStockCount}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Detalle de Inventario</h3>
        <table>
          <thead>
            <tr>
              <th>SKU</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Bodega</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Valor Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reportData.products.map(p => (
              <tr key={p.id}>
                <td>{p.sku}</td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>{p.warehouse}</td>
                <td>{p.stock}</td>
                <td>${p.price.toLocaleString()} COP</td>
                <td>${p.value.toLocaleString()} COP</td>
                <td>
                  <span className={`badge ${
                    p.status === 'Sin stock' ? 'inactive' : 
                    p.status === 'Bajo stock' ? 'warning' : 'active'
                  }`}>
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderMovementsReport = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-details">
            <div className="stat-label">Total Movimientos</div>
            <div className="stat-value">{reportData.summary.totalMovements}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-details">
            <div className="stat-label">Entradas</div>
            <div className="stat-value">{reportData.summary.totalEntries}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-details">
            <div className="stat-label">Salidas</div>
            <div className="stat-value">{reportData.summary.totalExits}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⚖️</div>
          <div className="stat-details">
            <div className="stat-label">Movimiento Neto</div>
            <div className="stat-value">{reportData.summary.netMovement}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Últimos 50 Movimientos</h3>
        <table>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Tipo</th>
              <th>Producto</th>
              <th>Bodega</th>
              <th>Cantidad</th>
              <th>Usuario</th>
              <th>Notas</th>
            </tr>
          </thead>
          <tbody>
            {reportData.movements.map(m => (
              <tr key={m.id}>
                <td>{m.date}</td>
                <td>
                  <span className={`badge ${
                    m.type === 'Entrada' ? 'active' : 
                    m.type === 'Salida' ? 'warning' : 'inactive'
                  }`}>
                    {m.type}
                  </span>
                </td>
                <td>{m.product}</td>
                <td>{m.warehouse}</td>
                <td>{m.quantity}</td>
                <td>{m.user}</td>
                <td>{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderCategoriesReport = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📂</div>
          <div className="stat-details">
            <div className="stat-label">Total Categorías</div>
            <div className="stat-value">{reportData.summary.totalCategories}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-details">
            <div className="stat-label">Activas</div>
            <div className="stat-value">{reportData.summary.activeCategories}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{reportData.summary.totalProducts}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Estadísticas por Categoría</h3>
        <table>
          <thead>
            <tr>
              <th>Categoría</th>
              <th>Descripción</th>
              <th>Productos</th>
              <th>Stock Total</th>
              <th>Valor Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {reportData.categories.map(c => (
              <tr key={c.id}>
                <td>{c.name}</td>
                <td>{c.description}</td>
                <td>{c.productCount}</td>
                <td>{c.totalStock}</td>
              <td>${c.totalValue.toLocaleString()} COP</td>
                <td>
                  <span className={`badge ${c.isActive ? 'active' : 'inactive'}`}>
                    {c.isActive ? 'Activa' : 'Inactiva'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  const renderWarehousesReport = () => (
    <>
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🏪</div>
          <div className="stat-details">
            <div className="stat-label">Total Bodegas</div>
            <div className="stat-value">{reportData.summary.totalWarehouses}</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-details">
            <div className="stat-label">Total Productos</div>
            <div className="stat-value">{reportData.summary.totalProducts}</div>
          </div>
        </div>
      </div>

      <div className="table-container">
        <h3>Estadísticas por Bodega</h3>
        <table>
          <thead>
            <tr>
              <th>Bodega</th>
              <th>Ubicación</th>
              <th>Productos</th>
              <th>Stock Total</th>
              <th>Valor Total</th>
              <th>Capacidad</th>
            </tr>
          </thead>
          <tbody>
            {reportData.warehouses.map(w => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.location}</td>
                <td>{w.productCount}</td>
                <td>{w.totalStock}</td>
                <td>${w.totalValue.toLocaleString()} COP</td>
                <td>{w.capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📈 Reportes</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select 
            value={reportType} 
            onChange={(e) => setReportType(e.target.value)}
            style={{ padding: '10px', borderRadius: '5px', border: '1px solid #ddd' }}
          >
            <option value="inventory">Reporte de Inventario</option>
            <option value="movements">Reporte de Movimientos</option>
            <option value="categories">Reporte de Categorías</option>
            <option value="warehouses">Reporte de Bodegas</option>
          </select>
          <button onClick={loadReport} className="btn btn-primary">
            🔄 Actualizar
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Generando reporte...</div>
      ) : reportData ? (
        <>
          {reportData.type === 'inventory' && renderInventoryReport()}
          {reportData.type === 'movements' && renderMovementsReport()}
          {reportData.type === 'categories' && renderCategoriesReport()}
          {reportData.type === 'warehouses' && renderWarehousesReport()}
        </>
      ) : null}
    </div>
  );
}

export default Reports;
