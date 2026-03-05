export interface Product {
  id: number;
  name: string;
  category_name: string;      // ดึงจาก JOIN categories
  application_name: string;   // ดึงจาก JOIN applications
  price: number;              // แปลงเป็น number ใน PHP แล้ว
  stock: number;
  images: string[];           // Array ของ string (URL รูปภาพ)

  // ข้อมูลทางเทคนิคอื่นๆ (ที่ดึงมาจาก API)
  style?: string;
  wattage?: number;
  color_temp_k?: number;
  ip_rating?: string;
  created_at?: string;
}