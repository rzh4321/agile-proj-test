import { useState } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Store } from "@/types";
import useStores from "@/hooks/useStores";
import RouteStoreItem from "./RouteStoreItem";

type StoreListProps = {
  allStores: Store[];
  highlightedStores?: Store[];
  heading?: string | undefined;
  addStore: (addedStore: Store) => Promise<void>;
  removeStore: (removedStore: Store) => Promise<void>;
  isSavedStore: (store: Store) => boolean;
};

function StoreList({
  allStores,
  addStore,
  removeStore,
  isSavedStore,
  highlightedStores = [],
  heading = undefined,
}: StoreListProps) {
  return (
    <Command>
      <CommandGroup heading={"Changes are saved automatically."}></CommandGroup>
      <CommandInput placeholder="Search stores..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {highlightedStores.length > 0 && (
          <CommandGroup heading={heading}>
            {highlightedStores.map((store) => (
              <RouteStoreItem
                store={store}
                addStore={addStore}
                removeStore={removeStore}
                isSavedStore={isSavedStore}
              />
            ))}
          </CommandGroup>
        )}
        <CommandGroup heading="All Stores">
          {allStores.map((store) => (
            <CommandList key={store._id}>
              <RouteStoreItem
                store={store}
                addStore={addStore}
                removeStore={removeStore}
                isSavedStore={isSavedStore}
              />
            </CommandList>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default function EditRouteStoresButton({
  initialStores,
}: {
  initialStores: Store[];
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [stores, setStores] = useState<Store[]>(initialStores);
  const { stores: allStores, loading } = useStores();

  const removeStore = async (removedStore: Store) => {
    // make call to backend
    const newStores = stores.filter((store) => store._id != removedStore._id);
    setStores(newStores);
  };

  const addStore = async (addedStore: Store) => {
    // make call to backend
    const newStores = [...stores, addedStore];
    setStores(newStores);
  };

  const isSavedStore = (store: Store) => {
    return stores.includes(store);
  };

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className={cn("justify-between w-60 m-auto mt-2")}
            disabled={loading}
          >
            Edit Stores
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {isDesktop ? (
            <StoreList
              allStores={allStores}
              highlightedStores={stores}
              heading="Saved Stores"
              addStore={addStore}
              removeStore={removeStore}
              isSavedStore={isSavedStore}
            />
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <div className="mt-4 border-t">
                  <StoreList
                    allStores={allStores}
                    highlightedStores={stores}
                    heading="Saved Stores"
                    addStore={addStore}
                    removeStore={removeStore}
                    isSavedStore={isSavedStore}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
