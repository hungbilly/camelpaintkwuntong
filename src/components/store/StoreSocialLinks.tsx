import { Store } from "@/types/store";
import { Instagram } from "lucide-react";

interface StoreSocialLinksProps {
  store: Store;
}

export const StoreSocialLinks = ({ store }: StoreSocialLinksProps) => {
  if (!store.instagram_link) return null;
  
  return (
    <a
      href={store.instagram_link}
      target="_blank"
      rel="noopener noreferrer"
      className="text-pink-500 hover:text-pink-600 transition-colors"
    >
      <Instagram className="h-4 w-4" />
    </a>
  );
};