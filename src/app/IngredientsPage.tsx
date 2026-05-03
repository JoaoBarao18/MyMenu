import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/supabaseClient';

interface Ingredient {
  id: string;
  nome: string;
  quantidade: number;
  unidade: string;
}

export default function IngredientsPage() {
  const navigate = useNavigate();
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Estados para o novo ingrediente
  const [newName, setNewName] = useState("");
  const [newQty, setNewQty] = useState("");
  const [newUnit, setNewUnit] = useState("un");

  useEffect(() => {
    fetchIngredients();
  }, []);

  async function fetchIngredients() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('ingredientes')
        .select('*')
        .eq('user_id', user.id)
        .order('nome', { ascending: true });

      if (error) throw error;
      setIngredients(data || []);
    } catch (error) {
      console.error("Erro ao carregar ingredientes:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleAddIngredient(e: React.FormEvent) {
    e.preventDefault();
    if (!newName || !newQty) return;

    try {
      setIsAdding(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      const { data, error } = await supabase
        .from('ingredientes')
        .insert([
          { 
            user_id: user?.id, 
            nome: newName, 
            quantidade: parseFloat(newQty.replace(',', '.')), 
            unidade: newUnit 
          }
        ])
        .select()
        .single();

      if (error) throw error;

      setIngredients([...ingredients, data].sort((a, b) => a.nome.localeCompare(b.nome)));
      setNewName("");
      setNewQty("");
    } catch (error: any) {
      alert("Erro ao adicionar: " + error.message);
    } finally {
      setIsAdding(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      const { error } = await supabase
        .from('ingredientes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setIngredients(ingredients.filter(item => item.id !== id));
    } catch (error: any) {
      alert("Erro ao remover: " + error.message);
    }
  }

  return (
    <div className="bg-[#fdfcf5] min-h-screen w-full p-6 md:p-10 font-sans text-[#4c1f03]">
      
      {/* Header */}
      <header className="max-w-2xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#4c1f03]/20 rounded-full hover:bg-gray-50 transition-all shadow-sm"
        >
          ←
        </button>
        <h1 className="text-xl font-bold tracking-tight">Meus Ingredientes</h1>
        <div className="w-10"></div>
      </header>

      <main className="max-w-2xl mx-auto space-y-6">
        
        {/* Formulário de Adição Rápida */}
        <section className="bg-white border border-[#4c1f03]/10 p-6 rounded-[32px] shadow-sm">
          <form onSubmit={handleAddIngredient} className="flex flex-col md:flex-row gap-3">
            <input 
              type="text" 
              placeholder="Nome do ingrediente"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-[2] bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all"
            />
            <div className="flex flex-1 gap-2">
              <input 
                type="text" 
                placeholder="Qtd"
                value={newQty}
                onChange={(e) => setNewQty(e.target.value)}
                className="w-20 bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all text-center"
              />
              <select 
                value={newUnit}
                onChange={(e) => setNewUnit(e.target.value)}
                className="flex-1 bg-[#fdfcf5] p-4 rounded-2xl border border-transparent focus:border-[#4c1f03]/20 outline-none transition-all appearance-none text-center cursor-pointer"
              >
                <option value="un">un</option>
                <option value="g">g</option>
                <option value="kg">kg</option>
                <option value="ml">ml</option>
                <option value="L">L</option>
              </select>
            </div>
            <button 
              type="submit"
              disabled={isAdding}
              className="bg-[#4c1f03] text-white px-8 py-4 rounded-2xl font-bold hover:opacity-90 active:scale-95 transition-all shadow-md disabled:opacity-50"
            >
              {isAdding ? "..." : "+"}
            </button>
          </form>
        </section>

        {/* Lista de Ingredientes */}
        <section className="space-y-3">
          {isLoading ? (
            <div className="text-center py-10 opacity-40 animate-pulse">A carregar a tua despensa...</div>
          ) : ingredients.length === 0 ? (
            <div className="text-center py-10 bg-white/50 rounded-[32px] border-2 border-dashed border-[#4c1f03]/10">
              <p className="opacity-50">A tua despensa está vazia.</p>
            </div>
          ) : (
            ingredients.map((item) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center bg-white p-5 rounded-3xl border border-[#4c1f03]/5 shadow-sm group hover:border-[#4c1f03]/20 transition-all"
              >
                <div className="flex flex-col">
                  <span className="font-bold text-lg capitalize">{item.nome}</span>
                  <span className="text-xs opacity-50 font-medium">{item.quantidade} {item.unidade}</span>
                </div>
                <button 
                  onClick={() => handleRemove(item.id)}
                  className="w-10 h-10 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                  title="Remover"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
}