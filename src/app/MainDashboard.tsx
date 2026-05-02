// pages/DashboardPage.tsx
import React from 'react';
import MenuButton from './components/MenuButton/MenuButton';
import ProfileDropdown from './components/ProfileDropdown';

// Supomos que tens estas imagens na tua pasta de imports
import ReceitasImg from '/images/receitas.png'; // Ajusta o caminho conforme necessário
import IngredientesImg from '/images/ingridientes.png';
import IdeiasImg from '/images/idea.png';
import GeoguessImg from '/images/globo.png';

export default function DashboardPage() {
  const handleMenuClick = (menuLabel: string) => {
    // Lógica para navegação baseada no botão clicado
    console.log(`Navegar para: ${menuLabel}`);
    // Exemplo: navigate('/receitas');
  };

  return (
    // Fundo bege claro, padding para o ecrã mobile
    <div className="bg-[#fdfcf5] min-h-[100dvh] w-full p-6 md:p-10 relative">
      
      {/* Header com o Perfil Dropdown (Canto Superior Direito) */}
      <header className="w-full flex justify-end mb-12">
        <ProfileDropdown />
      </header>

      {/* Grid Centralizado para os Botões */}
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center">
        
        <MenuButton 
          label="Receitas" 
          imageSrc={ReceitasImg} 
          onClick={() => handleMenuClick("Receitas")}
        />

        <MenuButton 
          label="Meus ingredientes" 
          imageSrc={IngredientesImg} 
          onClick={() => handleMenuClick("Meus ingredientes")}
        />

        <MenuButton 
          label="Descobrir ideias" 
          imageSrc={IdeiasImg} 
          onClick={() => handleMenuClick("Descobrir ideias")}
        />

        {/* O Geoguess na tua imagem tem o ícone à esquerda */}
        <MenuButton 
          label="Geoguess" 
          imageSrc={GeoguessImg} 
          iconFirst={true}
          onClick={() => handleMenuClick("Geoguess")}
        />

      </main>
    </div>
  );
}