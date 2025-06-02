import React, { useState } from 'react';
import {
  Search,
  Plus,
  FileText,
  Download,
  Trash2,
  Edit3,
  Filter,
  X,
  Save,
  Calendar,
  MoreVertical
} from 'lucide-react';

interface Factura {
  id: string;
  numero: string;
  cliente: string;
  monto: number;
  fechaEmision: string;
  fechaVencimiento: string;
  estado: 'pendiente' | 'vencida';
  descripcion?: string;
}

const facturasMock: Factura[] = [
  {
    id: '1',
    numero: 'FAC-001',
    cliente: 'Empresa ABC',
    monto: 1500.00,
    fechaEmision: '2024-03-01',
    fechaVencimiento: '2024-03-31',
    estado: 'pendiente',
    descripcion: 'Servicios de consultoría'
  },
  {
    id: '2',
    numero: 'FAC-002',
    cliente: 'Corporación XYZ',
    monto: 2300.00,
    fechaEmision: '2024-02-15',
    fechaVencimiento: '2024-03-15',
    estado: 'vencida',
    descripcion: 'Desarrollo de software'
  },
];

const FacturasPendientes = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [facturas, setFacturas] = useState<Factura[]>(facturasMock);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [showActions, setShowActions] = useState<string | null>(null);
  const [newInvoice, setNewInvoice] = useState({
    numero: '',
    cliente: '',
    monto: '',
    fechaEmision: '',
    fechaVencimiento: '',
    descripcion: ''
  });
  const [filters, setFilters] = useState<{ estado: 'pendiente' | 'vencida' | 'todos' }>({ estado: 'todos' });
  const [showFilters, setShowFilters] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Factura | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingInvoice) {
      // Actualizar factura existente
      const updatedFacturas = facturas.map((factura) =>
        factura.id === editingInvoice.id ? { ...factura, ...newInvoice, monto: parseFloat(newInvoice.monto) } : factura
      );
      setFacturas(updatedFacturas);
      setEditingInvoice(null);
    } else {
      // Agregar nueva factura
      const newFactura: Factura = {
        id: String(facturas.length + 1),
        ...newInvoice,
        monto: parseFloat(newInvoice.monto),
        estado: 'pendiente'
      };
      setFacturas([...facturas, newFactura]);
    }
    setShowNewInvoiceForm(false);
    setNewInvoice({
      numero: '',
      cliente: '',
      monto: '',
      fechaEmision: '',
      fechaVencimiento: '',
      descripcion: ''
    });
  };

  const toggleActions = (id: string) => {
    setShowActions(showActions === id ? null : id);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterChange = (estado: 'pendiente' | 'vencida' | 'todos') => {
    setFilters({ estado });
    setShowFilters(false);
  };

  const handleEdit = (factura: Factura) => {
    setEditingInvoice(factura);
    setNewInvoice({
      numero: factura.numero,
      cliente: factura.cliente,
      monto: String(factura.monto),
      fechaEmision: factura.fechaEmision,
      fechaVencimiento: factura.fechaVencimiento,
      descripcion: factura.descripcion || ''
    });
    setShowNewInvoiceForm(true);
  };

  const handleDownload = (factura: Factura) => {
    // Simular descarga de factura
    const blob = new Blob([`Factura: ${factura.numero}\nCliente: ${factura.cliente}\nMonto: $${factura.monto.toFixed(2)}\nFecha Emisión: ${factura.fechaEmision}\nFecha Vencimiento: ${factura.fechaVencimiento}\nDescripción: ${factura.descripcion || ''}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Factura_${factura.numero}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: string) => {
    setFacturas(facturas.filter((factura) => factura.id !== id));
  };

  const filteredFacturas = facturas.filter((factura) => {
    if (filters.estado === 'todos') return true;
    return factura.estado === filters.estado;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-white via-blue-50 to-gray-100 py-8 px-0">
      <div className="w-full px-0 sm:px-6">
        {/* Modal para nueva factura */}
        {showNewInvoiceForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-900">
                    {editingInvoice ? 'Editar Factura' : 'Nueva Factura'}
                  </h2>
                  <button
                    onClick={() => setShowNewInvoiceForm(false)}
                    className="text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Factura
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newInvoice.numero}
                      onChange={(e) => setNewInvoice({...newInvoice, numero: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cliente
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={newInvoice.cliente}
                      onChange={(e) => setNewInvoice({...newInvoice, cliente: e.target.value})}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        required
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newInvoice.monto}
                        onChange={(e) => setNewInvoice({...newInvoice, monto: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Emisión
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newInvoice.fechaEmision}
                        onChange={(e) => setNewInvoice({...newInvoice, fechaEmision: e.target.value})}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Fecha de Vencimiento
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                      <input
                        type="date"
                        required
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        value={newInvoice.fechaVencimiento}
                        onChange={(e) => setNewInvoice({...newInvoice, fechaVencimiento: e.target.value})}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={newInvoice.descripcion}
                    onChange={(e) => setNewInvoice({...newInvoice, descripcion: e.target.value})}
                  />
                </div>

                <div className="flex justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowNewInvoiceForm(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <Save size={20} />
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent mb-2 drop-shadow">
            Facturas Pendientes
          </h1>
          <p className="text-lg text-blue-900">
            Gestiona las facturas pendientes de pago y controla el estado de tus cobros.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-blue-100">
          <div className="p-4 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-between">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Buscar facturas..."
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <div className="relative">
                  <button
                    onClick={toggleFilters}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 bg-gradient-to-r from-blue-800 to-blue-900 text-white hover:from-blue-900 hover:to-blue-950 shadow-lg hover:shadow-xl"
                  >
                    <Filter size={20} />
                    <span className="hidden sm:inline">Filtros</span>
                  </button>
                  {showFilters && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-10">
                      <button
                        onClick={() => handleFilterChange('todos')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors"
                      >
                        Todos
                      </button>
                      <button
                        onClick={() => handleFilterChange('pendiente')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-800 transition-colors"
                      >
                        Pendientes
                      </button>
                      <button
                        onClick={() => handleFilterChange('vencida')}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors"
                      >
                        Vencidas
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => setShowNewInvoiceForm(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-800 to-blue-900 text-white rounded-lg hover:from-blue-900 hover:to-blue-950 transition-all shadow-lg hover:shadow-xl"
                >
                  <Plus size={20} />
                  <span className="hidden sm:inline">Nueva Factura</span>
                </button>
              </div>
            </div>

            {/* Mobile View */}
            <div className="sm:hidden space-y-2">
              {filteredFacturas.map((factura) => (
                <div key={factura.id} className="bg-gradient-to-br from-white via-blue-50 to-blue-100 border border-blue-100 rounded-xl p-4 shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <FileText size={20} className="text-blue-400 mr-2" />
                      <span className="font-semibold text-blue-900">{factura.numero}</span>
                    </div>
                    <div className="relative">
                      <button
                        onClick={() => toggleActions(factura.id)}
                        className="p-1 hover:bg-blue-100 rounded-full"
                      >
                        <MoreVertical size={20} />
                      </button>
                      {showActions === factura.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-blue-100 py-1 z-10">
                          <button
                            onClick={() => handleEdit(factura)}
                            className="w-full px-2 py-2 text-left text-sm text-blue-600 hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit3 size={16} />
                            Editar
                          </button>
                          <button
                            onClick={() => handleDownload(factura)}
                            className="w-full px-2 py-2 text-left text-sm text-green-600 hover:bg-green-50 flex items-center gap-2"
                          >
                            <Download size={16} />
                            Descargar
                          </button>
                          <button
                            onClick={() => handleDelete(factura.id)}
                            className="w-full px-2 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 size={16} />
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-blue-700">{factura.cliente}</p>
                    <p className="text-lg font-bold text-blue-900">${factura.monto.toFixed(2)}</p>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-blue-600">Vence: {factura.fechaVencimiento}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        factura.estado === 'pendiente'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Nº Factura</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Monto</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Fecha Emisión</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Vencimiento</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-blue-700 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-blue-50">
                  {filteredFacturas.map((factura) => (
                    <tr key={factura.id} className="hover:bg-blue-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText size={20} className="text-blue-400 mr-2" />
                          <span className="font-semibold text-blue-900">{factura.numero}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-blue-700">{factura.cliente}</td>
                      <td className="px-6 py-4 whitespace-nowrap font-bold text-blue-900">
                        ${factura.monto.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{factura.fechaEmision}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{factura.fechaVencimiento}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          factura.estado === 'pendiente'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {factura.estado.charAt(0).toUpperCase() + factura.estado.slice(1)}
                        </span>
                      </td>
                      <td className="px-0 py-0 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-0.5">
                          <button
                            onClick={() => handleEdit(factura)}
                            className="text-blue-600 hover:text-blue-900 bg-blue-50 p-2 rounded-lg hover:bg-blue-100 transition-colors"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDownload(factura)}
                            className="text-green-600 hover:text-green-900 bg-green-50 p-2 rounded-lg hover:bg-green-100 transition-colors"
                          >
                            <Download size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(factura.id)}
                            className="text-red-600 hover:text-red-900 bg-red-50 p-2 rounded-lg hover:bg-red-100 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
              <div className="text-sm text-gray-700">
                Mostrando <span className="font-medium">1</span> a <span className="font-medium">{filteredFacturas.length}</span> de <span className="font-medium">{filteredFacturas.length}</span> resultados
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
                  Anterior
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition-colors">
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacturasPendientes;
