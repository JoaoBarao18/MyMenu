import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/supabaseClient';

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

export default function ProfilePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  
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

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar Perfil e Preferências em paralelo
      const [profileRes, prefsRes] = await Promise.all([
        supabase.from('profiles').select('full_name, avatar_url').eq('id', user.id).single(),
        supabase.from('UserPreferences').select('*').eq('id', user.id).single()
      ]);

      console.log("Dados do Perfil:", profileRes);
      console.log("Dados das Preferências:", prefsRes);

      if (profileRes.data) setAvatarUrl(profileRes.data.avatar_url);

      if (prefsRes.data) {
        const d = prefsRes.data;
        setFormData({
          fullName: d.full_name || "",
          age: d.age?.toString() || "",
          weight: d.weight?.toString() || "",
          height: d.height?.toString() || "",
          nationality: d.nationality || "",
          gender: d.gender || "",
          allergies: Array.isArray(d.allergies) ? d.allergies.join(', ') : "",
          exerciseFrequency: d.exercise_frequency || ""
        });
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = event.target.files?.[0];
      if (!file) return;

      const { data: { user } } = await supabase.auth.getUser();
      const fileExt = file.name.split('.').pop();
      const filePath = `avatars/${user?.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', user?.id);
      setAvatarUrl(publicUrl);
    } catch (error: any) {
      alert("Erro no upload: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Atualizar Profile básico
      await supabase.from('profiles').update({ full_name: formData.fullName }).eq('id', user.id);

      // 2. Atualizar Preferências (Payload igual ao UserPreferences.tsx)
      const payload = {
        id: user.id,
        full_name: formData.fullName,
        age: parseInt(formData.age),
        weight: parseFloat(formData.weight.toString().replace(',', '.')),
        height: parseFloat(formData.height.toString().replace(',', '.')),
        nationality: formData.nationality,
        gender: formData.gender,
        exercise_frequency: formData.exerciseFrequency,
        allergies: formData.allergies ? formData.allergies.split(',').map(s => s.trim()) : []
      };

      const { error } = await supabase.from('UserPreferences').upsert(payload);
      if (error) throw error;

      alert("Perfil atualizado com sucesso!");
    } catch (error: any) {
      alert("Erro ao guardar: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[#fdfcf5] min-h-screen w-full flex flex-col items-center p-6 font-sans text-[#4c1f03]">
      
      {/* Header Clean */}
      <header className="w-full max-w-xl flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#4c1f03]/20 rounded-full hover:bg-gray-50 transition-all"
        >
          ←
        </button>
        <h1 className="text-xl font-bold">Editar Perfil</h1>
        <div className="w-10"></div>
      </header>

      <main className="w-full max-w-xl space-y-8 pb-12">
        
        {/* Foto de Perfil Modernizada */}
        <section className="flex flex-col items-center">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full border-2 border-[#4c1f03]/10 overflow-hidden bg-white shadow-sm">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50 text-2xl opacity-20">👤</div>
              )}
            </div>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[#4c1f03] text-white w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#fdfcf5] shadow-lg hover:scale-110 transition-transform"
            >
              <span className="text-[10px]">Edit</span>
            </button>
            <input type="file" ref={fileInputRef} onChange={handleAvatarUpload} className="hidden" accept="image/*" />
          </div>
          {uploading && <p className="text-[10px] mt-2 animate-pulse font-bold">A carregar...</p>}
        </section>

        {/* Grupos de Inputs */}
        <div className="space-y-6 bg-white p-8 rounded-[32px] border border-[#4c1f03]/10 shadow-sm">
          
          {/* SECÇÃO: IDENTIDADE */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c1f03]/40">Bio & Identidade</p>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1">Nome Completo</label>
              <input 
                type="text" 
                value={formData.fullName}
                onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1">Idade</label>
                <input 
                  type="number" 
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1">País</label>
                <input 
                  type="text" 
                  value={formData.nationality}
                  onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                  className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          <hr className="opacity-5" />

          {/* SECÇÃO: FÍSICO */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c1f03]/40">Dados Físicos</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1">Peso (kg)</label>
                <input 
                  type="number" 
                  value={formData.weight}
                  onChange={(e) => setFormData({...formData, weight: e.target.value})}
                  className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold ml-1">Altura (cm)</label>
                <input 
                  type="number" 
                  value={formData.height}
                  onChange={(e) => setFormData({...formData, height: e.target.value})}
                  className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1">Género</label>
              <select 
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all appearance-none"
              >
                {GENDER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          <hr className="opacity-5" />

          {/* SECÇÃO: ESTILO DE VIDA */}
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#4c1f03]/40">Estilo de Vida</p>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1">Alergias Alimentares</label>
              <input 
                type="text" 
                value={formData.allergies}
                onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                placeholder="Glúten, Lactose..."
                className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold ml-1">Atividade Física</label>
              <select 
                value={formData.exerciseFrequency}
                onChange={(e) => setFormData({...formData, exerciseFrequency: e.target.value})}
                className="w-full bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all appearance-none"
              >
                {EXERCISE_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>
            </div>
          </div>

          {/* Botão Salvar Moderno */}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="w-full bg-[#4c1f03] text-white font-bold py-5 rounded-3xl hover:opacity-90 active:scale-[0.98] transition-all shadow-md mt-4"
          >
            {isLoading ? "A guardar..." : "Atualizar Perfil"}
          </button>

        </div>
      </main>
    </div>
  );
}