// components/MenuButton.tsx
import React from 'react';

interface MenuButtonProps {
  label: string;
  imageSrc: string; // URL ou import da imagem/ilustração
  onClick?: () => void;
  // Permite inverter a ordem (ícone à direita ou esquerda)
  iconFirst?: boolean; 
}

const MenuButton: React.FC<MenuButtonProps> = ({ label, imageSrc, onClick, iconFirst = false }) => {
  return (
    <button
      onClick={onClick}
      className={`
        w-full bg-white rounded-[20px] p-6 mb-5 
        flex items-center justify-between 
        shadow-[0px_4px_10px_rgba(0,0,0,0.2)] 
        transition-all hover:shadow-[0px_6px_15px_rgba(0,0,0,0.25)] 
        active:scale-[0.98] cursor-pointer
      `}
    >
      {iconFirst && (
        <img src={imageSrc} alt={label} className="w-[80px] h-[80px] object-contain mr-4" />
      )}
      
      <span className="font-['Quicksand',sans-serif] font-semibold text-[#4c1f03] text-2xl flex-1 text-left">
        {label}
      </span>

      {!iconFirst && (
        <img src={imageSrc} alt={label} className="w-[80px] h-[80px] object-contain ml-4" />
      )}
    </button>
  );
};

export default MenuButton;