import { useMyStores } from "@/context/StoresContext";
import { Slider } from "@/components/ui/slider";
import { useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  handleRatingURL: (filter: string, searchValue: string) => void;
};

export default function RatingFilters({ handleRatingURL }: Props) {
  const { setRatingFilter, filters } = useMyStores();
  const [sliderValue, setSliderValue] = useState(
    filters.rating ? filters.rating : null,
  );
  const [numRatingsInput, setNumRatingsInput] = useState(
    filters.numRatings ? filters.numRatings : null,
  );

  const handleSliderChange = (e: number[]) => {
    setSliderValue(e[0]);
    setRatingFilter("rating", e[0]);
    handleRatingURL("rating", e[0].toString());
  };

  const handleRatingInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderValue(+e.target.value);
    setRatingFilter("rating", +e.target.value);
    handleRatingURL("rating", e.target.value);
  };

  const handleNumRatingsInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setNumRatingsInput(+e.target.value);
    setRatingFilter("numRatings", +e.target.value);
    handleRatingURL("numRatings", e.target.value);
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-3">
        <Slider
          onValueChange={handleSliderChange}
          defaultValue={[sliderValue ?? 0]}
          value={[sliderValue ?? 0]}
          max={5}
          step={0.1}
          className="w-4/5"
        />
        <Input
          className="flex-grow-0 w-[75px]"
          type="number"
          value={sliderValue ?? ""}
          min={0}
          max={5}
          onChange={handleRatingInputChange}
        />
      </div>
      <div className="flex gap-4 items-center">
        <Label htmlFor="numRatings" className="text-md">
          Min no. of reviews
        </Label>
        <Input
          id="numRatings"
          type="number"
          value={numRatingsInput ?? ""}
          className="w-[75px]"
          onChange={handleNumRatingsInputChange}
        />
      </div>
    </div>
  );
}
