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
import { useMediaQuery } from "usehooks-ts";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Store } from "@/types";
import { Loader } from "lucide-react";
import StoreItem from "./StoreItem";
import useStores from "@/hooks/useStores";
import { suggestStores } from "@/lib/utils";
import { useMyStores } from "@/context/StoresContext";

function StatusList({ stores }: { stores: Store[] }) {
  return (
    <Command>
      <CommandInput placeholder="Search stores..." />
      <CommandList>
        <CommandEmpty>No stores match your currently selected filters</CommandEmpty>
        <CommandGroup>
          {stores.map((store) => (
            <CommandList key={store._id}>
              <StoreItem type="search" store={store} />
            </CommandList>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}

export default function SuggestedStores() {
    const [suggestedStores, setSuggestedStores] = useState<Store[]>([]);
    const [loading, setLoading] = useState(false);
  const { stores, loading : storesLoading } = useStores();
  const {isAnyFilterApplied, filters} = useMyStores();
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleGenerateStores = () => {
        setLoading(true);
        const suggestions = suggestStores(stores, filters);
      setSuggestedStores(suggestions);
      setLoading(false);
  }

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button role="combobox" onClick={handleGenerateStores} disabled={!isAnyFilterApplied || storesLoading}>
            Generate Stores
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          {isDesktop ? (
            !loading ? <StatusList stores={suggestedStores} /> : <Loader className="animate-spin m-auto" />
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <div className="mt-4 border-t">
                  {!loading ? <StatusList stores={suggestedStores} /> : <Loader className="animate-spin m-auto" />}
                </div>
              </DrawerContent>
            </Drawer>
          )}
        </PopoverContent>
      </Popover>
    </>
  );
}
