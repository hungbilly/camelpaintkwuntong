export enum StoreCategory {
  Fashion = "Fashion",
  Food = "Food",
  Electronics = "Electronics",
  Beauty = "Beauty",
  Home = "Home",
  Entertainment = "Entertainment",
  Services = "Services"
}

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