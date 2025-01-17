import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface BannerConfig {
  image_url: string;
  title: string;
  subtitle: string;
}

interface BannerConfigDialogProps {
  onUpdate: () => void;
  currentConfig: BannerConfig;
}

export function BannerConfigDialog({ onUpdate, currentConfig }: BannerConfigDialogProps) {
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<BannerConfig>(currentConfig);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('banner_config')
        .update({
          image_url: config.image_url,
          title: config.title,
          subtitle: config.subtitle,
        })
        .eq('id', '1');

      if (error) throw error;

      toast({
        title: "Success",
        description: "Banner configuration updated successfully",
      });
      
      onUpdate();
      setOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update banner configuration",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configure Banner</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">Background Image URL</Label>
            <Input
              id="image_url"
              value={config.image_url}
              onChange={(e) => setConfig({ ...config, image_url: e.target.value })}
              placeholder="Enter image URL"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={config.title}
              onChange={(e) => setConfig({ ...config, title: e.target.value })}
              placeholder="Enter title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={config.subtitle}
              onChange={(e) => setConfig({ ...config, subtitle: e.target.value })}
              placeholder="Enter subtitle"
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Banner"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}