import React, { useState } from 'react';
import { CatalogItem, Invoice } from '../../types';

interface CatalogManagerProps {
  catalog: CatalogItem[];
  setCatalog: (catalog: CatalogItem[]) => void;
  invoices?: Invoice[];
  onClose: () => void;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({
  catalog,
  setCatalog,
  invoices = [],
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'servicio' | 'medicacion' | 'facturacion'>('facturacion');
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const filteredCatalog = catalog.filter((c) => c.type === activeTab);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (editingItem.id) {
        setCatalog(catalog.map((c) => (c.id === editingItem.id ? editingItem : c)));
      } else {
        const newItem = { ...editingItem, id: `cat-${Date.now()}` };
        setCatalog([...catalog, newItem]);
      }
      setEditingItem(null);
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este ítem del catálogo?')) {
      setCatalog(catalog.filter((c) => c.id !== id));
    }
  };

  // --- Facturación Logic ---
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let dailyTotal = 0;
  let monthlyTotal = 0;
  let yearlyTotal = 0;

  const methodTotals = {
    'Efectivo': 0,
    'T. Débito': 0,
    'T. Crédito': 0,
    'Mercado Pago': 0
  };

  const monthlyData = new Array(12).fill(0);
  const dailyData = new Array(7).fill(0); // Last 7 days

  invoices.forEach(inv => {
    dailyTotal += inv.total;
    monthlyTotal += inv.total;
    yearlyTotal += inv.total;

    if (methodTotals[inv.paymentMethod as keyof typeof methodTotals] !== undefined) {
      methodTotals[inv.paymentMethod as keyof typeof methodTotals] += inv.total;
    }

    monthlyData[currentMonth] += inv.total;
    dailyData[6] += inv.total; // today
  });

  const totalMethods = Object.values(methodTotals).reduce((a, b) => a + b, 0);
  
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e5e1db]">
          <h2 className="text-xl font-display font-medium text-[#1b1c1c] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#436900]">bar_chart</span>
            Administración y Reportes
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#fbf9f8] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[#6c7068]">close</span>
          </button>
        </div>

        <div className="flex overflow-x-auto border-b border-[#c3c9b3]/30 px-4 pt-2 hide-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('facturacion')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'facturacion'
                ? 'border-[#436900] text-[#436900]'
                : 'border-transparent text-[#737a66] hover:text-[#434938]'
            }`}
          >
            Facturación
          </button>
          <button
            onClick={() => setActiveTab('servicio')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'servicio'
                ? 'border-[#436900] text-[#436900]'
                : 'border-transparent text-[#737a66] hover:text-[#434938]'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('medicacion')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'medicacion'
                ? 'border-[#436900] text-[#436900]'
                : 'border-transparent text-[#737a66] hover:text-[#434938]'
            }`}
          >
            Medicación y Accesorios
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#fbf9f8]">
          
          {activeTab === 'facturacion' ? (
            <div className="space-y-6 animate-in fade-in">
              {/* Resumen Numerico */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e3d8]">
                  <p className="text-[10px] text-[#737a66] uppercase font-bold tracking-wider mb-1">Hoy</p>
                  <p className="text-xl font-bold text-[#436900]">${dailyTotal.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e3d8]">
                  <p className="text-[10px] text-[#737a66] uppercase font-bold tracking-wider mb-1">Este Mes</p>
                  <p className="text-xl font-bold text-[#1b1c1c]">${monthlyTotal.toLocaleString()}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-[#e0e3d8]">
                  <p className="text-[10px] text-[#737a66] uppercase font-bold tracking-wider mb-1">Este Año</p>
                  <p className="text-xl font-bold text-[#1b1c1c]">${yearlyTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Medios de Pago */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e0e3d8]">
                <h3 className="font-bold text-sm mb-4">Ingresos por Medio de Pago (Global)</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(methodTotals).map(([method, total]) => (
                    <div key={method} className="flex justify-between items-center p-2 rounded bg-[#f6f3f2]">
                      <span className="text-xs font-semibold">{method}</span>
                      <span className="text-sm font-bold text-[#436900]">${total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                {/* Visual Bar for Payment Methods */}
                {totalMethods > 0 && (
                  <div className="mt-4 flex h-3 rounded-full overflow-hidden w-full bg-gray-100">
                    {Object.entries(methodTotals).map(([method, total], i) => {
                      const colors = ['bg-[#8fc63d]', 'bg-[#1b1c1c]', 'bg-[#009ee3]', 'bg-[#ff9800]'];
                      return total > 0 ? (
                        <div key={method} style={{ width: `${(total / totalMethods) * 100}%` }} className={colors[i]} title={`${method}: $${total}`} />
                      ) : null;
                    })}
                  </div>
                )}
              </div>

              {/* Graficos CSS */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e0e3d8]">
                <h3 className="font-bold text-sm mb-6">Evolución de Ingresos (Últimos 7 días)</h3>
                <div className="flex items-end justify-between h-32 gap-2 mt-4 px-2">
                  {dailyData.map((val, i) => {
                    const max = Math.max(...dailyData, 1000);
                    const height = `${(val / max) * 100}%`;
                    return (
                      <div key={i} className="flex flex-col items-center flex-1 gap-2 group">
                        <div className="w-full bg-[#f0eded] rounded-t-sm relative h-full flex items-end">
                          <div 
                            className="w-full bg-[#8fc63d] rounded-t-sm transition-all duration-500 group-hover:bg-[#436900]"
                            style={{ height }}
                          />
                          <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1b1c1c] text-white text-[10px] py-1 px-2 rounded font-bold whitespace-nowrap pointer-events-none transition-opacity">
                            ${val.toLocaleString()}
                          </div>
                        </div>
                        <span className="text-[9px] text-[#737a66] font-semibold">{i === 6 ? 'Hoy' : `D-${6-i}`}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            <div className="animate-in fade-in">
              <button
                onClick={() => setEditingItem({ id: '', name: '', type: activeTab, price: 0 })}
                className="w-full mb-6 bg-[#8fc63d] hover:bg-[#9fd74d] text-[#111f00] font-bold text-sm px-4 py-3 rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-lg">add</span>
                Nuevo {activeTab === 'servicio' ? 'Servicio' : 'Medicamento'}
              </button>

              {editingItem && (
                <form onSubmit={handleSave} className="bg-white p-4 rounded-xl border border-[#c3c9b3] mb-6 shadow-sm">
                  <h3 className="font-bold text-sm mb-3">
                    {editingItem.id ? 'Editar' : 'Agregar'} {activeTab === 'servicio' ? 'Servicio' : 'Medicamento'}
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#434938] mb-1">Nombre</label>
                      <input
                        type="text"
                        required
                        value={editingItem.name}
                        onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                        className="w-full p-2 text-sm border rounded-lg outline-none focus:border-[#436900]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#434938] mb-1">Precio ($)</label>
                      <input
                        type="number"
                        required
                        min="0"
                        value={editingItem.price}
                        onChange={(e) => setEditingItem({ ...editingItem, price: Number(e.target.value) })}
                        className="w-full p-2 text-sm border rounded-lg outline-none focus:border-[#436900]"
                      />
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setEditingItem(null)}
                        className="flex-1 px-4 py-2 text-xs font-bold border border-[#c3c9b3] rounded-lg hover:bg-gray-50"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="flex-1 px-4 py-2 text-xs font-bold bg-[#c7f173] text-[#324f00] rounded-lg hover:bg-[#aedf4d]"
                      >
                        Guardar
                      </button>
                    </div>
                  </div>
                </form>
              )}

              <div className="space-y-2">
                {filteredCatalog.map((item) => (
                  <div key={item.id} className="bg-white p-3 rounded-lg border border-[#e0e3d8] flex justify-between items-center shadow-xs">
                    <div>
                      <p className="font-bold text-sm text-[#1b1c1c]">{item.name}</p>
                      <p className="text-xs text-[#436900] font-semibold">${item.price.toLocaleString()}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingItem(item)}
                        className="p-1.5 text-[#434938] hover:bg-[#f0eded] rounded-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">edit</span>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-1.5 text-[#ba1a1a] hover:bg-[#ffdad6] rounded-md transition-colors"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
