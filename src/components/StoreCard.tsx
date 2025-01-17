import { Store } from "@/types/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface StoreCardProps {
  store: Store;
  isAdmin: boolean;
  onStoreUpdate: () => void;
}

export const StoreCard = ({ store, isAdmin, onStoreUpdate }: StoreCardProps) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name,
    category: store.category,
    description: store.description,
    location: store.location,
    floor: store.floor.toString(),
    block: store.block,
    image: store.image || "",
  });

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

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
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
    setIsEditDialogOpen(false);
    onStoreUpdate();
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <CardHeader className="p-0">
        <img
          src={store.image}
          alt={store.name}
          className="h-48 w-full object-cover"
        />
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold">{store.name}</h3>
          <Badge variant="secondary">{store.category}</Badge>
        </div>
        <p className="mb-2 text-sm text-muted-foreground">{store.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span>
              {store.location} - Floor {store.floor}
            </span>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Store</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleUpdate} className="space-y-4">
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
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value as Store["category"] })}
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
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="block">Block</Label>
                        <Select
                          value={formData.block}
                          onValueChange={(value) => setFormData({ ...formData, block: value as Store["block"] })}
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
                      <Label htmlFor="image">Image URL</Label>
                      <Input
                        id="image"
                        type="url"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      />
                    </div>

                    <Button type="submit" className="w-full">Update Store</Button>
                  </form>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="icon"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};