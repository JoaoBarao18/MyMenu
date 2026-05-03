// components/ProfileDropdown.tsx
import React, { useState, useRef, useEffect } from 'react';
import { UserCircle, Heart, User, LogOut, Info } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../supabaseClient';
import { toast } from 'sonner';

const ProfileDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Fecha o dropdown se clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error('Erro ao terminar sessão: ' + error.message);
    } else {
      toast.success('Sessão terminada!');
      navigate('/login'); // Redireciona para o login
    }
  };

  const menuItems = [
    { label: 'Perfil', icon: User, action: () => navigate('/profile') },
    { label: 'Favoritos', icon: Heart, action: () => navigate('/favoritos') },
    { label: 'Sobre o App', icon: Info, action: () => navigate('/sobre') },
    { label: 'Sair', icon: LogOut, action: handleLogout, className: 'text-red-600' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botão do Ícone de Perfil */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="size-14 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95"
      >
        <UserCircle className="size-12 text-[#4c1f03] opacity-80" strokeWidth={1} />
      </button>

      {/* Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-56 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 p-2 overflow-hidden">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={index}
                onClick={() => {
                  item.action();
                  setIsOpen(false); // Fecha o menu ao clicar
                }}
                className={`
                  w-full flex items-center gap-4 px-4 py-3 rounded-lg 
                  font-['Quicksand',sans-serif] text-lg text-[#4c1f03] 
                  hover:bg-[#fffbed] transition-colors
                  ${item.className || ''}
                `}
              >
                <Icon className="size-5" />
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;