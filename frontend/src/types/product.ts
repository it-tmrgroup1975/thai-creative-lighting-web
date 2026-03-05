export interface Product {
  id: number;
  sku: string;
  name: string;
  style: 'Classic' | 'Modern' | 'Semi-Modern';
  price: number;
  status: 'Ready to Ship' | 'Out of Stock';
  main_image: string;
  specs?: {
    material: string;
    size: string;
    bulb: string;
  };
  category_name?: string;
  application_name?: string;
}