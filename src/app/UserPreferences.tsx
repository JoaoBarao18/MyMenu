import { useState , useMemo } from "react";
import { FormField } from "./components/UserPreferences/FormField";
import { PreferencesHeader } from "./components/UserPreferences/PreferencesHeader";
import { PreferencesFooter } from "./components/UserPreferences/PreferencesFooter";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "../../src/supabaseClient";

const GENDER_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "outro", label: "Outro" },
  { value: "prefiro-nao-dizer", label: "Prefiro não dizer" }
];

const EXERCISE_OPTIONS = [
  { value: "nao", label: "Não pratico" },
  { value: "ocasional", label: "Ocasionalmente (1-2x por semana)" },
  { value: "regular", label: "Regularmente (3-4x por semana)" },
  { value: "intensivo", label: "Intensivamente (5+ por semana)" }
];

export default function UserPreferences() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  

  const [formData, setFormData] = useState({
    fullName: "",
    age:"",
    weight: "",
    height: "",
    nationality: "",
    gender: "",
    allergies: "",
    exerciseFrequency: ""
  });

  // Validação: Botão só ativa se os obrigatórios estiverem preenchidos
  const isFormValid = useMemo(() => {
    const { allergies, ...requiredFields } = formData;
    return Object.values(requiredFields).every(value => value.trim() !== "");
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("Utilizador não autenticado");
      }

      const {error : profileError} = await supabase
            .from('profiles')
            .update({ full_name: formData.fullName })
            .eq('id', user.id);

      if(profileError) throw profileError;


      const payload = {
        id: user.id,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight.replace(',', '.')),
        height: parseFloat(formData.height.replace(',', '.')),
        nationality: formData.nationality,
        gender: formData.gender,
        exercise_frequency: formData.exerciseFrequency,
        allergies: formData.allergies ? formData.allergies.split(',') : []
      };

      // 3. Envio para a base de dados
      const { data, error } = await supabase
        .from('UserPreferences')
        .upsert(payload) 
        .select()
        .single();

      if (error) throw error;
      navigate("/dashboard");

    } catch (error: any) {
      console.error("Erro ao salvar no Supabase:", error.message);
      alert("Houve um erro ao salvar as suas informações.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gradient-to-b from-[#fec356] relative h-[100dvh] overflow-hidden w-full flex flex-col items-center justify-center p-4 to-[#fffbed]" data-name="User-Preferences">
      <div className="bg-white border-4 border-[#4c1f03] border-solid rounded-[10px] w-full max-w-[343px] h-[777px] flex flex-col overflow-hidden">
        <PreferencesHeader/>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-5 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <FormField
              id="fullName"
              label="Full Name"
              value={formData.fullName}
              onChange={updateField("fullName")}
              placeholder="Type your full name"
            />

            <FormField
              id="age"
              label="Age"
              value={formData.age}
              onChange={updateField("age")}
              placeholder="Ex: 18"
            />


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

            <FormField
              id="nationality"
              label="Nationality"
              value={formData.nationality}
              onChange={updateField("nationality")}
              placeholder="Ex: Portuguese"
            />

            <FormField
              id="gender"
              label="Gender"
              type="select"
              value={formData.gender}
              onChange={updateField("gender")}
              placeholder="Select an option"
              options={GENDER_OPTIONS}
            />

            <FormField
              id="allergies"
              label="Food Allergies"
              value={formData.allergies}
              onChange={updateField("allergies")}
              placeholder="Ex: Peanuts, Gluten (optional)"
            />

            <FormField
              id="exercise"
              label="Do you exercise?"
              type="select"
              value={formData.exerciseFrequency}
              onChange={updateField("exerciseFrequency")}
              placeholder="Select frequency"
              options={EXERCISE_OPTIONS}
            />
          </div>

          <PreferencesFooter isButtonDisabled={!isFormValid} isLoading={isLoading} />
        </form>
      </div>
    </div>
  );
}