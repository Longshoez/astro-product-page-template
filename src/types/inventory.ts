export type StockItem = {
  sku: string;
  title: string;
  price: number;
  regularPrice: number;
  disponible: number;
  total: number;
  notas: string;
  featured: boolean;
  tipo: "package" | "subscription";
  tier: number;
  benefitGeneral: string;
  quienes_pueden_usarlo: string;
  uso_diario: string;
};

export interface Order {
  orderId: string;
  date: string;
  status: string;
  customerName: string;
  customerEmail: string;
  products: Array<{
    sku: string;
    quantity: number;
  }>;
  total: number;
}
