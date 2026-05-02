interface PreferencesFooterProps {
  isButtonDisabled: boolean;
  isLoading: boolean; // Adiciona esta linha
}

export function PreferencesFooter({ isButtonDisabled, isLoading }: PreferencesFooterProps) {
  return (
    <div className="p-6 mt-auto border-t border-[#4c1f03]/10">
      <button
        type="submit"
        disabled={isButtonDisabled || isLoading} // Desativa também se estiver a carregar
        className={`w-full py-4 rounded-full text-white font-bold text-lg transition-all
          ${isButtonDisabled || isLoading 
            ? "bg-gray-400 cursor-not-allowed opacity-50" 
            : "bg-[#ff5c00] hover:bg-[#e65300] active:scale-95 shadow-lg"
          }`}
      >
        {/* Muda o texto conforme o estado */}
        {isLoading ? "A guardar..." : "Submit"}
      </button>
    </div>
  );
}