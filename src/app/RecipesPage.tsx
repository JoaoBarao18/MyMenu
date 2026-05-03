import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Recipe } from '../types/Recipe';
import { IngredientList } from './components/IngredientList';
import { CookingSteps } from './components/CookingSteps';
import ProfileDropdown from './components/ProfileDropdown';
import { supabase } from "../supabaseClient"
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function RecipesPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<'casa' | 'local'>('casa');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [userPrompt, setUserPrompt] = useState('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // ADICIONADO: Estado para o número de pessoas
  const [numPessoas, setNumPessoas] = useState<number>(1);

  const handleGenerateRecipe = async () => {
    setIsLoading(true);

    try{
      const { data: {user} } = await supabase.auth.getUser(); 

      if(!user){
        throw new Error("Utilizador nao selecionado");
      }

      const {data : prefs} = await supabase
        .from("UserPreferences")
        .select("age, weight, height, nationality, gender, exercise_frequency, allergies")
        .eq("id", user.id)
        .single();

      // CORREÇÃO: Ir buscar quantidade e unidade à despensa
      const {data : pantry} = await supabase
        .from("ingredientes")
        .select("nome, quantidade, unidade")
        .eq("user_id", user.id);

      // Passar a quantidade real para o Gemini saber o que tens
      const IngredientesDespensa = pantry?.map(ing => `${ing.nome} (${ing.quantidade || ''}${ing.unidade || ''})`).join(", ") || "Nenhum Ingrediente registado";
      const alergiasUser = prefs?.allergies || 'Nenhuma';

        const regrasLocalizacao = view === 'local' 
          ? `OBRIGATÓRIO: Os pratos têm de ser tipicamente de ${prefs?.nationality || 'Portugal'}.`
          : `O país de origem é livre, escolhe pratos de qualquer parte do mundo.`;

        // CORREÇÃO: Prompt mais estrito sobre os Nomes e Número de Pessoas
        const promptAI = `
          Atua como um Chef de Cozinha.
          O utilizador tem ${prefs?.age || 'uma'} idade, pesa ${prefs?.weight || 'um peso normal'}kg e treina com frequência: ${prefs?.exercise_frequency || 'normal'}.
          Pedido do utilizador: "${userPrompt}"
          Para quantas pessoas: ${numPessoas} pessoas.
          Ingredientes disponíveis na despensa: ${IngredientesDespensa}.
          Alergias a evitar: ${alergiasUser}.
          ${regrasLocalizacao}
          
          REGRAS ESTRITAS:
          1. As quantidades devem ser calculadas exatamente para ${numPessoas} pessoas.
          2. Não excedas as quantidades que o utilizador tem na despensa.
          3. SE usares um ingrediente da despensa, o campo "nome" DEVE SER EXATAMENTE IGUAL ao nome fornecido (sem inventar palavras extra).
          
          Gera EXATAMENTE 5 receitas diferentes.
          Devolve o resultado OBRIGATORIAMENTE num formato JSON com a seguinte estrutura de array:
          [
            {
              "titulo": "string",
              "descricao": "string",
              "tempoEstimado": "string (ex: 15 min)",
              "paisDeOrigem": "string",
              "ingredientes": [
                { 
                  "nome": "string",
                  "quantidade_numerica": number (APENAS O NÚMERO, ex: 200, 1, 2.5),
                  "unidade": "string (ex: g, ml, c. sopa, unidade)", 
                  "possui": boolean
                }
              ],
              "instrucoes": ["passo 1", "passo 2"]
            }
          ]
        `;

        console.log("A enviar pedido para o Gemini...");

        const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
        // Sugestão: "gemini-1.5-flash" é o nome mais estável neste momento
        const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

        const result = await model.generateContent(promptAI);
        const respostaEmTexto = result.response.text();
        
        const textoLimpo = respostaEmTexto.replace(/```json/gi, '').replace(/```/gi, '').trim();
        
        let novasReceitasRecebidas: Recipe[] = JSON.parse(textoLimpo);

        const novasReceitas: Recipe[] = novasReceitasRecebidas.map(receita => ({
          ...receita,
          id: crypto.randomUUID()
        }));

        setRecipes(prevRecipes => {
          const todasAsReceitas = [...prevRecipes, ...novasReceitas];
          if (todasAsReceitas.length > 10) {
            return todasAsReceitas.slice(-10);
          }
          return todasAsReceitas;
        });
        
        setUserPrompt('');

      } catch (error) {
        console.error("Erro ao gerar receita:", error);
        alert("Houve um problema ao falar com o Chef IA. Tenta novamente!");
      } finally {
        setIsLoading(false);
      }
    };

  const handleFinalizarEComer = async () => {
    if (!selectedRecipe) return;
    
    if (!window.confirm("Já terminaste de cozinhar? Vamos descontar os ingredientes da tua despensa!")) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Utilizador não encontrado");

      const { data: pantry } = await supabase
        .from("ingredientes")
        .select("id, nome, quantidade")
        .eq("user_id", user.id);

      if (pantry) {
        for (const ingReceita of selectedRecipe.ingredientes) {
          const quantidadeNumerica = Number((ingReceita as any).quantidade_numerica || 0);
          
          // Só desconta se POSSUI e se a quantidade é maior que 0
          if (ingReceita.possui && quantidadeNumerica > 0) {
            
            // CORREÇÃO: Limpar espaços e forçar minúsculas para garantir que encontra o match
            const nomeReceitaLimpo = ingReceita.nome.trim().toLowerCase();
            const ingDespensa = pantry.find(
              i => i.nome.trim().toLowerCase() === nomeReceitaLimpo
            );

            if (ingDespensa && ingDespensa.quantidade) {
              const novaQuantidade = Math.max(0, ingDespensa.quantidade - quantidadeNumerica);

              await supabase
                .from("ingredientes")
                .update({ quantidade: novaQuantidade })
                .eq("id", ingDespensa.id);
            }
          }
        }
      }

      alert("🎉 Bom apetite! A tua despensa foi atualizada automaticamente.");
      setSelectedRecipe(null); 

    } catch (error) {
      console.error("Erro ao atualizar despensa:", error);
      alert("Houve um erro ao descontar os ingredientes.");
    } finally {
      setIsLoading(false);
    }
  };

  if (selectedRecipe) {
    return (
      <div className="min-h-screen bg-[#fffbed] p-6 pb-20">
        <button onClick={() => setSelectedRecipe(null)} className="text-[#4c1f03] font-bold mb-6 flex items-center gap-2">
          ← Sair do Modo Cozinha
        </button>
        <h1 className="text-3xl font-bold text-[#4c1f03] mb-2">{selectedRecipe.titulo}</h1>
        <p className="text-gray-600 mb-8">{selectedRecipe.descricao}</p>
        
        {/* Assumindo que IngredientList já consegue ler as novas variaveis */}
        <IngredientList ingredientes={selectedRecipe.ingredientes} />
        
        <h2 className="font-bold text-[#4c1f03] mt-8 mb-4">Modo de Preparação:</h2>
        <CookingSteps passos={selectedRecipe.instrucoes} />
        
        <button className="w-full mt-8 bg-[#4c1f03] text-white font-bold py-3 rounded-full hover:bg-[#632a05] transition-colors">
          ❤️ Guardar no meu Livro de Receitas
        </button>

        <button 
          onClick={handleFinalizarEComer}
          disabled={isLoading}
          className={`w-full mt-4 text-[#4c1f03] font-bold py-3 rounded-full transition-all border-2 border-[#4c1f03] ${isLoading ? 'bg-gray-300 opacity-50 cursor-not-allowed' : 'bg-[#fec356] hover:bg-[#eeb142] active:scale-95'}`}
        >
          {isLoading ? 'A atualizar despensa...' : '🍽️ Finalizar e Comer!'}
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fffbed] p-6">
      <header className="flex justify-between items-center mb-8">
        <button onClick={() => navigate(-1)} className="bg-white p-3 rounded-full shadow-sm border-2 border-[#4c1f03] active:scale-90 transition-all">
          <span className="text-[#4c1f03] font-bold">← Voltar</span>
        </button>
        <img src="/LogoMyMenu.png" alt="MyMenu Logo" className="h-10 object-contain" />
        <ProfileDropdown />
      </header>

      <h1 className="text-2xl font-bold text-[#4c1f03] mb-6">O que vamos cozinhar?</h1>

      <div className="bg-white border-4 border-[#4c1f03] rounded-[30px] p-4 shadow-md mb-8">
        <p className="text-[#4c1f03] font-bold mb-2 text-sm ml-2">Como te sentes hoje?</p>
        <textarea 
          className="w-full p-4 rounded-[20px] bg-[#fdfcf5] border-none focus:ring-2 focus:ring-[#fec356] text-gray-700 resize-none mb-3"
          placeholder="Estou um pouco triste e quero algo reconfortante..."
          rows={3}
          value={userPrompt}
          onChange={(e) => setUserPrompt(e.target.value)}
          disabled={isLoading}
        />

        {/* O BOTÃO QUE DEIXA O USER ESCOLHER O NÚMERO DE PESSOAS */}
        <div className="flex items-center justify-between bg-[#fdfcf5] rounded-full p-2 px-4 mb-4">
          <span className="text-[#4c1f03] font-bold text-sm">Para quantas pessoas?</span>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setNumPessoas(Math.max(1, numPessoas - 1))}
              className="bg-gray-200 w-8 h-8 rounded-full font-bold text-[#4c1f03]"
            >-</button>
            <span className="font-bold text-[#4c1f03] w-4 text-center">{numPessoas}</span>
            <button 
              onClick={() => setNumPessoas(numPessoas + 1)}
              className="bg-[#fec356] w-8 h-8 rounded-full font-bold text-[#4c1f03]"
            >+</button>
          </div>
        </div>

        <button 
          onClick={handleGenerateRecipe}
          disabled={isLoading}
          className={`w-full mt-1 text-white font-bold py-3 rounded-full transition-all ${isLoading ? 'bg-gray-400 cursor-not-allowed scale-95' : 'bg-[#4c1f03] hover:bg-[#632a05] active:scale-95'}`}
        >
          {isLoading ? 'A pensar na receita... 👨‍🍳' : '✨ Gerar Receita Personalizada'}
        </button>
      </div>

      <div className="flex bg-white rounded-full p-1 border-2 border-[#4c1f03] mb-8">
        <button 
          onClick={() => setView('casa')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${view === 'casa' ? 'bg-[#fec356] text-[#4c1f03]' : 'text-gray-400 hover:text-[#4c1f03]'}`}
        >
          🏠 Em Casa
        </button>
        <button 
          onClick={() => setView('local')}
          className={`flex-1 py-3 rounded-full font-bold transition-all ${view === 'local' ? 'bg-[#fec356] text-[#4c1f03]' : 'text-gray-400 hover:text-[#4c1f03]'}`}
        >
          📍 Pratos Locais
        </button>
      </div>

      <div className={`space-y-6 transition-all duration-500 ease-in-out ${isLoading ? 'blur-sm opacity-50' : 'blur-none opacity-100'}`}>
        
        {recipes.length === 0 && !isLoading && (
          <div className="text-center mt-10">
            <span className="text-4xl block mb-2">🍽️</span>
            <p className="text-gray-500 italic font-medium">A tua mesa está vazia.<br/>Pede a tua primeira receita acima!</p>
          </div>
        )}
        
        {recipes.map((recipe, index) => (
          <div 
            key={recipe.id || index}
            onClick={() => setSelectedRecipe(recipe)}
            className="bg-white border-4 border-[#4c1f03] rounded-[30px] p-5 shadow-lg hover:-translate-y-1 active:scale-95 transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold text-[#4c1f03] leading-tight">{recipe.titulo}</h3>
              <span className="bg-[#fff3d9] px-3 py-1 rounded-full text-[#f60] font-bold text-sm whitespace-nowrap ml-2">
                {recipe.tempoEstimado}
              </span>
            </div>
            <p className="text-gray-600 text-sm line-clamp-2 mb-4">{recipe.descricao}</p>
            <div className="flex flex-wrap gap-2">
              {recipe.ingredientes.slice(0, 3).map((ing: any, i) => (
                <span key={i} className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${ing.possui ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                  {/* CORREÇÃO AQUI: Mostrar as quantidades que o Gemini gerou! */}
                  • {ing.quantidade_numerica}{ing.unidade} de {ing.nome}
                </span>
              ))}
              {recipe.ingredientes.length > 3 && (
                <span className="text-[10px] font-bold uppercase text-gray-400 px-2 py-1">
                  + {recipe.ingredientes.length - 3} mais
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}