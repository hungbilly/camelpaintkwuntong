import { StoreBlock } from "@/types/store";
import { Button } from "@/components/ui/button";

interface BlockFilterProps {
  selectedBlock: StoreBlock | null;
  onSelectBlock: (block: StoreBlock | null) => void;
}

export const BlockFilter = ({
  selectedBlock,
  onSelectBlock,
}: BlockFilterProps) => {
  const blocks: StoreBlock[] = ["A", "B", "C"];

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedBlock === null ? "default" : "outline"}
        onClick={() => onSelectBlock(null)}
      >
        All Blocks
      </Button>
      {blocks.map((block) => (
        <Button
          key={block}
          variant={selectedBlock === block ? "default" : "outline"}
          onClick={() => onSelectBlock(block)}
        >
          Block {block}
        </Button>
      ))}
    </div>
  );
};