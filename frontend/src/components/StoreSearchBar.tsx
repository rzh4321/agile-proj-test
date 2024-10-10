import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
  } from "@/components/ui/command";
  import {
    Popover,
    PopoverContent,
    PopoverTrigger,
  } from "@/components/ui/popover";
  import { Check, ChevronsUpDown } from "lucide-react";
  import { cn } from "@/lib/utils";
  import { useMediaQuery } from "usehooks-ts";
  import { useState } from "react";
  import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
  import { Button } from "@/components/ui/button";
import { Store } from "@/types";

  
  type Status = {
    value: string;
    label: string;
  };
  
  function StatusList({
    // setOpen,
    // setSelectedStatus,
    stores,
  }: {
    setOpen: (open: boolean) => void;
    setSelectedStatus: (status: Status | null) => void;
    stores: Store[];
  }) {
    return (
      <Command>
        <CommandInput placeholder="Search stores..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup>
            {stores.map((store) => (
              <CommandList key={store.name}>
                <CommandItem
                //   value={subreddit.label}
                //   onSelect={(value) => {
                //     setSelectedStatus(
                //       subreddits.find((sub) => sub.value === value) || null,
                //     );
                //   }}
                >
                  {store.name}
                </CommandItem>
              </CommandList>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    );
  }
  
  export default function StoreSearchBar({stores} : {stores: Store[]}) {
    const [open, setOpen] = useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    // const [selectedStatus, setSelectedStatus] = useState<Status | null>(null);
  
    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between",
                    )}
                  >
                    Search Stores
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                {isDesktop ? (
                  <StatusList
                    stores={stores}
                    // setOpen={setOpen}
                    // setSelectedStatus={setSelectedStatus}
                  />
                ) : (
                  <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[150px] justify-start"
                      >
                        
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <div className="mt-4 border-t">
                        <StatusList
                            stores={stores}
                        //   setOpen={setOpen}
                        //   setSelectedStatus={setSelectedStatus}
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
  