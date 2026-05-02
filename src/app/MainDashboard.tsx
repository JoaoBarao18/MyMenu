import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient'; // Ajusta o caminho se necessário
import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const MainDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Buscar os dados do utilizador atual
    const getUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUserData();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.info("Sessão terminada");
    navigate('/login');
  };

  if (!user) return <div className="p-8">A carregar...</div>;

  return (
    <div className="min-h-screen bg-[#fffcf5] p-6 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-[#eee8d5]">
        <div>
          <h1 className="text-2xl font-bold text-[#4c1f03]">MyMenu Dashboard</h1>
          <p className="text-gray-500 text-sm">Bem-vindo de volta!</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-xl hover:bg-red-100 transition-colors"
        >
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card de Perfil */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-[#eee8d5]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <User size={20} className="text-[#4c1f03]" /> 
            Informações da Conta
          </h2>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-[#fffcf5] rounded-xl">
              <Mail className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Email</p>
                <p className="text-[#4c1f03] font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-[#fffcf5] rounded-xl">
              <Calendar className="text-gray-400" size={18} />
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Membro desde</p>
                <p className="text-[#4c1f03] font-medium">
                  {new Date(user.created_at).toLocaleDateString('pt-PT')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Card de Boas-vindas */}
        <div className="bg-[#4c1f03] p-6 rounded-3xl shadow-lg text-white flex flex-col justify-center">
          <h3 className="text-xl font-bold mb-2">Olá, {user.user_metadata?.full_name || 'Utilizador'}!</h3>
          <p className="text-orange-100 opacity-80">
            O teu sistema de autenticação está a funcionar perfeitamente com o Supabase. 
            Pronto para começar a criar receitas?
          </p>
          <button className="mt-6 bg-white text-[#4c1f03] font-bold py-3 rounded-2xl hover:bg-orange-50 transition-transform active:scale-95">
            + Nova Receita
          </button>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;