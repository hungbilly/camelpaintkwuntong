import { Store } from "@/types/store";
import { Badge } from "@/components/ui/badge";

interface StoreHeaderProps {
  store: Store;
}

export const StoreHeader = ({ store }: StoreHeaderProps) => {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h3 className="font-semibold">{store.name}</h3>
      <Badge variant="secondary">{store.category}</Badge>
    </div>
  );
};