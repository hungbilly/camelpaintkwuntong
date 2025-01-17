import { Store } from "@/types/store";
import { MapPin } from "lucide-react";

interface StoreLocationProps {
  store: Store;
}

export const StoreLocation = ({ store }: StoreLocationProps) => {
  return (
    <div className="flex items-center text-sm text-muted-foreground">
      <MapPin className="mr-1 h-4 w-4" />
      <span>
        {store.location} - Floor {store.floor}
      </span>
    </div>
  );
};