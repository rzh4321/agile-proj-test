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
import { StoreIcon } from "lucide-react";
import MyStoresItem from "./MyStoresItem";


function StatusList({ stores }: { stores: Store[] }) {
  return (
    <Command>
      <CommandInput placeholder="Search stores..." />
      <CommandList>
        <CommandEmpty>You have not added any stores.</CommandEmpty>
        <CommandGroup>
          {stores.map((store) => (
            <CommandList key={store._id}>
              <MyStoresItem store={store} />
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
            variant="outline"
            role="combobox"
            className={cn("m-auto rounded-3xl bg-green-600 text-white")}
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
