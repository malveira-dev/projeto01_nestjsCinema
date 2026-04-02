import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import api from '../api/axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/auth/login', { email, senha });
      login(data.access_token, data.user);
      toast.success('Login realizado com sucesso!');
      if (data.user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate('/app');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erro ao efetuar login');
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-zinc-900 text-zinc-100 font-sans">
      <div className="w-full max-w-md p-8 bg-zinc-800 rounded-xl shadow-2xl border border-zinc-700">
        <h1 className="text-3xl font-bold text-center text-indigo-400 mb-6">CineWeb</h1>
        <h2 className="text-xl font-medium text-center text-zinc-300 mb-8">Faça login na sua conta</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">E-mail</label>
            <input
              type="email"
              required
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-400 mb-1">Senha</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-colors"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition-all duration-200 transform hover:scale-[1.02]"
          >
            Entrar
          </button>
        </form>

        <p className="mt-8 text-center text-zinc-400 text-sm">
          Ainda não possui conta?{' '}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
