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
  const [chartType, setChartType] = useState<'barras' | 'pastel' | 'tendencia'>('pastel');
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

  // Helper for Pie Chart (conic-gradient)
  const colors = ['#8fc63d', '#1b1c1c', '#009ee3', '#ff9800'];
  let currentAngle = 0;
  const conicGradient = Object.entries(methodTotals).map(([_, total], i) => {
    const percentage = totalMethods > 0 ? (total / totalMethods) * 100 : 0;
    const start = currentAngle;
    const end = currentAngle + percentage;
    currentAngle = end;
    return `${colors[i]} ${start}% ${end}%`;
  }).join(', ');
  
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

              {/* Medios de Pago y Gráficos */}
              <div className="bg-white p-5 rounded-xl shadow-sm border border-[#e0e3d8]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-sm">Distribución por Medio de Pago</h3>
                  <div className="flex bg-[#f6f3f2] p-1 rounded-lg">
                    <button onClick={() => setChartType('barras')} className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${chartType === 'barras' ? 'bg-white shadow-sm text-[#1b1c1c]' : 'text-[#737a66]'}`}>Barras</button>
                    <button onClick={() => setChartType('pastel')} className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${chartType === 'pastel' ? 'bg-white shadow-sm text-[#1b1c1c]' : 'text-[#737a66]'}`}>Pastel</button>
                    <button onClick={() => setChartType('tendencia')} className={`px-2 py-1 text-xs font-bold rounded-md transition-colors ${chartType === 'tendencia' ? 'bg-white shadow-sm text-[#1b1c1c]' : 'text-[#737a66]'}`}>Evolución</button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {Object.entries(methodTotals).map(([method, total], i) => (
                    <div key={method} className="flex justify-between items-center p-2 rounded bg-[#f6f3f2] border-l-4" style={{ borderColor: colors[i] }}>
                      <span className="text-xs font-semibold">{method}</span>
                      <span className="text-sm font-bold text-[#1b1c1c]">${total.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 flex justify-center items-end h-40 w-full relative bg-[#fbf9f8] rounded-xl border border-[#e5e1db] p-4 overflow-hidden">
                  {totalMethods === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-[#a6a9a3]">Sin datos para mostrar</div>
                  ) : chartType === 'barras' ? (
                    <div className="flex items-end justify-around w-full h-full gap-4">
                      {Object.entries(methodTotals).map(([method, total], i) => {
                        const max = Math.max(...Object.values(methodTotals), 1);
                        return (
                          <div key={method} className="flex flex-col items-center flex-1 h-full justify-end group relative">
                            <div className="opacity-0 group-hover:opacity-100 absolute -top-6 bg-[#1b1c1c] text-white text-[10px] py-1 px-2 rounded font-bold transition-opacity whitespace-nowrap z-10">
                              {((total / totalMethods) * 100).toFixed(1)}%
                            </div>
                            <div className="w-full max-w-[40px] rounded-t-sm transition-all duration-500 hover:opacity-80" style={{ height: `${(total / max) * 100}%`, backgroundColor: colors[i] }} />
                          </div>
                        );
                      })}
                    </div>
                  ) : chartType === 'pastel' ? (
                    <div className="relative w-32 h-32 rounded-full shadow-inner animate-in zoom-in duration-500" style={{ background: `conic-gradient(${conicGradient})` }}>
                      <div className="absolute inset-2 bg-[#fbf9f8] rounded-full flex items-center justify-center">
                        <span className="text-xs font-bold text-[#1b1c1c]">Total<br/>${totalMethods.toLocaleString()}</span>
                      </div>
                    </div>
                  ) : (
                    <svg className="w-full h-full overflow-visible animate-in fade-in" viewBox="0 0 100 100" preserveAspectRatio="none">
                      <path d={`M 0,100 ${Object.values(methodTotals).map((val, i) => {
                        const x = (i / (Object.keys(methodTotals).length - 1)) * 100;
                        const max = Math.max(...Object.values(methodTotals), 1);
                        const y = 100 - ((val / max) * 90);
                        return `L ${x},${y}`;
                      }).join(' ')} L 100,100 Z`} fill="#8fc63d" opacity="0.2" />
                      
                      <polyline points={Object.values(methodTotals).map((val, i) => {
                        const x = (i / (Object.keys(methodTotals).length - 1)) * 100;
                        const max = Math.max(...Object.values(methodTotals), 1);
                        const y = 100 - ((val / max) * 90);
                        return `${x},${y}`;
                      }).join(' ')} fill="none" stroke="#436900" strokeWidth="2" />
                      
                      {Object.values(methodTotals).map((val, i) => {
                        const x = (i / (Object.keys(methodTotals).length - 1)) * 100;
                        const max = Math.max(...Object.values(methodTotals), 1);
                        const y = 100 - ((val / max) * 90);
                        return <circle key={i} cx={x} cy={y} r="3" fill="#1b1c1c" className="hover:r-5 transition-all" />;
                      })}
                    </svg>
                  )}
                </div>
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
