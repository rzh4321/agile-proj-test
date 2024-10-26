import type { Store } from "@/types";
import { useState } from "react";
import { CommandItem } from "./ui/command";
import { Button } from "./ui/button";
import { Check, Plus } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import StoreDialog from "./StoreDialog";

export default function RouteStoreItem({
  store,
  addStore,
  removeStore,
  isSavedStore,
}: {
  store: Store;
  addStore: (addedStore: Store) => Promise<void>;
  removeStore: (removedStore: Store) => Promise<void>;
  isSavedStore: (store: Store) => boolean;
}) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAdd = () => {
    setIsAdding(true);
    addStore(store);
    setTimeout(() => {
      setIsAdding(false);
    }, 500);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <CommandItem className="h-[100px] flex justify-between px-5">
            <div className="text-2xl font-extrabold">{store.name}</div>
            {isAdding ? (
              <Check className="text-green-500 w-[86px] animate-ping" />
            ) : isSavedStore(store) ? (
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  removeStore(store);
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
        </div>
      </DialogTrigger>
      <StoreDialog store={store} />
    </Dialog>
  );
}
