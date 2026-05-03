import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../src/supabaseClient';
import { Heart, Clock, Globe, Trash2 } from 'lucide-react';

interface Recipe {
  id: string;
  titulo: string;
  duracao: number;
  pais_de_origem: string;
  imagem_url: string;
  favorito: boolean;
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  async function fetchFavorites() {
    try {
      setIsLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('receitas')
        .select('id, titulo, duracao, pais_de_origem, imagem_url, favorito')
        .eq('user_id', user.id)
        .eq('favorito', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFavorites(data || []);
    } catch (error) {
      console.error("Erro ao carregar favoritos:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function toggleFavorite(recipeId: string) {
    try {
      // Remove dos favoritos definindo favorito como false
      const { error } = await supabase
        .from('receitas')
        .update({ favorito: false })
        .eq('id', recipeId);

      if (error) throw error;

      // Atualiza a lista localmente para remover o item visualmente
      setFavorites(prev => prev.filter(recipe => recipe.id !== recipeId));
    } catch (error: any) {
      alert("Erro ao remover dos favoritos: " + error.message);
    }
  }

  return (
    <div className="bg-[#fdfcf5] min-h-screen w-full p-6 md:p-10 font-sans text-[#4c1f03]">
      
      {/* Header Clean */}
      <header className="max-w-4xl mx-auto flex justify-between items-center mb-10">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center bg-white border border-[#4c1f03]/10 rounded-full hover:bg-gray-50 transition-all shadow-sm"
        >
          ←
        </button>
        <div className="flex items-center gap-2">
          <Heart className="fill-[#4c1f03] text-[#4c1f03]" size={20} />
          <h1 className="text-xl font-bold tracking-tight">Meus Favoritos</h1>
        </div>
        <div className="w-10"></div>
      </header>

      <main className="max-w-4xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-white/50 rounded-[32px] animate-pulse border border-[#4c1f03]/5" />
            ))}
          </div>
        ) : favorites.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#4c1f03]/10 rounded-[40px] shadow-sm">
            <p className="text-lg opacity-40">Ainda não guardaste nenhuma receita.</p>
            <button 
              onClick={() => navigate('/receitas')}
              className="mt-4 text-sm font-bold underline hover:opacity-70"
            >
              Explorar receitas
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favorites.map((recipe) => (
              <div 
                key={recipe.id}
                className="bg-white rounded-[32px] overflow-hidden border border-[#4c1f03]/10 shadow-sm hover:shadow-md transition-all flex group"
              >
                {/* Imagem da Receita */}
                <div className="w-32 h-full bg-gray-100 shrink-0 relative">
                  {recipe.imagem_url ? (
                    <img 
                      src={recipe.imagem_url} 
                      alt={recipe.titulo} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center opacity-10 font-bold">🍴</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">{recipe.titulo}</h3>
                    <div className="flex gap-4 text-[10px] uppercase tracking-widest font-bold opacity-40">
                      <div className="flex items-center gap-1">
                        <Clock size={12} /> {recipe.duracao} min
                      </div>
                      <div className="flex items-center gap-1">
                        <Globe size={12} /> {recipe.pais_de_origem}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-4">
                    <button 
                      onClick={() => toggleFavorite(recipe.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-500 rounded-2xl hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={16} />
                      <span className="text-xs font-bold uppercase tracking-tighter">Remover</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}