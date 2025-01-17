import { Store } from "@/types/store";

interface StoreImageProps {
  store: Store;
}

export const StoreImage = ({ store }: StoreImageProps) => {
  return (
    <img
      src={store.image}
      alt={store.name}
      className="h-48 w-full object-cover"
    />
  );
};