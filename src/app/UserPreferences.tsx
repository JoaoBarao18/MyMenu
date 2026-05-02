import { useState } from "react";
import { FormField } from "./components/UserPreferences/FormField";
import { PreferencesHeader } from "./components/UserPreferences/PreferencesHeader";
import { PreferencesFooter } from "./components/UserPreferences/PreferencesFooter";
import { Navigate, useNavigate } from "react-router-dom";

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

  const isFormValid =
    formData.fullName.trim() !== "" &&
    formData.age.trim() !== "" &&
    formData.weight.trim() !== "" &&
    formData.height.trim() !== "" &&
    formData.nationality.trim() !== "" &&
    formData.gender.trim() !== "" &&
    formData.exerciseFrequency.trim() !== "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if(isFormValid){
      console.log("Saving user preferences:", formData);
      navigate("/dashboard");
    }
  };

  const handleClose = () => {
    console.log("Closing preferences");
  };

  const updateField = (field: keyof typeof formData) => (value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  return (
    <div className="bg-gradient-to-b from-[#fec356] relative h-[100dvh] overflow-hidden w-full flex flex-col items-center justify-center p-4 to-[#fffbed]" data-name="User-Preferences">
      <div className="bg-white border-4 border-[#4c1f03] border-solid rounded-[10px] w-full max-w-[343px] h-[777px] flex flex-col overflow-hidden">
        <PreferencesHeader />

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

          <PreferencesFooter isButtonDisabled={!isFormValid} />
        </form>
      </div>
    </div>
  );
}