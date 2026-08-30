import React, { useState } from 'react';
import { X, Mail, Lock, User, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: ''
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error en la autenticación');
      
      localStorage.setItem('pets_token', data.token);
      localStorage.setItem('pets_user', JSON.stringify(data.user));
      onSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1b1c1c]/40 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-[#e5e1db] animate-in fade-in zoom-in duration-300">
        <div className="px-6 py-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-display font-medium text-[#1b1c1c]">
              {isLogin ? 'Bienvenido de vuelta' : 'Crear tu cuenta'}
            </h2>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-[#fbf9f8] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[#6c7068]" />
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-[#1b1c1c] mb-1">Nombre Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-[#a4a9a0]" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-10 pr-3 py-3 border border-[#e5e1db] rounded-2xl bg-[#fbf9f8] focus:ring-2 focus:ring-[#c7f173] focus:border-[#c7f173] outline-none transition-all"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
              </div>
            )}

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#1b1c1c] mb-1">Domicilio</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#a4a9a0] text-xl">home</span>
                    </div>
                    <input
                      type="text"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-[#e5e1db] rounded-2xl bg-[#fbf9f8] focus:ring-2 focus:ring-[#c7f173] focus:border-[#c7f173] outline-none transition-all"
                      placeholder="Av. Principal 123"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#1b1c1c] mb-1">Teléfono</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="material-symbols-outlined text-[#a4a9a0] text-xl">phone</span>
                    </div>
                    <input
                      type="tel"
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-[#e5e1db] rounded-2xl bg-[#fbf9f8] focus:ring-2 focus:ring-[#c7f173] focus:border-[#c7f173] outline-none transition-all"
                      placeholder="+54 11 1234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-[#1b1c1c] mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#a4a9a0]" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[#e5e1db] rounded-2xl bg-[#fbf9f8] focus:ring-2 focus:ring-[#c7f173] focus:border-[#c7f173] outline-none transition-all"
                  placeholder="juan@ejemplo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#1b1c1c] mb-1">Contraseña</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#a4a9a0]" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-[#e5e1db] rounded-2xl bg-[#fbf9f8] focus:ring-2 focus:ring-[#c7f173] focus:border-[#c7f173] outline-none transition-all"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-4 bg-[#1b1c1c] text-white rounded-2xl font-medium hover:bg-[#343534] transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <span>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6c7068]">
            {isLogin ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button 
              type="button"
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-[#1b1c1c] font-medium hover:underline"
            >
              {isLogin ? 'Regístrate aquí' : 'Inicia sesión'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
