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
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNumRatingsInput(+e.target.value);
    setRatingFilter("numRatings", +e.target.value);
    handleRatingURL("numRatings", e.target.value);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "32px",
      }}
    >
      <div
        style={{
          display: "flex",
          gap: "12px",
          alignItems: "center",
        }}
      >
        <Slider
          onValueChange={handleSliderChange}
          defaultValue={[sliderValue ?? 0]}
          value={[sliderValue ?? 0]}
          max={5}
          step={0.5}
          style={{
            width: "80%",
          }}
        />
        <Input
          style={{
            flexGrow: 0,
            width: "75px",
            border: "1px solid #ccc",
            padding: "4px",
            borderRadius: "4px",
          }}
          type="number"
          value={sliderValue ?? ""}
          min={0}
          max={5}
          onChange={handleRatingInputChange}
        />
      </div>
      <div
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "center",
        }}
      >
        <Label
          htmlFor="numRatings"
          style={{
            fontSize: "16px",
          }}
        >
          Min no. of reviews
        </Label>
        <select
          id="numRatings"
          value={numRatingsInput ?? ""}
          onChange={(e) =>
            handleNumRatingsInputChange(
              e as React.ChangeEvent<HTMLSelectElement>,
            )
          }
          style={{
            width: "75px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "4px",
            maxHeight: "50px",
            overflowY: "auto",
            position: "absolute",
          }}
        >
          {[...Array(11).keys()].map((num) => (
            <option key={num * 10} value={num * 10}>
              {num * 10}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
