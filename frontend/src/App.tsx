import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';

// Admin Pages
import GenerosPage from './pages/admin/GenerosPage';
import FilmesPage from './pages/admin/FilmesPage';
import SalasPage from './pages/admin/SalasPage';
import SessoesPage from './pages/admin/SessoesPage';
import LanchesPage from './pages/admin/LanchesPage';

// User Pages
import PDVPage from './pages/user/PDVPage';
import PedidosPage from './pages/user/PedidosPage';

const AdminDashboard = () => (
  <div className="flex flex-col h-full bg-zinc-900 border border-zinc-800 rounded-2xl p-8 justify-center items-center text-center">
    <h1 className="text-3xl font-bold text-indigo-400 mb-2">Painel Administrativo</h1>
    <p className="text-zinc-500 max-w-lg">
      Bem-vindo ao sistema de controle do Cinema. Selecione uma opção no menu lateral para iniciar o gerenciamento de sessões, filmes e vendas.
    </p>
  </div>
);

const ProtectedRoute = ({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'ADMIN' | 'USER' }) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center bg-zinc-950 text-indigo-500 text-xl font-medium">Carregando CineWeb...</div>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (requiredRole && user?.role !== requiredRole) return <Navigate to={user?.role === 'ADMIN' ? '/admin' : '/app'} replace />;
  return <>{children}</>;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ADMIN ROUTES */}
      <Route path="/admin" element={<ProtectedRoute requiredRole="ADMIN"><Layout /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="generos" element={<GenerosPage />} />
        <Route path="filmes" element={<FilmesPage />} />
        <Route path="salas" element={<SalasPage />} />
        <Route path="sessoes" element={<SessoesPage />} />
        <Route path="lanches" element={<LanchesPage />} />
      </Route>

      {/* USER ROUTES (PDV / Tickets) */}
      <Route path="/app" element={<ProtectedRoute requiredRole="USER"><Layout /></ProtectedRoute>}>
        <Route index element={<PDVPage />} />
        <Route path="pedidos" element={<PedidosPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
