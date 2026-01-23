import { useState, useEffect } from 'react';
import { categoryService, productService } from '../services';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '', isActive: true });
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAll();
      setCategories(response.data);
    } catch (err) {
      setError('Error al cargar categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingCategory) {
        await categoryService.update(editingCategory.id, formData);
      } else {
        await categoryService.create(formData);
      }
      setShowModal(false);
      setFormData({ name: '', description: '', isActive: true });
      setEditingCategory(null);
      loadCategories();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar categoría');
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, description: category.description || '', isActive: category.isActive });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta categoría?')) {
      try {
        await categoryService.delete(id);
        loadCategories();
      } catch (err) {
        setError('Error al eliminar categoría');
      }
    }
  };

  const handleToggleActive = async (category) => {
    try {
      await categoryService.update(category.id, {
        name: category.name,
        description: category.description,
        isActive: !category.isActive
      });
      loadCategories();
    } catch (err) {
      setError('Error al cambiar estado de categoría');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setFormData({ name: '', description: '', isActive: true });
    setError('');
  };

  const handleViewProducts = async (category) => {
    setSelectedCategory(category);
    setShowProductsModal(true);
    setLoadingProducts(true);
    try {
      const response = await productService.getAll({ categoryId: category.id, limit: 1000, status: 'all' });
      setCategoryProducts(response.data);
    } catch (err) {
      setError('Error al cargar productos de la categoría');
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setSelectedCategory(null);
    setCategoryProducts([]);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📂 Categorías</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nueva Categoría
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Productos</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>
                    <span 
                      onClick={() => handleViewProducts(category)}
                      style={{ cursor: 'pointer', color: 'var(--primary)', fontWeight: '600' }}
                      title="Ver productos"
                    >
                      {category.name}
                    </span>
                  </td>
                  <td>{category.description || '-'}</td>
                  <td>
                    <span 
                      onClick={() => handleViewProducts(category)}
                      style={{ cursor: 'pointer', color: 'var(--primary)' }}
                      title="Ver productos"
                    >
                      {category._count?.products || 0}
                    </span>
                  </td>
                  <td>
                    <span 
                      className={`badge ${category.isActive ? 'active' : 'inactive'}`}
                      onClick={() => handleToggleActive(category)}
                      style={{ cursor: 'pointer' }}
                      title="Clic para cambiar estado"
                    >
                      {category.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(category)} className="btn btn-sm btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(category.id)} className="btn btn-sm btn-danger">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {categories.length === 0 && (
            <div className="empty-state">No hay categorías registradas</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCategory ? 'Editar Categoría' : 'Nueva Categoría'}</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
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
                  {editingCategory ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductsModal && (
        <div className="modal-overlay" onClick={handleCloseProductsModal}>
          <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>📦 Productos de "{selectedCategory?.name}"</h2>
              <button onClick={handleCloseProductsModal} className="btn-close">×</button>
            </div>

            <div style={{ padding: '24px' }}>
              {loadingProducts ? (
                <div className="loading">Cargando productos...</div>
              ) : categoryProducts.length > 0 ? (
                <div className="table-container" style={{ maxHeight: '500px' }}>
                  <table>
                    <thead>
                      <tr>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Precio Unitario</th>
                        <th>Costo Unitario</th>
                        <th>Stock</th>
                        <th>Bodega</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categoryProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.sku}</td>
                          <td>{product.name}</td>
                          <td>${parseFloat(product.price).toLocaleString()} COP</td>
                          <td>${parseFloat(product.cost).toLocaleString()} COP</td>
                          <td>{product.quantityInStock}</td>
                          <td>{product.warehouse?.name || '-'}</td>
                          <td>
                            <span className={`badge ${product.status === 'active' ? 'active' : 'inactive'}`}>
                              {product.status === 'active' ? 'Activo' : 'Inactivo'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="empty-state">No hay productos en esta categoría</div>
              )}

              <div className="modal-footer">
                <button onClick={handleCloseProductsModal} className="btn btn-secondary">
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
