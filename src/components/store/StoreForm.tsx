import { Store, StoreCategory, StoreBlock } from "@/types/store";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

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
        <Label htmlFor="image">Image URL (Optional)</Label>
        <Input
          id="image"
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <Button type="submit" className="w-full">{submitLabel}</Button>
    </form>
  );
};