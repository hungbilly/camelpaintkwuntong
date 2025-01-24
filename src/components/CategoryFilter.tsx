import { StoreCategory } from "@/types/store";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface CategoryFilterProps {
  categories: StoreCategory[];
  selectedCategory: StoreCategory | null;
  onSelectCategory: (category: StoreCategory | null) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryFilterProps) => {
  // Fetch all stores to get accurate category counts
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  // Normalize categories to handle "Service" and "Services" as the same
  const normalizeCategory = (category: string): StoreCategory => {
    if (category === "Service") return "Services";
    return category as StoreCategory;
  };

  // Count categories after normalization using the stores from Supabase
  const categoryCount: Record<StoreCategory, number> = stores.reduce(
    (acc, store) => {
      const normalizedCategory = normalizeCategory(store.category);
      if (Object.values(StoreCategory).includes(normalizedCategory as any)) {
        acc[normalizedCategory as StoreCategory] = (acc[normalizedCategory as StoreCategory] || 0) + 1;
      }
      return acc;
    },
    {} as Record<StoreCategory, number>
  );

  // Get unique normalized categories from the stores data
  const uniqueCategories = Array.from(
    new Set(stores.map(store => normalizeCategory(store.category)))
  ).filter(category => Object.values(StoreCategory).includes(category as any)).sort() as StoreCategory[];

  const totalStores = stores.length;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        aria-label={`Show all categories, ${totalStores} stores`}
        disabled={selectedCategory === null}
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
      >
        All ({totalStores})
      </Button>
      {uniqueCategories.map((category) => (
        <Button
          key={category}
          aria-label={`Show ${category} category, ${
            categoryCount[category]
          } stores`}
          disabled={selectedCategory === category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
        >
          {category} ({categoryCount[category]})
        </Button>
      ))}
    </div>
  );
};