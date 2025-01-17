import { useState } from "react";
import { Store, StoreCategory, StoreBlock } from "@/types/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StoreForm } from "./store/StoreForm";

interface AddStoreDialogProps {
  onAddStore: (store: Store) => void;
}

export const AddStoreDialog = ({ onAddStore }: AddStoreDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (formData: any) => {
    const newStore = {
      ...formData,
      floor: parseInt(formData.floor),
      image: formData.image || "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=400&q=80"
    };

    const { data, error } = await supabase
      .from("stores")
      .insert(newStore)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add store. " + error.message,
        variant: "destructive",
      });
      console.error("Error adding store:", error);
      return;
    }

    const storeData: Store = {
      ...data,
      category: data.category as StoreCategory,
      block: data.block as StoreBlock
    };

    onAddStore(storeData);
    setOpen(false);
    toast({
      title: "Store Added",
      description: "The new store has been successfully added.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Store
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Add New Store</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
          <StoreForm
            onSubmit={handleSubmit}
            submitLabel="Add Store"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};