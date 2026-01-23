import { useState, useEffect } from 'react';
import { productService, categoryService } from '../services';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    description: '',
    price: '',
    cost: '',
    categoryId: '',
    quantityInStock: '',
    reorderLevel: '',
    supplier: '',
    status: 'active'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        productService.getAll({ limit: 1000, status: 'all' }),
        categoryService.getAll({ limit: 1000 })
      ]);
      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = {
        ...formData,
        price: parseFloat(formData.price),
        cost: parseFloat(formData.cost),
        categoryId: parseInt(formData.categoryId),
        quantityInStock: parseInt(formData.quantityInStock),
        reorderLevel: parseInt(formData.reorderLevel)
      };

      if (editingProduct) {
        await productService.update(editingProduct.id, data);
      } else {
        await productService.create(data);
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar producto');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      description: product.description || '',
      price: product.price,
      cost: product.cost,
      categoryId: product.categoryId,
      quantityInStock: product.quantityInStock,
      reorderLevel: product.reorderLevel,
      supplier: product.supplier || '',
      status: product.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await productService.delete(id);
        loadData();
      } catch (err) {
        setError('Error al eliminar producto');
      }
    }
  };

  const handleToggleActive = async (product) => {
    try {
      // Limpiar valores numéricos si vienen como strings con formato
      const cleanPrice = typeof product.price === 'string' 
        ? parseFloat(product.price.replace(/[^0-9.-]/g, '')) 
        : parseFloat(product.price);
      
      const cleanCost = typeof product.cost === 'string' 
        ? parseFloat(product.cost.replace(/[^0-9.-]/g, '')) 
        : parseFloat(product.cost);

      const newStatus = product.status === 'active' ? 'inactive' : 'active';

      await productService.update(product.id, {
        name: product.name,
        sku: product.sku,
        description: product.description,
        price: cleanPrice,
        cost: cleanCost,
        categoryId: product.categoryId,
        warehouseId: product.warehouseId,
        quantityInStock: product.quantityInStock,
        reorderLevel: product.reorderLevel,
        supplier: product.supplier || '',
        status: newStatus
      });
      
      // Actualizar el estado local inmediatamente para feedback visual instantáneo
      setProducts(prevProducts => 
        prevProducts.map(p => 
          p.id === product.id ? { ...p, status: newStatus } : p
        )
      );
      
      // Luego recargar desde el servidor para confirmar
      setTimeout(() => loadData(), 300);
    } catch (err) {
      console.error('Error al cambiar estado:', err);
      setError(err.response?.data?.error || 'Error al cambiar estado del producto');
      loadData(); // Recargar en caso de error
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      description: '',
      price: '',
      cost: '',
      categoryId: '',
      quantityInStock: '',
      reorderLevel: '',
      supplier: '',
      status: 'active'
    });
    setError('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📦 Productos</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nuevo Producto
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>SKU</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio Unitario</th>
                <th>Costo Unitario</th>
                <th>Stock Disponible</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>{product.category?.name || '-'}</td>
                  <td>${parseFloat(product.price).toLocaleString()} COP</td>
                  <td>${product.cost ? parseFloat(product.cost).toLocaleString() : '-'} {product.cost ? 'COP' : ''}</td>
                  <td>
                    <span className={product.quantityInStock <= product.reorderLevel ? 'text-danger' : ''}>
                      {product.quantityInStock}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`badge ${product.status === 'active' ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(product)}
                      style={{ cursor: 'pointer' }}
                      title="Clic para cambiar estado"
                    >
                      {product.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(product)} className="btn btn-sm btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="btn btn-sm btn-danger">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="empty-state">No hay productos registrados</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>SKU *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nombre *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Categoría *</label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    required
                  >
                    <option value="">Seleccione...</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Precio *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Costo *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Stock Inicial *</label>
                  <input
                    type="number"
                    value={formData.quantityInStock}
                    onChange={(e) => setFormData({ ...formData, quantityInStock: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Nivel de Reorden *</label>
                  <input
                    type="number"
                    value={formData.reorderLevel}
                    onChange={(e) => setFormData({ ...formData, reorderLevel: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Proveedor</label>
                  <input
                    type="text"
                    value={formData.supplier}
                    onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Estado *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingProduct ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
