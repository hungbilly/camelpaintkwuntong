import { Store } from "@/types/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StoreImage } from "./store/StoreImage";
import { StoreHeader } from "./store/StoreHeader";
import { StoreLocation } from "./store/StoreLocation";
import { StoreSocialLinks } from "./store/StoreSocialLinks";
import { StoreActions } from "./store/StoreActions";

interface StoreCardProps {
  store: Store;
  isAdmin: boolean;
  onStoreUpdate: () => void;
}

export const StoreCard = ({ store, isAdmin, onStoreUpdate }: StoreCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <StoreImage store={store} />
      </CardHeader>
      <CardContent className="p-4">
        <StoreHeader store={store} />
        <p className="mb-2 text-sm text-muted-foreground">{store.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <StoreLocation store={store} />
            <StoreSocialLinks store={store} />
          </div>
          {isAdmin && (
            <StoreActions store={store} onStoreUpdate={onStoreUpdate} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};