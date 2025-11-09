export interface Product {
  id: number;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  description: string;
  modelUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface AiAssistantRef {
  generate: () => void;
}