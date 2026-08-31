import React, { useState } from 'react';
import { CatalogItem } from '../../types';

interface CatalogManagerProps {
  catalog: CatalogItem[];
  setCatalog: (catalog: CatalogItem[]) => void;
  onClose: () => void;
}

export const CatalogManager: React.FC<CatalogManagerProps> = ({
  catalog,
  setCatalog,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'servicio' | 'medicacion'>('servicio');
  const [editingItem, setEditingItem] = useState<CatalogItem | null>(null);

  const filteredCatalog = catalog.filter((c) => c.type === activeTab);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      if (editingItem.id) {
        // Edit existing
        setCatalog(catalog.map((c) => (c.id === editingItem.id ? editingItem : c)));
      } else {
        // Add new
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

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex justify-between items-center px-6 py-4 border-b border-[#e5e1db]">
          <h2 className="text-xl font-display font-medium text-[#1b1c1c] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#436900]">inventory_2</span>
            Administración de Catálogo
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-[#fbf9f8] rounded-full transition-colors"
          >
            <span className="material-symbols-outlined text-[#6c7068]">close</span>
          </button>
        </div>

        <div className="flex border-b border-[#c3c9b3]/30 px-4 pt-2">
          <button
            onClick={() => setActiveTab('servicio')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'servicio'
                ? 'border-[#436900] text-[#436900]'
                : 'border-transparent text-[#737a66] hover:text-[#434938]'
            }`}
          >
            Servicios
          </button>
          <button
            onClick={() => setActiveTab('medicacion')}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'medicacion'
                ? 'border-[#436900] text-[#436900]'
                : 'border-transparent text-[#737a66] hover:text-[#434938]'
            }`}
          >
            Medicación y Accesorios
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 bg-[#fbf9f8]">
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
      </div>
    </div>
  );
};
