interface PreferencesFooterProps {
  isButtonDisabled: boolean;
}

export function PreferencesFooter({ isButtonDisabled }: PreferencesFooterProps) {
  return (
    <div className="p-6 mt-auto border-t border-[#4c1f03]/10">
      <button
        type="submit"
        disabled={isButtonDisabled} // Propriedade nativa do HTML para desativar
        className={`w-full py-4 rounded-full text-white font-bold text-lg transition-all
          ${isButtonDisabled 
            ? "bg-gray-400 cursor-not-allowed opacity-50" // Estilo quando bloqueado
            : "bg-[#ff5c00] hover:bg-[#e65300] active:scale-95 shadow-lg" // Estilo quando ativo
          }`}
      >
        Submit
      </button>
    </div>
  );
}