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
      
      if (error) {
        console.error('Error fetching stores:', error);
        return [];
      }
      
      return data;
    }
  });

  const getCategoryCount = (category: StoreCategory | null) => {
    if (category === null) {
      return stores.length;
    }
    return stores.filter(store => store.category === category).length;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === null ? "default" : "outline"}
        onClick={() => onSelectCategory(null)}
      >
        All ({getCategoryCount(null)})
      </Button>
      {categories.map((category) => (
        <Button
          key={category}
          variant={selectedCategory === category ? "default" : "outline"}
          onClick={() => onSelectCategory(category)}
        >
          {category} ({getCategoryCount(category)})
        </Button>
      ))}
    </div>
  );
};