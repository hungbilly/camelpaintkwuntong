import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Store, StoreCategory, StoreBlock } from "@/types/store";
import { SearchBar } from "@/components/SearchBar";
import { StoreCard } from "@/components/StoreCard";
import { CategoryFilter } from "@/components/CategoryFilter";
import { BlockFilter } from "@/components/BlockFilter";
import { FloorFilter } from "@/components/FloorFilter";
import { AddStoreDialog } from "@/components/AddStoreDialog";
import { BannerConfigDialog } from "@/components/BannerConfigDialog";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<StoreBlock | null>(null);
  const [selectedFloor, setSelectedFloor] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const defaultBannerConfig = {
    id: '',
    image_url: "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1920&q=80",
    title: "Mall Directory",
    subtitle: "Find your favorite stores with ease"
  };

  const { data: bannerConfig = defaultBannerConfig, refetch: refetchBanner } = useQuery({
    queryKey: ['banner_config'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('banner_config')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error fetching banner config:', error);
        toast({
          title: "Error",
          description: "Failed to load banner configuration",
          variant: "destructive",
        });
        return defaultBannerConfig;
      }

      return data || defaultBannerConfig;
    }
  });

  const { data: stores = [], refetch: refetchStores } = useQuery({
    queryKey: ['stores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stores')
        .select('*');
      
      if (error) throw error;
      return data as Store[];
    }
  });

  const checkAdmin = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setIsAuthenticated(!!session);
    
    if (!session) {
      setIsAdmin(false);
      return;
    }

    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", session.user.id)
      .single();

    setIsAdmin(roles?.role === "admin");
  };

  useEffect(() => {
    checkAdmin();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAdmin();
    });

    return () => subscription.unsubscribe();
  }, []);

  const filteredStores = stores.filter((store) => {
    const matchesSearch = store.name
      ? store.name.toLowerCase().includes(searchQuery.toLowerCase())
      : false;
    const matchesCategory =
      selectedCategory === null || store.category === selectedCategory;
    const matchesBlock = selectedBlock === null || store.block === selectedBlock;
    const matchesFloor = selectedFloor === null || store.floor === selectedFloor;
    return matchesSearch && matchesCategory && matchesBlock && matchesFloor;
  });

  const handleStoreUpdate = () => {
    refetchStores();
  };

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="relative h-[40vh] w-full bg-cover bg-center"
        style={{ backgroundImage: `url('${bannerConfig.image_url}')` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container relative flex h-full flex-col items-center justify-center gap-6 text-white">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold sm:text-5xl">{bannerConfig.title}</h1>
            {isAdmin && bannerConfig.id && (
              <BannerConfigDialog 
                currentConfig={bannerConfig}
                onUpdate={refetchBanner}
              />
            )}
          </div>
          <p className="text-xl">{bannerConfig.subtitle}</p>
        </div>
      </div>

      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <div className="flex items-center gap-4">
              {isAdmin && <AddStoreDialog onAddStore={handleStoreUpdate} />}
              {isAuthenticated && (
                <Button
                  variant="outline"
                  className="gap-2"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    navigate("/login");
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <CategoryFilter
              categories={Array.from(new Set(stores.map((store) => store.category)))}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
            />
            <BlockFilter
              selectedBlock={selectedBlock}
              onSelectBlock={setSelectedBlock}
            />
            <FloorFilter
              selectedFloor={selectedFloor}
              onSelectFloor={setSelectedFloor}
            />
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStores.map((store) => (
            <StoreCard 
              key={store.id} 
              store={store} 
              isAdmin={isAdmin}
              onStoreUpdate={handleStoreUpdate}
            />
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