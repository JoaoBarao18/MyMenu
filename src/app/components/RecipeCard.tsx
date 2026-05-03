interface Ingrediente {
  nome: string;
  possui: boolean; // Se false, aparece a vermelho
}

interface Prato {
  id: string;
  titulo: string;
  descricao: string;
  tempoEstimado: string;
  imagemUrl?: string;
  ingredientes: Ingrediente[];
  instrucoes: string[];
}

// components/RecipeCard.tsx
export const RecipeCard = ({ prato, onClick }: { prato: Prato, onClick: () => void }) => (
  <div 
    onClick={onClick}
    className="bg-white rounded-[20px] p-4 mb-4 shadow-md border-2 border-[#4c1f03] flex gap-4 cursor-pointer active:scale-95 transition-all"
  >
    {prato.imagemUrl && (
      <img src={prato.imagemUrl} className="w-24 h-24 rounded-lg object-cover" alt={prato.titulo} />
    )}
    <div className="flex-1">
      <h3 className="font-bold text-[#4c1f03] text-lg">{prato.titulo}</h3>
      <p className="text-sm text-gray-600 line-clamp-2">{prato.descricao}</p>
      
      {/* Lista de ingredientes rápida (apenas para o caso de pratos locais) */}
      <div className="flex flex-wrap gap-2 mt-2">
        {prato.ingredientes.map((ing, i) => (
          <span key={i} className={`text-[10px] font-bold ${ing.possui ? 'text-green-600' : 'text-red-600'}`}>
            • {ing.nome}
          </span>
        ))}
      </div>
      
      <p className="text-[12px] font-bold text-[#f60] mt-2">⏱ {prato.tempoEstimado}</p>
    </div>
  </div>
);

export default RecipeCard;