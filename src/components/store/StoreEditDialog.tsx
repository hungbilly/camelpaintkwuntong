import { Store } from "@/types/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { StoreForm } from "./StoreForm";

interface StoreEditDialogProps {
  store: Store;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStoreUpdate: () => void;
}

export const StoreEditDialog = ({ store, open, onOpenChange, onStoreUpdate }: StoreEditDialogProps) => {
  const { toast } = useToast();

  const handleUpdate = async (formData: any) => {
    const { error } = await supabase
      .from("stores")
      .update({
        ...formData,
        floor: parseInt(formData.floor),
      })
      .eq("id", store.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update store",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Success",
      description: "Store updated successfully",
    });
    onOpenChange(false);
    onStoreUpdate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
          <StoreForm
            initialData={store}
            onSubmit={handleUpdate}
            submitLabel="Update Store"
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};