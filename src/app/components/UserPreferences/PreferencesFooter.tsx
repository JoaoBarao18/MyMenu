interface PreferencesFooterProps {
  onSubmit: () => void;
}

export function PreferencesFooter({ onSubmit }: PreferencesFooterProps) {
  return (
    <div className="p-4 border-t-2 border-[#4c1f03]/20 space-y-3 bg-white">
      <button
        type="submit"
        onClick={onSubmit}
        className="w-full bg-[#ff8d28] hover:bg-[#ff8d28]/90 text-white py-2.5 px-4 rounded-md transition-colors"
      >
        Salvar Informações
      </button>
      <p className="text-xs text-[#4c1f03]/60 text-center">
        Ao submeter, concorda com os nossos termos e condições
      </p>
    </div>
  );
}