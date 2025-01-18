import { Store, StoreCategory, StoreBlock } from "@/types/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Upload, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface StoreFormData {
  name: string;
  category: StoreCategory;
  description: string;
  location: string;
  floor: string;
  block: StoreBlock;
  image: string;
  instagram_link: string;
}

interface StoreFormProps {
  initialData?: Store;
  onSubmit: (data: StoreFormData) => void;
  submitLabel: string;
}

export const StoreForm = ({ initialData, onSubmit, submitLabel }: StoreFormProps) => {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<StoreFormData>({
    name: initialData?.name || "",
    category: initialData?.category || "" as StoreCategory,
    description: initialData?.description || "",
    location: initialData?.location || "",
    floor: initialData?.floor?.toString() || "1",
    block: initialData?.block || "" as StoreBlock,
    image: initialData?.image || "",
    instagram_link: initialData?.instagram_link?.replace('https://instagram.com/', '') || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      instagram_link: formData.instagram_link ? `https://instagram.com/${formData.instagram_link.replace('@', '')}` : ''
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64File = reader.result?.toString().split(',')[1];
        
        const { data, error } = await supabase.functions.invoke('upload-store-image', {
          body: {
            fileName: file.name,
            fileType: file.type,
            fileData: base64File
          }
        });
        
        if (error) throw error;
        if (!data?.url) throw new Error('No URL returned from upload');

        setFormData(prev => ({ ...prev, image: data.url }));
        toast({
          title: "Success",
          description: "Image uploaded successfully",
        });
      };

      reader.onerror = (error) => {
        throw new Error('Error reading file');
      };
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload image. " + (error as Error).message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  // ... keep existing code (form JSX)

  return (
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
              <SelectItem value="0">G/F</SelectItem>
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
          value={formData.instagram_link}
          onChange={(e) => setFormData({ ...formData, instagram_link: e.target.value.replace('@', '') })}
          placeholder="@storename or storename"
        />
      </div>

      <div className="space-y-2">
        <Label>Store Image</Label>
        <div className="flex flex-col gap-4">
          {formData.image && (
            <img 
              src={formData.image} 
              alt="Store preview" 
              className="w-full h-48 object-cover rounded-md"
            />
          )}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              disabled={uploading}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Upload className="h-4 w-4" />
              )}
              Upload Image
            </Button>
            <Input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={uploading}
            />
            <Input
              type="url"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="Or paste image URL"
              className="flex-1"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
};
