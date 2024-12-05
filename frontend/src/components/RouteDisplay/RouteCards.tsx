import { Store, SelectedStore } from "@/types";

interface RouteCardsProps {
  route: Store[];
  selectedStore: SelectedStore;
  onStoreClick: (store: Store, ind: number) => void;
}

export function RouteCards({
  route,
  selectedStore,
  onStoreClick,
}: RouteCardsProps) {
  const getFontSize = (name: string) => {
    const length = name.length;
    if (length <= 10) return "text-lg";
    if (length <= 15) return "text-md";
    if (length <= 20) return "text-sm";
    return "text-xs";
  };

  return (
    <div className="overflow-x-auto flex gap-[1px]">
      {route.map((store, index) => (
        <div
          key={store._id}
          onClick={() => onStoreClick(store, index)}
          className={`flex items-center gap-1 cursor-pointer relative flex-col h-[110px] min-w-[110px] max-w-[100px] text-center border-2 font-light ${
            selectedStore.store === store
              ? "bg-green-400 border-green-500 active:bg-green-400 !font-extrabold"
              : selectedStore.index > index
                ? "bg-red-200 border-red-100"
                : " bg-green-200 hover:bg-gray-200 active:bg-gray-100"
          } rounded-md p-1`}
        >
          <span
            className={`rounded-full flex justify-center items-center ${selectedStore.store === store ? "bg-green-500" : selectedStore.index > index ? "" : "bg-green-300 text-white"} text-white  text-2xl font-bold border-0 p-0 w-[30px] h-[30px]`}
          >
            {" "}
            {index + 1}
          </span>
          <span className={`${getFontSize(store.name)} px-1`}>
            {store.name}
          </span>
        </div>
      ))}
    </div>
  );
}
