import { useState } from "react";
import { Store, StoreCategory, StoreBlock } from "@/types/store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddStoreDialogProps {
  onAddStore: (store: Store) => void;
}

export const AddStoreDialog = ({ onAddStore }: AddStoreDialogProps) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "" as StoreCategory,
    description: "",
    location: "",
    floor: "1",
    block: "" as StoreBlock,
    image: "",
    instagram_link: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

    // Cast the returned data to match the Store type
    const storeData: Store = {
      ...data,
      category: data.category as StoreCategory,
      block: data.block as StoreBlock
    };

    onAddStore(storeData);
    setOpen(false);
    setFormData({
      name: "",
      category: "" as StoreCategory,
      description: "",
      location: "",
      floor: "1",
      block: "" as StoreBlock,
      image: "",
      instagram_link: "",
    });

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
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Store Name</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                required
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value as StoreCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Fashion">Fashion</SelectItem>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Beauty">Beauty</SelectItem>
                  <SelectItem value="Home">Home</SelectItem>
                  <SelectItem value="Entertainment">Entertainment</SelectItem>
                  <SelectItem value="Services">Services</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location (Wing)</Label>
              <Input
                id="location"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., North Wing"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="block">Block</Label>
                <Select
                  required
                  value={formData.block}
                  onValueChange={(value) => setFormData({ ...formData, block: value as StoreBlock })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select block" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Block 1</SelectItem>
                    <SelectItem value="2">Block 2</SelectItem>
                    <SelectItem value="3">Block 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="floor">Floor</Label>
                <Select
                  required
                  value={formData.floor}
                  onValueChange={(value) => setFormData({ ...formData, floor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((floor) => (
                      <SelectItem key={floor} value={floor.toString()}>
                        Floor {floor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagram">Instagram Username (Optional)</Label>
              <Input
                id="instagram"
                value={formData.instagram_link?.replace('https://instagram.com/', '') || ''}
                onChange={(e) => setFormData({ ...formData, instagram_link: `https://instagram.com/${e.target.value.replace('@', '')}` })}
                placeholder="@storename or storename"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Image URL (Optional)</Label>
              <Input
                id="image"
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <Button type="submit" className="w-full">Add Store</Button>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
