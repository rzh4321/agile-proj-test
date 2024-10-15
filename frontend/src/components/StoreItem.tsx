import type { Store } from "@/types";
import { useMyStores } from "@/context/StoresContext";
import { useState } from "react";
import { CommandItem } from "./ui/command";
import { Button } from "./ui/button";
import { Check, ExternalLink, Plus, Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import type { PriceRange } from "@/types";
import { Separator } from "./ui/separator";

const priceRangeToDollarIcons: Record<PriceRange, number> = {
  Budget: 1,
  "Mid-Range": 2,
  Premium: 3,
  Luxury: 5,
};

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

      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl flex flex-col gap-1">
            <span>{store.name}</span>
            <div className="flex flex-col">
              <a
                href={store.googleMapsURI}
                target="_blank"
                className="text-sm underline font-light text-muted-foreground"
              >
                {store.address}
                <ExternalLink className="inline ml-1 w-[12px] relative bottom-1" />
              </a>
              <a
                href={store.websiteURI}
                target="_blank"
                className="text-sm underline font-light text-muted-foreground"
              >
                {store.websiteURI}
                <ExternalLink className="inline ml-1 w-[12px] relative bottom-1" />
              </a>
            </div>
          </DialogTitle>
          <DialogDescription>{store.description}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex w-full overflow-x-auto gap-2">
            {store.photos.map((src) => (
              <img
                key={src}
                alt="store img"
                className="object-contain w-4/5 rounded-md"
                src={src}
              />
            ))}
          </div>
          <div>
            <span className="font-bold text-lg">Opening Hours</span>
            <br></br>
            <pre className="border-2 p-2">{store.openingHours}</pre>
          </div>
          <Separator />
          <div>
            <span>Google Rating: </span>
            <span className="text-lg font-bold">
              <Star className="inline mr-1" fill="yellow" stroke="blue" />
              {store.rating}
            </span>
            <span className="text-sm font-light">
              {" "}
              ({store.ratingCount} reviews)
            </span>
          </div>
          <div className="">
            <span className="font-bold">Most Recent Reviews</span>
            <div className="flex overflow-x-auto w-[90vw] gap-2 border-2 p-2">
              {store.reviews.map((review, i) => {
                const reviewArr = review.split("_");
                const userRating = reviewArr[0];
                const userReview = reviewArr[1];
                const user = reviewArr[2];
                return (
                  <div
                    key={i}
                    className="flex tracking-wide leading-relaxed flex-col gap-2 min-w-[300px] max-h-[300px] overflow-y-auto text-sm"
                  >
                    <span className="font-semibold">
                      {userRating} / 5 - {user}
                    </span>
                    <div>{userReview}</div>
                  </div>
                );
              })}
            </div>
          </div>
          <div>
            <span>Phone No. </span>
            <span className="underline font-bold">{store.phoneNumber}</span>
          </div>
          <div>
            <span>Price Range:</span>{" "}
            <span
              className={`${store.priceRange === "Budget" ? "text-green-500" : store.priceRange === "Mid-Range" ? "text-slate-400" : store.priceRange === "Luxury" ? "text-red-500" : "text-red-700"} font-bold text-lg`}
            >
              {store.priceRange}{" "}
              <span className=" text-base">
                (
                {"$".repeat(
                  priceRangeToDollarIcons[store.priceRange as PriceRange],
                )}
                )
              </span>
            </span>
          </div>
          <>
            <PaymentOption
              label="Accepts cash only"
              value={store.paymentOptions.acceptsCashOnly}
            />
            <PaymentOption
              label="Accepts credit cards"
              value={store.paymentOptions.acceptsCreditCards}
            />
            <PaymentOption
              label="Accepts debit cards"
              value={store.paymentOptions.acceptsDebitCards}
            />
            <PaymentOption
              label="Accepts NFC"
              value={store.paymentOptions.acceptsNFC}
            />
          </>
          <div>
            <span>Category:</span>{" "}
            {store.categories.map((category) => (
              <span
                key={category}
                className={`font-bold text-lg border-1 rounded-md bg-green-400 text-slate-100 mr-1`}
              >
                {category}
              </span>
            ))}
          </div>
          <div>
            <span>Brand:</span>{" "}
            <span className={`font-bold text-lg`}>{store.brand}</span>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const PaymentOption = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span>{label}: </span>
    <span
      className={`font-bold text-lg ${value === "true" ? "text-green-400" : "text-red-400"}`}
    >
      {value === "true" ? "Yes" : value === "false" ? "No" : value}
    </span>
  </div>
);

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
      <div className="text-2xl font-extrabold">{store.name}</div>
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
