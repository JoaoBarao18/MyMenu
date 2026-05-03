import React from 'react';
import { Ingredient } from '../../types/Recipe'; // Confirma se o caminho para o teu ficheiro de tipos está correto

interface IngredientListProps {
  ingredientes: Ingredient[];
}

export function IngredientList({ ingredientes }: IngredientListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {ingredientes.map((ing, index) => (
        <div 
          key={index} 
          className={`px-4 py-3 rounded-xl border-2 font-medium text-sm flex items-center justify-between
            ${ing.possui 
              ? 'border-green-200 bg-green-50 text-green-700' 
              : 'border-red-200 bg-red-50 text-red-600'
            }`}
        >
          <div>
            {/* Aqui juntamos a quantidade, a unidade e o nome do ingrediente */}
            <span className="font-bold mr-1">
              {ing.quantidade_numerica} {ing.unidade}
            </span>
            <span>de {ing.nome}</span>
          </div>

          {/* Uma pequena "tag" visual para avisar o que falta na despensa */}
          {!ing.possui && (
            <span className="text-[10px] uppercase font-bold bg-white text-red-600 px-2 py-1 rounded-full border border-red-200">
              Falta
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
