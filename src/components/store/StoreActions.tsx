import { Store } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { StoreEditDialog } from "./StoreEditDialog";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StoreActionsProps {
  store: Store;
  onStoreUpdate: () => void;
}

export const StoreActions = ({ store, onStoreUpdate }: StoreActionsProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;

    const { error } = await supabase
      .from("stores")
      .delete()
      .eq("id", store.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to delete store",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Store deleted successfully",
    });
    onStoreUpdate();
  };

  return (
    <div className="flex gap-2">
      <StoreEditDialog
        store={store}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onStoreUpdate={onStoreUpdate}
      />
      <Button variant="outline" size="icon" onClick={() => setIsEditDialogOpen(true)}>
        <Edit className="h-4 w-4" />
      </Button>
      <Button 
        variant="outline" 
        size="icon"
        onClick={handleDelete}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};