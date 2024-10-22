import { Store } from "@/types";
import { Separator } from "./ui/separator";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import type { PriceRange } from "@/types";
import { ExternalLink, Star } from "lucide-react";
import { useMyStores } from "@/context/StoresContext";

const priceRangeToDollarIcons: Record<PriceRange, number> = {
  Budget: 1,
  "Mid-Range": 2,
  Premium: 3,
  Luxury: 5,
};

export default function StoreDialog({ store }: { store: Store }) {
  return (
    <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-hidden flex flex-col">
      <StickyHeader store={store} />
      <ScrollableContent store={store} />
      <StickyFooter store={store} />
    </DialogContent>
  );
}

function StickyHeader({ store }: { store: Store }) {
  return (
    <div className="sticky top-0 bg-white z-10 pb-2">
      <DialogHeader>
        <DialogTitle className="text-3xl flex flex-col gap-1">
          <span>{store.name}</span>
        </DialogTitle>
      </DialogHeader>
    </div>
  );
}

function ScrollableContent({ store }: { store: Store }) {
  return (
    <div className="flex-grow overflow-y-auto px-4">
      <StoreLinks store={store} />
      <DialogDescription className="text-center">
        {store.description}
      </DialogDescription>
      <div className="flex flex-col gap-3 mt-4">
        <StorePhotos photos={store.photos} />
        <OpeningHours hours={store.openingHours} />
        <Separator />
        <GoogleRating rating={store.rating} ratingCount={store.ratingCount} />
        <Reviews reviews={store.reviews} />
        <PhoneNumber phoneNumber={store.phoneNumber} />
        <PriceRange priceRange={store.priceRange as PriceRange} />
        <PaymentOptions paymentOptions={store.paymentOptions} />
        <Categories categories={store.categories} />
        <Brand brand={store.brand} />
      </div>
    </div>
  );
}

function StickyFooter({ store }: { store: Store }) {
  // TODO: add a confirm prompt for removing store
  const { hasStore, addStore, removeStore } = useMyStores();

  const handleClick = (store: Store) => {
    if (hasStore(store._id as string)) removeStore(store._id as string);
    else addStore(store);
  };

  return (
    <div className="sticky bottom-0 bg-white pt-2">
      <DialogFooter className="flex flex-col gap-1">
        <Button
          onClick={() => handleClick(store)}
          type="button"
          variant={hasStore(store._id as string) ? "destructive" : "add"}
        >
          {hasStore(store._id as string) ? "Remove Store" : "Add Store"}
        </Button>
        <DialogClose asChild>
          <Button type="button" variant="destructive">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </div>
  );
}

function StoreLinks({ store }: { store: Store }) {
  return (
    <div className="flex flex-col gap-1 mb-4 items-center">
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
        Store Website
        <ExternalLink className="inline ml-1 w-[12px] relative bottom-1" />
      </a>
    </div>
  );
}

function StorePhotos({ photos }: { photos: string[] }) {
  return (
    <div className="flex w-full overflow-x-auto gap-2">
      {photos.map((src) => (
        <img
          key={src}
          alt="store img"
          className="object-contain w-4/5 rounded-md"
          src={src}
        />
      ))}
    </div>
  );
}

function OpeningHours({ hours }: { hours: string }) {
  return (
    <div>
      <span className="font-bold text-lg">Opening Hours</span>
      <br />
      <pre className="border-2 p-2">{hours}</pre>
    </div>
  );
}

function GoogleRating({
  rating,
  ratingCount,
}: {
  rating: number;
  ratingCount: number;
}) {
  return (
    <div>
      <span>Google Rating: </span>
      <span className="text-lg font-bold">
        <Star className="inline mr-1" fill="yellow" stroke="blue" />
        {rating}
      </span>
      <span className="text-sm font-light"> ({ratingCount} reviews)</span>
    </div>
  );
}

function Reviews({ reviews }: { reviews: string[] }) {
  return (
    <div className="">
      <span className="font-bold">Most Recent Reviews</span>
      <div className="flex overflow-x-auto w-full gap-2 border-2 p-2">
        {reviews.map((review, i) => {
          const [userRating, userReview, user] = review.split("_");
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
  );
}

function PhoneNumber({ phoneNumber }: { phoneNumber: string }) {
  return (
    <div>
      <span>Phone No. </span>
      <span className="underline font-bold">{phoneNumber}</span>
    </div>
  );
}

function PriceRange({ priceRange }: { priceRange: PriceRange }) {
  const priceRangeColor =
    priceRange === "Budget"
      ? "text-green-500"
      : priceRange === "Mid-Range"
        ? "text-slate-400"
        : priceRange === "Luxury"
          ? "text-red-500"
          : "text-red-700";

  return (
    <div>
      <span>Price Range:</span>{" "}
      <span className={`${priceRangeColor} font-bold text-lg`}>
        {priceRange}{" "}
        <span className="text-base">
          ({"$".repeat(priceRangeToDollarIcons[priceRange])})
        </span>
      </span>
    </div>
  );
}

function PaymentOptions({
  paymentOptions,
}: {
  paymentOptions: Record<string, string>;
}) {
  return (
    <>
      {Object.entries(paymentOptions).map(([key, value]) => (
        <PaymentOption
          key={key}
          label={key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())}
          value={value}
        />
      ))}
    </>
  );
}

function PaymentOption({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span>{label}: </span>
      <span
        className={`font-bold text-lg ${value === "true" ? "text-green-400" : "text-red-400"}`}
      >
        {value === "true" ? "Yes" : value === "false" ? "No" : value}
      </span>
    </div>
  );
}

function Categories({ categories }: { categories: string[] }) {
  return (
    <div>
      <span>Category:</span>{" "}
      {categories.map((category) => (
        <span
          key={category}
          className="font-bold text-lg border-1 rounded-md bg-green-400 text-slate-100 mr-1"
        >
          {category}
        </span>
      ))}
    </div>
  );
}

function Brand({ brand }: { brand: string }) {
  return (
    <div>
      <span>Brand:</span> <span className="font-bold text-lg">{brand}</span>
    </div>
  );
}
