import { useState, useEffect } from 'react';
import { movementService, productService, warehouseService } from '../services';

function Movements() {
  const [movements, setMovements] = useState([]);
  const [products, setProducts] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    productId: '',
    warehouseId: '',
    movementType: 'entrada',
    quantity: '',
    referenceType: '',
    referenceId: '',
    notes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [movementsRes, productsRes, warehousesRes] = await Promise.all([
        movementService.getAll(),
        productService.getAll(),
        warehouseService.getAll()
      ]);
      setMovements(movementsRes.data);
      setProducts(productsRes.data);
      setWarehouses(warehousesRes.data);
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
        product_id: parseInt(formData.productId),
        warehouse_id: formData.warehouseId ? parseInt(formData.warehouseId) : null,
        movement_type: formData.movementType,
        quantity: parseInt(formData.quantity),
        reference_type: formData.referenceType || '',
        reference_id: formData.referenceId || '',
        notes: formData.notes || ''
      };

      await movementService.create(data);
      handleCloseModal();
      loadData();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear movimiento');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este movimiento?')) {
      try {
        await movementService.delete(id);
        loadData();
      } catch (err) {
        setError('Error al eliminar movimiento');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormData({
      productId: '',
      warehouseId: '',
      movementType: 'entrada',
      quantity: '',
      referenceType: '',
      referenceId: '',
      notes: ''
    });
    setError('');
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>📊 Movimientos de Inventario</h1>
        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          + Nuevo Movimiento
        </button>
      </div>

      {loading ? (
        <div className="loading">Cargando...</div>
      ) : (
        <>
          <p style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
            📊 Total de movimientos: <strong>{movements.length}</strong>
          </p>
          <div style={{ 
            maxHeight: '500px', 
            overflowY: 'scroll',
            overflowX: 'auto',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: '#fff'
          }}>
            <table style={{ width: '100%' }}>
              <thead style={{ 
                position: 'sticky', 
                top: 0, 
                backgroundColor: '#f8f9fa', 
                zIndex: 10,
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <tr>
                  <th style={{ padding: '12px' }}>Fecha</th>
                  <th style={{ padding: '12px' }}>Tipo</th>
                  <th style={{ padding: '12px' }}>Producto</th>
                  <th style={{ padding: '12px' }}>Bodega</th>
                  <th style={{ padding: '12px' }}>Cantidad</th>
                  <th style={{ padding: '12px' }}>Referencia</th>
                  <th style={{ padding: '12px' }}>Notas</th>
                  <th style={{ padding: '12px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((movement) => (
                  <tr key={movement.id}>
                    <td style={{ padding: '10px' }}>{new Date(movement.createdAt).toLocaleString()}</td>
                    <td style={{ padding: '10px' }}>
                      <span className={`badge ${movement.movementType === 'entrada' ? 'badge-success' : 'badge-danger'}`}>
                        {movement.movementType === 'entrada' ? '⬆️ Entrada' : '⬇️ Salida'}
                      </span>
                    </td>
                    <td style={{ padding: '10px' }}>{movement.product?.name || '-'}</td>
                    <td style={{ padding: '10px' }}>{movement.warehouse?.name || '-'}</td>
                    <td style={{ padding: '10px' }}>{movement.quantity}</td>
                    <td style={{ padding: '10px' }}>
                      {movement.referenceType && movement.referenceId 
                        ? `${movement.referenceType}: ${movement.referenceId}` 
                        : '-'}
                    </td>
                    <td style={{ padding: '10px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {movement.notes || '-'}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => handleDelete(movement.id)} className="btn btn-sm btn-danger">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {movements.length === 0 && (
              <div className="empty-state">No hay movimientos registrados</div>
            )}
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nuevo Movimiento</h2>
              <button onClick={handleCloseModal} className="btn-close">×</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Tipo de Movimiento *</label>
                <select
                  value={formData.movementType}
                  onChange={(e) => setFormData({ ...formData, movementType: e.target.value })}
                  required
                >
                  <option value="entrada">Entrada</option>
                  <option value="salida">Salida</option>
                </select>
              </div>

              <div className="form-group">
                <label>Producto *</label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  required
                >
                  <option value="">Seleccione...</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.name} (Stock: {product.quantityInStock})
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Bodega</label>
                <select
                  value={formData.warehouseId}
                  onChange={(e) => setFormData({ ...formData, warehouseId: e.target.value })}
                >
                  <option value="">Seleccione...</option>
                  {warehouses.map((warehouse) => (
                    <option key={warehouse.id} value={warehouse.id}>
                      {warehouse.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Cantidad *</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  min="1"
                  required
                />
              </div>

              <div className="form-group">
                <label>Tipo de Referencia</label>
                <input
                  type="text"
                  value={formData.referenceType}
                  onChange={(e) => setFormData({ ...formData, referenceType: e.target.value })}
                  placeholder="ej: orden_compra, factura"
                />
              </div>

              <div className="form-group">
                <label>ID de Referencia</label>
                <input
                  type="text"
                  value={formData.referenceId}
                  onChange={(e) => setFormData({ ...formData, referenceId: e.target.value })}
                  placeholder="ej: OC-2024-001"
                />
              </div>

              <div className="form-group">
                <label>Notas</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows="3"
                  placeholder="Información adicional sobre el movimiento"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={handleCloseModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Crear Movimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Movements;
