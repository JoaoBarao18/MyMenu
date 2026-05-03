export interface Ingredient {
  nome: string;
  possui: boolean;
}

export interface Recipe {
  id: string;
  titulo: string;
  descricao: string;
  tempoEstimado: string;
  imagemUrl?: string;
  ingredientes: Ingredient[];
  instrucoes: string[];
}