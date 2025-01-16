import { useState } from "react";
import { stores } from "@/data/stores";
import { StoreCategory, StoreBlock } from "@/types/store";
import { SearchBar } from "@/components/SearchBar";
import { StoreCard } from "@/components/StoreCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BlockFilter } from "@/components/BlockFilter";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(
    null
  );
  const [selectedBlock, setSelectedBlock] = useState<StoreBlock | null>(null);

  const categories = Array.from(new Set(stores.map((store) => store.category)));

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === null || store.category === selectedCategory;
    const matchesBlock = selectedBlock === null || store.block === selectedBlock;
    return matchesSearch && matchesCategory && matchesBlock;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[40vh] w-full bg-[url('https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1920&q=80')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative flex h-full flex-col items-center justify-center gap-6 text-white">
          <h1 className="text-4xl font-bold sm:text-5xl">Mall Directory</h1>
          <p className="text-xl">Find your favorite stores with ease</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-6">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <div className="flex flex-col gap-4">
            <CategoryFilter
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <BlockFilter
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard key={store.id} store={store} />
          ))}
        </div>

        {filteredStores.length === 0 && (
          <div className="text-center text-muted-foreground">
            No stores found matching your criteria
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;