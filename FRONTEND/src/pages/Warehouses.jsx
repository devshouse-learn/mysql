import { useState, useEffect } from 'react';
import { warehouseService, productService } from '../services';

function Warehouses() {
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProductsModal, setShowProductsModal] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [warehouseProducts, setWarehouseProducts] = useState([]);
  const [editingWarehouse, setEditingWarehouse] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    description: '',
    capacity: ''
  });

  useEffect(() => {
    loadWarehouses();
  }, []);

  const loadWarehouses = async () => {
    setLoading(true);
    try {
      const response = await warehouseService.getAll();
      setWarehouses(response.data);
    } catch (err) {
      setError('Error al cargar bodegas');
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
        capacity: formData.capacity ? parseInt(formData.capacity) : null
      };

      if (editingWarehouse) {
        await warehouseService.update(editingWarehouse.id, data);
      } else {
        await warehouseService.create(data);
      }
      handleCloseModal();
      loadWarehouses();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar bodega');
    }
  };

  const handleEdit = (warehouse) => {
    setEditingWarehouse(warehouse);
    setFormData({
      name: warehouse.name,
      location: warehouse.location || '',
      description: warehouse.description || '',
      capacity: warehouse.capacity || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta bodega?')) {
      try {
        await warehouseService.delete(id);
        loadWarehouses();
      } catch (err) {
        setError('Error al eliminar bodega');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingWarehouse(null);
    setFormData({
      name: '',
      location: '',
      description: '',
      capacity: ''
    });
    setError('');
  };

  const handleViewProducts = async (warehouse) => {
    setSelectedWarehouse(warehouse);
    setShowProductsModal(true);
    try {
      const response = await productService.getAll();
      const productsInWarehouse = response.data.filter(p => p.warehouseId === warehouse.id);
      setWarehouseProducts(productsInWarehouse);
    } catch (err) {
      setError('Error al cargar productos de la bodega');
      setWarehouseProducts([]);
    }
  };

  const handleCloseProductsModal = () => {
    setShowProductsModal(false);
    setSelectedWarehouse(null);
    setWarehouseProducts([]);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>🏪 Bodegas</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nueva Bodega
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
                <th>Ubicación</th>
                <th>Capacidad</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {warehouses.map((warehouse) => (
                <tr key={warehouse.id}>
                  <td>{warehouse.id}</td>
                  <td>{warehouse.name}</td>
                  <td>{warehouse.location || '-'}</td>
                  <td>{warehouse.capacity || '-'}</td>
                  <td>
                    <span className={`badge ${warehouse.isActive ? 'active' : 'inactive'}`}>
                      {warehouse.isActive ? 'Activa' : 'Inactiva'}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleViewProducts(warehouse)} className="btn btn-sm btn-info" style={{marginRight: '5px'}}>
                      📦 Ver Productos
                    </button>
                    <button onClick={() => handleEdit(warehouse)} className="btn btn-sm btn-edit">
                      Editar
                    </button>
                    <button onClick={() => handleDelete(warehouse.id)} className="btn btn-sm btn-danger">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {warehouses.length === 0 && (
            <div className="empty-state">No hay bodegas registradas</div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingWarehouse ? 'Editar Bodega' : 'Nueva Bodega'}</h2>
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
                <label>Ubicación</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Capacidad</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
                  {editingWarehouse ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showProductsModal && selectedWarehouse && (
        <div className="modal-overlay" onClick={handleCloseProductsModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()} style={{maxWidth: '800px'}}>
            <div className="modal-header">
              <h2>📦 Productos en {selectedWarehouse.name}</h2>
              <button onClick={handleCloseProductsModal} className="btn-close">×</button>
            </div>

            <div style={{padding: '20px'}}>
              <p style={{marginBottom: '15px', color: '#666'}}>
                Total de productos: <strong>{warehouseProducts.length}</strong>
              </p>

              {warehouseProducts.length > 0 ? (
                <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                  <table style={{width: '100%'}}>
                    <thead style={{position: 'sticky', top: 0, backgroundColor: '#f8f9fa'}}>
                      <tr>
                        <th>SKU</th>
                        <th>Nombre</th>
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {warehouseProducts.map((product) => (
                        <tr key={product.id}>
                          <td>{product.sku}</td>
                          <td>{product.name}</td>
                          <td>
                            <span style={{
                              color: product.quantityInStock <= product.reorderLevel ? 'red' : 'green',
                              fontWeight: 'bold'
                            }}>
                              {product.quantityInStock}
                            </span>
                          </td>
                          <td>${parseFloat(product.price).toLocaleString()} COP</td>
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
                <div className="empty-state" style={{margin: '40px 0'}}>
                  No hay productos en esta bodega
                </div>
              )}

              <div className="modal-footer" style={{marginTop: '20px'}}>
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

export default Warehouses;
