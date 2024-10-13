import { useState } from "react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import Filters from "./Filters";

type filterTypes = "Brand" | "Price Range" | "Category";

const filterDescriptions: Record<filterTypes, string> = {
  Brand: "brand desc",
  "Price Range": "price range desc",
  Category: "category desc",
};

const filterNames: filterTypes[] = ["Brand", "Price Range", "Category"];

export default function FilterPage() {
  const [currentFilter, setCurrentFilter] = useState<filterTypes>("Brand");
  const navigate = useNavigate();

  return (
    <div className="flex">
      <nav className="w-32 bg-blue-400 overflow-y-auto h-[calc(100vh-68px)]">
        <ul className="divide-y divide-black">
          {filterNames.map((filter) => (
            <li
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`${filter === currentFilter ? "bg-green-600 font-extrabold text-2xl" : "hover:bg-blue-500 text-xl"} p-4 py-8 font-bold cursor-pointer`}
            >
              {filter}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto h-fit max-h-[calc(100vh-68px)]">
        <h1 className="text-3xl font-bold mb-4">{currentFilter}</h1>
        <p className="text-gray-600 mb-6">
          {filterDescriptions[currentFilter]}
        </p>
        <Filters currentFilter={currentFilter} />
        <div className="my-8">
          <Button variant={"secondary"} onClick={() => navigate("/")}>
            Go Back
          </Button>
        </div>
      </main>
    </div>
  );
}
