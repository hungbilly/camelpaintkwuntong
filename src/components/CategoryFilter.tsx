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
  const { data: stores = [] } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('category');
      
      if (error) throw error;
      return data as { category: StoreCategory }[];
    }
  });

  // Count stores for each category using the fetched data
  const categoryCount = stores.reduce((acc, store) => {
    const category = store.category as StoreCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<StoreCategory, number>);

  const totalStores = stores.length;

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
      >
        All ({totalStores})
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
        >
          {category} ({categoryCount[category] || 0})
        </Button>
      ))}
    </div>
  );
};