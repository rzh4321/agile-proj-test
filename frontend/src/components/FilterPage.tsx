import { useState } from "react";

type filterTypes = "Brand" | "Price Range" | "Category";

const filterDescriptions: Record<filterTypes, string> = {
  Brand: "brand desc",
  "Price Range": "price range desc",
  Category: "category desc",
};

const filterNames: filterTypes[] = ["Brand", "Price Range", "Category"];

export default function FilterPage() {
  const [currentFilter, setCurrentFilter] = useState<filterTypes>("Brand");

  return (
    <div className="flex">
      <nav className="w-40 bg-blue-400 overflow-y-auto h-[calc(100vh-68px)]">
        <ul className="divide-y divide-black">
          {filterNames.map((filter) => (
            <li
              key={filter}
              onClick={() => setCurrentFilter(filter)}
              className={`${filter === currentFilter ? "bg-green-600 font-extrabold text-3xl" : "hover:bg-blue-500"} p-4 py-8 font-bold text-xl cursor-pointer`}
            >
              {filter}
            </li>
          ))}
        </ul>
      </nav>
      <main className="flex-1 p-6 overflow-y-auto h-fit">
        <h1 className="text-3xl font-bold mb-4">{currentFilter}</h1>
        <p className="text-gray-600 mb-6">
          {filterDescriptions[currentFilter]}
        </p>
      </main>
    </div>
  );
}
