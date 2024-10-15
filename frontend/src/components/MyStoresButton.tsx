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
          <Button
            variant={"destructive"}
            className="my-2 font-light"
            onClick={() => clearStores()}
          >
            <Trash className="w-[15px] mr-1" />
            Clear
          </Button>
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
            className={cn(
              "m-auto rounded-3xl bg-green-600 border-green-700 text-white hover:bg-green-700 hover:text-slate-200",
            )}
          >
            <StoreIcon />
            <span className="ml-2 text-lg py-[2px] font-extrabold">
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
