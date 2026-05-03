import React, { useState } from 'react';
import { Recipe } from '../types/Recipe';
import { IngredientList } from './components/IngredientList';
import { CookingSteps } from './components/CookingSteps';

// Dados fictícios para teste (Estes virão da tua IA/Supabase no futuro)
const MOCK_RECIPES: Recipe[] = [
  {
    id: '1',
    titulo: "Pasta Mediterrânea",
    descricao: "Uma massa rápida com o que tens no frigorífico.",
    tempoEstimado: "15 min",
    ingredientes: [
      { nome: "Massa", possui: true },
      { nome: "Tomate", possui: true },
      { nome: "Manjericão", possui: false }, // Ficará vermelho
    ],
    instrucoes: ["Ferver água com sal", "Cozzer a massa", "Refogar os tomates", "Misturar tudo"]
  }
];

export default function RecipesPage() {
  const [view, setView] = useState<'casa' | 'local'>('casa');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-[#fffbed] p-6 pb-20">
        <button onClick={() => setSelectedRecipe(null)} className="text-[#4c1f03] font-bold mb-6 flex items-center gap-2">
          ← Sair do Modo Cozinha
        </button>
        <h1 className="text-3xl font-bold text-[#4c1f03] mb-2">{selectedRecipe.titulo}</h1>
        <p className="text-gray-600 mb-8">{selectedRecipe.descricao}</p>
        
        <h2 className="font-bold text-[#4c1f03] mb-4">Ingredientes Necessários:</h2>
        <IngredientList ingredientes={selectedRecipe.ingredientes} />
        
        <h2 className="font-bold text-[#4c1f03] mt-8 mb-4">Modo de Preparação:</h2>
        <CookingSteps passos={selectedRecipe.instrucoes} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbed] p-6">
      <div className="flex bg-white rounded-full p-1 border-2 border-[#4c1f03] mb-8">
        <button 
          onClick={() => setView('casa')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${view === 'casa' ? 'bg-[#fec356] text-[#4c1f03]' : 'text-gray-400'}`}
        >
          🏠 Em Casa
        </button>
        <button 
          onClick={() => setView('local')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${view === 'local' ? 'bg-[#fec356] text-[#4c1f03]' : 'text-gray-400'}`}
        >
          📍 Pratos Locais
        </button>
      </div>

      <div className="space-y-6">
        {MOCK_RECIPES.map(recipe => (
          <div 
            key={recipe.id}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white border-4 border-[#4c1f03] rounded-[30px] p-5 shadow-lg active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-[#4c1f03]">{recipe.titulo}</h3>
              <span className="bg-[#fff3d9] px-3 py-1 rounded-full text-[#f60] font-bold text-sm">
                {recipe.tempoEstimado}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recipe.descricao}</p>
            <div className="flex gap-2">
              {recipe.ingredientes.slice(0, 3).map((ing, i) => (
                <span key={i} className={`text-[10px] font-bold uppercase ${ing.possui ? 'text-green-600' : 'text-red-500'}`}>
                  • {ing.nome}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}