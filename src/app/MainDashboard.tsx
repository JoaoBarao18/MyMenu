import React from 'react';
import { useNavigate } from 'react-router-dom';
import MenuButton from './components/MenuButton/MenuButton';
import ProfileDropdown from './components/ProfileDropdown';

//Imagens
import ReceitasImg from '/images/receitas.png';
import IngredientesImg from '/images/ingridientes.png';
import IdeiasImg from '/images/idea.png';
import GeoguessImg from '/images/globo.png';

export default function DashboardPage() {
  const navigate = useNavigate();

  const handleMenuClick = (menuLabel: string) => {
    if (menuLabel === "Receitas") {
      navigate("/receitas");
      return;
    }

    if (menuLabel === "Meus ingredientes") {
      navigate("/ingredientes"); // Assume que esta também existe ou existirá
      return;
    }

    // Caso para os botões em desenvolvimento
    alert(`${menuLabel} estará disponível brevemente! ✨`);
  };

  return (
    <div className="bg-[#fdfcf5] min-h-[100dvh] w-full p-6 md:p-10 relative">
      
      {/* Header com o Perfil Dropdown */}
      <header className="w-full flex justify-end mb-12">
        <ProfileDropdown />
      </header>

      {/* Grid Centralizado para os Botões */}
      <main className="w-full max-w-2xl mx-auto flex flex-col items-center gap-4">
        
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

        {/* Botão Coming Soon: Descobrir Ideias */}
        <div className="w-full relative opacity-60 grayscale-[0.5]">
          <MenuButton 
            label="Descobrir ideias (Brevemente)" 
            imageSrc={IdeiasImg} 
            onClick={() => handleMenuClick("Descobrir ideias")}
          />
        </div>

        {/* Botão Coming Soon: Geoguess */}
        <div className="w-full relative opacity-60 grayscale-[0.5]">
          <MenuButton 
            label="Geoguess (Brevemente)" 
            imageSrc={GeoguessImg} 
            iconFirst={true}
            onClick={() => handleMenuClick("Geoguess")}
          />
        </div>

      </main>
    </div>
  );
}