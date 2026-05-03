import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../src/supabaseClient";

// Componentes internos (Garante que os teus caminhos de importação estão corretos)
import { FormField } from "./components/UserPreferences/FormField";
import { PreferencesHeader } from "./components/UserPreferences/PreferencesHeader";
import { PreferencesFooter } from "./components/UserPreferences/PreferencesFooter";

const GENDER_OPTIONS = [
  { value: "male", label: "Masculino" },
  { value: "female", label: "Feminino" },
  { value: "other", label: "Outro" },
  { value: "prefer-not-to-say", label: "Prefiro não dizer" }
];

const EXERCISE_OPTIONS = [
  { value: "no", label: "Nenhum exercício" },
  { value: "ocasionally", label: "Ocasional (1-2x/semana)" },
  { value: "regular", label: "Regular (3-4x/semana)" },
  { value: "intensive", label: "Intensivo (5+ /semana)" }
];

export default function UserPreferences() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: "",
    age: "",
    weight: "",
    height: "",
    nationality: "",
    gender: "",
    allergies: "",
    exerciseFrequency: ""
  });

  // Validação: Ativa o botão apenas se os campos obrigatórios (exceto alergias) estiverem preenchidos
  const isFormValid = useMemo(() => {
    const { allergies, ...requiredFields } = formData;
    return Object.values(requiredFields).every(value => value.trim() !== "");
  }, [formData]);

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Utilizador não autenticado");
      }

      // 1. Atualizar o nome no perfil básico
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: formData.fullName })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // 2. Preparar payload para a tabela UserPreferences
      const payload = {
        id: user.id,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight.replace(',', '.')),
        height: parseFloat(formData.height.replace(',', '.')),
        nationality: formData.nationality,
        gender: formData.gender,
        exercise_frequency: formData.exerciseFrequency,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : []
      };

      // 3. Upsert (insere ou atualiza) os dados
      const { error: prefsError } = await supabase
        .from('UserPreferences')
        .upsert(payload);

      if (prefsError) throw prefsError;

      // Sucesso! Vai para o dashboard
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Erro ao salvar:", error.message);
      alert("Erro ao salvar as tuas informações. Verifica a ligação.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fffbed] min-h-[100dvh] w-full flex flex-col items-center justify-center p-4 md:p-8">
      
      {/* Card Principal Neo-Brutalista */}
      <div className="bg-white border-[4px] border-[#4c1f03] rounded-[32px] w-full max-w-[400px] shadow-[8px_8px_0px_0px_#4c1f03] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
        
        <PreferencesHeader />

        <form onSubmit={handleSubmit} className="flex flex-col h-[70vh] max-h-[650px]">
          
          {/* Conteúdo com Scroll */}
          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8 scrollbar-hide">
            
            {/* Seção: Identidade */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#fec356] text-[#4c1f03] text-xs font-black px-2 py-1 rounded-md uppercase">Bio</span>
                <div className="h-[2px] flex-1 bg-[#4c1f03]/10"></div>
              </div>
              
              <FormField
                id="fullName"
                label="Nome Completo"
                value={formData.fullName}
                onChange={updateField("fullName")}
                placeholder="Como te chamas?"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="age"
                  label="Idade"
                  type="number"
                  value={formData.age}
                  onChange={updateField("age")}
                  placeholder="Ex: 25"
                />
                <FormField
                  id="nationality"
                  label="País"
                  value={formData.nationality}
                  onChange={updateField("nationality")}
                  placeholder="Ex: Portugal"
                />
              </div>
            </div>

            {/* Seção: Corpo */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#fec356] text-[#4c1f03] text-xs font-black px-2 py-1 rounded-md uppercase">Físico</span>
                <div className="h-[2px] flex-1 bg-[#4c1f03]/10"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  id="weight"
                  label="Peso (kg)"
                  type="number"
                  value={formData.weight}
                  onChange={updateField("weight")}
                  placeholder="Ex: 70"
                />
                <FormField
                  id="height"
                  label="Altura (cm)"
                  type="number"
                  value={formData.height}
                  onChange={updateField("height")}
                  placeholder="Ex: 175"
                />
              </div>

              <FormField
                id="gender"
                label="Género"
                type="select"
                value={formData.gender}
                onChange={updateField("gender")}
                placeholder="female"
                options={GENDER_OPTIONS}
              />
            </div>

            {/* Seção: Saúde */}
            <div className="space-y-4 pb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#fec356] text-[#4c1f03] text-xs font-black px-2 py-1 rounded-md uppercase">Estilo de Vida</span>
                <div className="h-[2px] flex-1 bg-[#4c1f03]/10"></div>
              </div>

              <FormField
                id="allergies"
                label="Alergias Alimentares"
                value={formData.allergies}
                onChange={updateField("allergies")}
                placeholder="Ex: Glúten, Lactose..."
              />

              <FormField
                id="exercise"
                label="Atividade Física"
                type="select"
                value={formData.exerciseFrequency}
                onChange={updateField("exerciseFrequency")}
                placeholder="None,High"
                options={EXERCISE_OPTIONS}
              />
            </div>
          </div>

          {/* Footer Fixo */}
          <div className="p-6 bg-[#fdfcf5] border-t-4 border-[#4c1f03]">
            <PreferencesFooter 
              isButtonDisabled={!isFormValid} 
              isLoading={isLoading} 
            />
          </div>
        </form>
      </div>
    </div>
  );
}