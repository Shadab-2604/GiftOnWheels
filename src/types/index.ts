export interface Car {
  _id: string;
  name: string;
  model: string;
  color?: string;
  year: number;
  price: number;
  category: 'Mainlines' | 'Premium' | 'Series';
  inStock: boolean;
  description?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Settings {
  whatsapp: string;
}
