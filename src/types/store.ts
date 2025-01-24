export type StoreCategory = 
  | "Fashion"
  | "Food"
  | "Electronics"
  | "Beauty"
  | "Home"
  | "Entertainment"
  | "Services";

export type StoreBlock = "1" | "2" | "3";

export interface Store {
  id: string;
  name: string;
  category: StoreCategory;
  description: string;
  location: string;
  floor: number;
  block: StoreBlock;
  image: string;
  instagram_link?: string;
}