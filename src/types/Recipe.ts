export interface Ingredient {
  nome: string;
  quantidade_numerica: number; // Adicionado aqui! (ex: 200)
  unidade: string;             // Adicionado aqui! (ex: "g", "ml")
  possui: boolean;
}

export interface Recipe {
  id: string;
  titulo: string;
  descricao: string;
  tempoEstimado: string;
  paisDeOrigem?: string;       // O Gemini também nos devolve de onde é o prato!
  imagemUrl?: string;
  ingredientes: Ingredient[];
  instrucoes: string[];
}