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
          <CommandItem
            style={{
              height: "100px",
              display: "flex",
              justifyContent: "space-between",
              padding: "0 20px",
              alignItems: "center",
              borderBottom: "1px solid #ddd",
            }}
          >
            <div className="text-xl font-serif">{store.name}</div>
            {isAdding ? (
              <Check
                style={{
                  color: "green",
                  width: "86px",
                  animation: "ping 1s linear infinite",
                }}
              />
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
                Add{" "}
                <Plus
                  style={{
                    marginLeft: "4px",
                  }}
                />
              </Button>
            )}
          </CommandItem>
        </div>
      </DialogTrigger>
      <StoreDialog store={store} allowAddRemove={false} />
    </Dialog>
  );
}
