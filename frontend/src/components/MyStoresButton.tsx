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
import { cn } from "@/lib/utils";
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Store } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { StoreIcon, Trash } from "lucide-react";
import StoreItem from "./StoreItem";

function StatusList({ stores }: { stores: Store[] }) {
  const { clearStores } = useMyStores();
  return (
    <Command>
      <CommandInput placeholder="Search stores..." />
      <CommandList>
        {/* TODO: add confirm button */}
        {stores.length > 0 && (
          <div className="flex justify-center">
            <Button
              variant={"destructive"}
              className="my-2 ml-1 font-light"
              onClick={() => clearStores()}
            >
              <Trash className="w-[15px] mr-1" />
              Clear all stores
            </Button>
          </div>
        )}
        <CommandEmpty>You have not added any stores.</CommandEmpty>
        <CommandGroup>
          {stores.map((store) => (
            <CommandList key={store._id}>
              <StoreItem type="myStore" store={store} />
            </CommandList>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default function MyStoresButton() {
  const { stores } = useMyStores();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            role="combobox"
            size="lg"
            className={cn(
              " font-medium text-lg justify-between w-150 m-auto mt-0 flex items-center space-x-2 rounded-3xl bg-green-700 border-green text-white hover:bg-green-700 px-3",
            )}
          >
            <StoreIcon className="h-5 w-5" />
            <span className="hidden sm:block">Stores</span>
            <span className="text-lg font-medium text-white">
              {stores.length}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {isDesktop ? (
            <StatusList stores={stores} />
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <div className="mt-4 border-t">
                  <StatusList stores={stores} />
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
