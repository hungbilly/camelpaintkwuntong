import { Store } from "@/types/store";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Edit, Trash2, Instagram } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StoreCardProps {
  store: Store;
  isAdmin: boolean;
  onStoreUpdate: () => void;
}

export const StoreCard = ({ store, isAdmin, onStoreUpdate }: StoreCardProps) => {
  const { toast } = useToast();
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: store.name,
    category: store.category,
    description: store.description,
    location: store.location,
    floor: store.floor.toString(),
    block: store.block,
    image: store.image || "",
    instagram_link: store.instagram_link || "",
  });

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      setUploading(true);
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('store-images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('store-images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, image: publicUrl });
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      });
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

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
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 h-4 w-4" />
              <span>
                {store.location} - Floor {store.floor}
              </span>
            </div>
            {store.instagram_link && (
              <a
                href={store.instagram_link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 hover:text-pink-600 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
                  <DialogHeader>
                    <DialogTitle>Edit Store</DialogTitle>
                  </DialogHeader>
                  <ScrollArea className="h-full max-h-[calc(90vh-8rem)] pr-4">
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
                        <Label htmlFor="instagram">Instagram Link</Label>
                        <Input
                          id="instagram"
                          type="url"
                          value={formData.instagram_link}
                          onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value })}
                          placeholder="https://instagram.com/storename"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="image">Store Image</Label>
                        <div className="flex gap-2">
                          <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                          />
                          {uploading && <span>Uploading...</span>}
                        </div>
                        {formData.image && (
                          <img 
                            src={formData.image} 
                            alt="Store preview" 
                            className="mt-2 h-32 w-full object-cover rounded-md"
                          />
                        )}
                      </div>

                      <Button type="submit" className="w-full">Update Store</Button>
                    </form>
                  </ScrollArea>
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
