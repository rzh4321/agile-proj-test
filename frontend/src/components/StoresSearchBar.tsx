import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Search } from "lucide-react";
import { Store } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from "@/components/ui/command";
import StoreItem from "./StoreItem";
import { Separator } from "./ui/separator";
import { cn } from "@/lib/utils";

function StoreList({
  stores,
  highlightedStores = [],
  heading = undefined,
}: {
  stores: Store[];
  highlightedStores?: Store[];
  heading?: string | undefined;
}) {
  return (
    <Command>
      <CommandInput placeholder="Search stores..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {highlightedStores.length > 0 && (
          <CommandGroup heading={heading}>
            {highlightedStores.map((store) => (
              <CommandList key={store._id}>
                <StoreItem type="search" store={store} />
              </CommandList>
            ))}
            <Separator
              style={{
                height: "5px",
                backgroundColor: "#ddd",
                margin: "8px 0",
              }}
            />
          </CommandGroup>
        )}
        <CommandGroup heading="All Stores">
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

export default function StoresSearchBar({ stores = [] }: { stores: Store[] }) {
  const [open, setOpen] = useState(false);
  const [suggestedStores, setSuggestedStores] = useState<Store[]>([]);
  const isDesktop =
    typeof window !== "undefined" ? window.innerWidth >= 768 : true;
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const openSearchBar = location.state?.openSearchBar || false;
    const newSuggestedStores = location.state?.suggestedStores || [];

    if (openSearchBar) {
      setOpen(true);
      setSuggestedStores(newSuggestedStores);
      // Clear the state after opening the search bar
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            size="lg"
            className={cn("justify-between italic w-full m-auto mt-0 flex items-center space-x-2 rounded-xl bg-white border-gray-300 text-gray-500 hover:bg-gray-100 px-2")}
          >
          Browse all stores...
            <Search className="ml-2 h-4 w-4 shrink-0" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">

          {isDesktop ? (
            <StoreList
              stores={stores}
              highlightedStores={suggestedStores}
              heading="Suggested Stores"
            />
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerContent>
                <div
                  style={{
                    marginTop: "16px",
                    borderTop: "1px solid #ddd",
                  }}
                >
                  <StoreList
                    stores={stores}
                    highlightedStores={suggestedStores}
                    heading="Suggested Stores"
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
