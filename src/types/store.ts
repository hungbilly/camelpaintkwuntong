export type StoreCategory = 
  | "Fashion"
  | "Food"
  | "Electronics"
  | "Beauty"
  | "Home"
  | "Entertainment"
  | "Services";

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  location: string;
  floor: number;
  image: string;
}