import React, { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate } from 'react-router';

const SystemLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("@TrixStock:user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Failed to parse user from local storage", e);
      }
    }
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen w-full bg-gray-50 flex flex-col font-sans">
      {/* Header Premium */}
      <header className="h-16 bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-all focus:outline-none active:scale-95"
            aria-label="Abrir Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            TrixStock
          </h1>
        </div>
        
        {/* User Profile */}
        <div className="flex items-center gap-3 relative">
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-sm font-semibold text-gray-800 leading-tight">
              {user?.username ? user.username.charAt(0).toUpperCase() + user.username.slice(1) : 'Usuário logado'}
            </span>
            <span className="text-xs text-gray-500 font-medium tracking-wide uppercase">{user?.level || 'Carregando...'}</span>
          </div>
          <button 
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md border-2 border-white hover:ring-4 hover:ring-blue-100 transition-all active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 drop-shadow-sm" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
          
          {/* Dropdown Menu */}
          {isUserMenuOpen && (
            <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button
                onClick={() => {
                  localStorage.removeItem("@TrixStock:user");
                  localStorage.removeItem("@TrixStock:token");
                  setUser(null);
                  navigate('/');
                }}
                className="w-full text-left px-4 py-2 text-sm text-red-600 font-medium hover:bg-red-50 flex items-center gap-2 transition-colors"
                aria-label="Fazer Logoff"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-30 transition-opacity duration-300 ${
          isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={closeSidebar}
      ></div>

      {/* Sidebar (Drawer) */}
      <aside 
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-40 transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col border-r border-gray-100 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-800">Navegação</h2>
          <button 
            onClick={closeSidebar}
            className="p-2 rounded-full hover:bg-gray-200 text-gray-500 transition-colors active:scale-90"
            aria-label="Fechar Menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <nav className="flex-1 overflow-y-auto py-6 px-4 flex flex-col gap-2">
          {['operacional', 'gestão'].includes(user?.level) && (
            <Link 
              to="/operational" 
              onClick={closeSidebar}
              className="flex items-center gap-4 px-4 py-3 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group font-medium"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <span>Tela Operacional</span>
            </Link>
          )}

          {['almoxarifado', 'gestão'].includes(user?.level) && (
            <Link 
              to="/itemregister" 
              onClick={closeSidebar}
              className="flex items-center gap-4 px-4 py-3 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group font-medium"
            >
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <span>Tela Almoxarifado</span>
            </Link>
          )}

          {user?.level === 'gestão' && (
            <Link 
              to="/purchasing" 
              onClick={closeSidebar}
              className="flex items-center gap-4 px-4 py-3 text-gray-600 rounded-xl hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 group font-medium"
            >
              <div className="p-2 bg-red-100 rounded-lg group-hover:bg-red-200 transition-colors text-red-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <span>Alerta de Estoque</span>
            </Link>
          )}
        </nav>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-center">
          <p className="text-sm text-gray-400 font-medium">TrixStock © 2026</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-50/50 relative z-10 transition-all overflow-x-hidden">
        <div className="mx-auto h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default SystemLayout;