import React, { useState } from 'react';
import { CheckCircle2, Circle, Lock } from 'lucide-react';

export const CookingSteps = ({ passos }: { passos: string[] }) => {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-4">
      {passos.map((passo, index) => {
        const isDone = index < currentStep;
        const isCurrent = index === currentStep;
        const isLocked = index > currentStep;

        return (
          <div 
            key={index}
            onClick={() => isCurrent && setCurrentStep(index + 1)}
            className={`flex items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${
              isDone ? 'bg-gray-50 border-transparent opacity-50' : 
              isCurrent ? 'bg-white border-[#f60] shadow-lg scale-105 cursor-pointer' : 
              'bg-gray-100 border-gray-200 opacity-40 cursor-not-allowed'
            }`}
          >
            <div className="mt-1">
              {isDone ? <CheckCircle2 className="text-green-500" /> : 
               isLocked ? <Lock className="text-gray-400 size-5" /> : 
               <Circle className="text-[#f60]" />}
            </div>
            
            <p className={`flex-1 font-['Quicksand'] ${isCurrent ? 'font-bold text-[#4c1f03]' : 'text-gray-600'}`}>
              <span className="block text-xs uppercase opacity-50 mb-1">Passo {index + 1}</span>
              {passo}
            </p>
          </div>
        );
      })}
    </div>
  );
};


export default CookingSteps;