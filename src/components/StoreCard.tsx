import { Store } from "@/types/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

interface StoreCardProps {
  store: Store;
}

export const StoreCard = ({ store }: StoreCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={store.image}
          alt={store.name}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{store.name}</h3>
          <Badge variant="secondary">{store.category}</Badge>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{store.description}</p>
        <div className="flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-4 w-4" />
          <span>
            {store.location} - Floor {store.floor}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};