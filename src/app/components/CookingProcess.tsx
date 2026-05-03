// components/CookingProcess.tsx
import { useState } from "react";
import { CheckCircle2, Circle } from "lucide-react";

export const CookingProcess = ({ instrucoes }: { instrucoes: string[] }) => {
  const [stepReached, setStepReached] = useState(0);

  const handleCheck = (index: number) => {
    // Só permite marcar se for o passo atual
    if (index === stepReached) {
      setStepReached(index + 1);
    }
  };

  return (
    <div className="space-y-4 p-4">
      {instrucoes.map((passo, index) => {
        const isCompleted = index < stepReached;
        const isCurrent = index === stepReached;
        const isLocked = index > stepReached;

        return (
          <div 
            key={index}
            onClick={() => handleCheck(index)}
            className={`flex items-start gap-4 p-4 rounded-xl border-2 transition-all 
              ${isCompleted ? 'bg-green-50 border-green-200 opacity-60' : ''}
              ${isCurrent ? 'bg-white border-[#f60] shadow-md scale-105' : ''}
              ${isLocked ? 'bg-gray-100 border-gray-200 opacity-40 grayscale' : ''}
            `}
          >
            {isCompleted ? (
              <CheckCircle2 className="text-green-600 size-6" />
            ) : (
              <Circle className={`${isCurrent ? 'text-[#f60]' : 'text-gray-400'} size-6`} />
            )}
            
            <p className={`font-['Quicksand'] ${isCurrent ? 'font-bold text-[#4c1f03]' : 'text-gray-500'}`}>
              {index + 1}. {passo}
            </p>
          </div>
        );
      })}
      
      {stepReached === instrucoes.length && (
        <div className="text-center p-6 bg-yellow-100 rounded-2xl border-2 border-yellow-400">
          <h2 className="text-2xl font-bold text-[#4c1f03]">Bom apetite! 🍽️</h2>
          <button className="mt-4 bg-[#f60] text-white px-6 py-2 rounded-full font-bold">Concluir</button>
        </div>
      )}
    </div>
  );
};