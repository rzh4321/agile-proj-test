import { Button } from "../ui/button";
type TravelMode = "DRIVING" | "WALKING" | "BICYCLING";

type ModeSelectorProps = {
  selectedMode: TravelMode;
  onModeSelect: (mode: TravelMode) => void;
};

export function ModeSelector({
  selectedMode,
  onModeSelect,
}: ModeSelectorProps) {
  return (
    <div className="flex gap-2 mb-4">
      {(["DRIVING", "WALKING", "BICYCLING"] as TravelMode[]).map((mode) => (
        <Button
          key={mode}
          variant={selectedMode === mode ? "default" : "outline"}
          onClick={() => onModeSelect(mode)}
          className="flex items-center gap-1"
        >
          <span>
            {mode === "DRIVING" && "🚗"}
            {mode === "WALKING" && "🚶"}
            {mode === "BICYCLING" && "🚲"}
          </span>
          <span>{mode.charAt(0) + mode.slice(1).toLowerCase()}</span>
        </Button>
      ))}
    </div>
  );
}
