import { X } from "lucide-react";
import { useNavigate } from 'react-router-dom';



export function PreferencesHeader() {
    const navigate = useNavigate();

    const handleClose = () => {
        navigate('/dashboard'); // Deinho da sua rota
  };
    
    return(
    <div className="flex justify-between items-center p-4 border-b-2 border-[#4c1f03]/20">
      <h2 className="text-lg text-[#4c1f03]">Informações</h2>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-[#4c1f03]/10 rounded-full transition-colors"
        aria-label="Fechar"
      >
        <X className="w-5 h-5 text-[#4c1f03]" />
      </button>
    </div>
  );
}