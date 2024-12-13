import type { Store } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { useState } from "react";
import { CommandItem } from "./ui/command";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StoreDialog from "./StoreDialog";

export default function StoreItem({
  store,
  type,
}: {
  store: Store;
  type: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          {type === "search" ? (
            <SearchItemDialogTrigger store={store} />
          ) : (
            <MyStoresDialogTrigger store={store} />
          )}
        </div>
      </DialogTrigger>
      <StoreDialog store={store} allowAddRemove={true} />
    </Dialog>
  );
}

// store item for the search bar
function SearchItemDialogTrigger({ store }: { store: Store }) {
  const { addStore, removeStore, hasStore } = useMyStores();
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addStore(store);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };
  return (
    <CommandItem className="h-[100px] flex justify-between px-5">
      <div className="text-2xl sm:text-xl font-extrabold">{store.name}</div>
      {isAdding ? (
        <Check className="text-green-500 w-[86px] animate-ping" />
      ) : hasStore(store._id as string) ? (
        <Button
          variant="destructive"
          onClick={(e) => {
            e.stopPropagation();
            removeStore(store._id as string);
          }}
        >
          Remove
        </Button>
      ) : (
        <Button
          variant="add"
          onClick={(e) => {
            e.stopPropagation();
            handleAdd();
          }}
        >
          Add <Plus className="ml-1" />
        </Button>
      )}
    </CommandItem>
  );
}

// store item in your list of selected stores
function MyStoresDialogTrigger({ store }: { store: Store }) {
  const { removeStore } = useMyStores();

  return (
    <CommandItem className="h-[100px] flex justify-between px-5">
      <div className="text-2xl font-extrabold">{store.name}</div>
      <Button
        variant="destructive"
        onClick={() => removeStore(store._id as string)}
      >
        Remove
      </Button>
    </CommandItem>
  );
}
