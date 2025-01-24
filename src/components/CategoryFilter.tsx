import { StoreCategory } from "@/types/store";
import { Button } from "@/components/ui/button";

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
  // Corrected Counting Logic
  const categoryCount: Record<StoreCategory, number> = categories.reduce(
    (acc, category) => {
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<StoreCategory, number>
  );

  // Sort alphabetically (optional)
  const uniqueCategories = Array.from(new Set(categories)).sort();
  const totalStores = categories.length;

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