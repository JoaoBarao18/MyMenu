import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // Ajusta o caminho se necessário
import { LogOut, User, Mail, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import NavSup from './components/navbar/nav-sup.component';
import NavInf from './components/navbar/nav-inf.component';

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
    <div>
      <NavSup>
        
      </NavSup>
      <NavInf></NavInf>
    </div>
  );
};

export default MainDashboard;