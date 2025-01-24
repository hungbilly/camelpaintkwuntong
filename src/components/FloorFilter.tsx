import { Button } from "@/components/ui/button";

interface FloorFilterProps {
  selectedFloor: number | null;
  onSelectFloor: (floor: number | null) => void;
}

export const FloorFilter = ({
  selectedFloor,
  onSelectFloor,
}: FloorFilterProps) => {
  const floors = Array.from({ length: 12 }, (_, i) => i + 1);

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedFloor === null ? "default" : "outline"}
        onClick={() => onSelectFloor(null)}
      >
        All Floors
      </Button>
      <Button
        variant={selectedFloor === 0 ? "default" : "outline"}
        onClick={() => onSelectFloor(0)}
      >
        G/F
      </Button>
      {floors.map((floor) => (
        <Button
          key={floor}
          variant={selectedFloor === floor ? "default" : "outline"}
          onClick={() => onSelectFloor(floor)}
        >
          Floor {floor}
        </Button>
      ))}
    </div>
  );
};