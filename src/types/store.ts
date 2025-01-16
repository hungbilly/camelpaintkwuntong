export type StoreCategory = 
  | "Fashion"
  | "Food"
  | "Electronics"
  | "Beauty"
  | "Home"
  | "Entertainment"
  | "Services";

export type StoreBlock = "A" | "B" | "C";

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  location: string;
  floor: number;
  block: StoreBlock;
  image: string;
}