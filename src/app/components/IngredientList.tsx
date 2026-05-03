import React from 'react';
import { Ingredient } from '../../types/Recipe';

export const IngredientList = ({ ingredientes }: { ingredientes: Ingredient[] }) => (
  <div className="grid grid-cols-2 gap-3 my-4">
    {ingredientes.map((ing, idx) => (
      <div 
        key={idx} 
        className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${
          ing.possui 
            ? 'border-green-200 bg-green-50 text-green-800' 
            : 'border-red-200 bg-red-50 text-red-600'
        }`}
      >
        <div className={`size-2 rounded-full ${ing.possui ? 'bg-green-500' : 'bg-red-50'}`} />
        <span className="font-['Quicksand'] font-bold text-sm">
          {ing.nome}
        </span>
      </div>
    ))}
  </div>
);


export default IngredientList;