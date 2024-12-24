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
  "High-end": 3,
  Premium: 5,
};

const valueToPriceRange: Record<string, PriceRange> = {
  "1": "Budget",
  "2": "Mid-Range",
  "3": "High-end",
  "4": "Premium",
};

export default function StoreDialog({
  store,
  allowAddRemove,
}: {
  store: Store;
  allowAddRemove: boolean;
}) {
  return (
    <DialogContent
      style={{
        maxWidth: "425px",
        maxHeight: "85vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <StickyHeader store={store} />
      <ScrollableContent store={store} />
      <StickyFooter store={store} allowAddRemove={allowAddRemove} />
    </DialogContent>
  );
}

function StickyHeader({ store }: { store: Store }) {
  return (
    <div className="sticky top-0 bg-white z-10 pb-2 w-fit mx-auto">
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
    <div style={{ flexGrow: 1, overflowY: "auto", padding: "16px" }}>
      <StoreLinks store={store} />
      <DialogDescription style={{ textAlign: "center" }}>
        {store.description}
      </DialogDescription>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          marginTop: "16px",
        }}
      >
        <StorePhotos photos={store.photos} />
        <OpeningHours hours={store.openingHours} />
        <Separator />
        <GoogleRating rating={store.rating} ratingCount={store.ratingCount} />
        <Reviews reviews={store.reviews} />
        <PhoneNumber phoneNumber={store.phoneNumber} />
        <PriceRange
          priceRange={valueToPriceRange[store.priceRange] as PriceRange}
        />
        <PaymentOptions paymentOptions={store.paymentOptions} />
        <Categories categories={store.categories} />
        <Brand brand={store.brand} />
      </div>
    </div>
  );
}

function StickyFooter({
  store,
  allowAddRemove,
}: {
  store: Store;
  allowAddRemove: boolean;
}) {
  const { hasStore, addStore, removeStore } = useMyStores();

  const handleClick = (store: Store) => {
    if (hasStore(store._id as string)) removeStore(store._id as string);
    else addStore(store);
  };

  return (
    <div
      style={{
        position: "sticky",
        bottom: "0",
        backgroundColor: "white",
        paddingTop: "8px",
      }}
    >
      <DialogFooter
        style={{ display: "flex", flexDirection: "column", gap: "4px" }}
      >
        {allowAddRemove && (
          <Button
            onClick={() => handleClick(store)}
            type="button"
            variant={hasStore(store._id as string) ? "destructive" : "add"}
          >
            {hasStore(store._id as string) ? "Remove Store" : "Add Store"}
          </Button>
        )}
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
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "4px",
        marginBottom: "16px",
        alignItems: "center",
      }}
    >
      <a
        href={store.googleMapsURI}
        target="_blank"
        style={{
          fontSize: "14px",
          textDecoration: "underline",
          fontWeight: "300",
          color: "gray",
        }}
      >
        {store.address}
        <ExternalLink
          style={{
            marginLeft: "4px",
            width: "12px",
            position: "relative",
            bottom: "2px",
          }}
        />
      </a>
      <a
        href={store.websiteURI}
        target="_blank"
        style={{
          fontSize: "14px",
          textDecoration: "underline",
          fontWeight: "300",
          color: "gray",
        }}
      >
        Store Website
        <ExternalLink
          style={{
            marginLeft: "4px",
            width: "12px",
            position: "relative",
            bottom: "2px",
          }}
        />
      </a>
    </div>
  );
}

function StorePhotos({ photos }: { photos: string[] }) {
  return (
    <div
      style={{ display: "flex", width: "100%", overflowX: "auto", gap: "8px" }}
    >
      {photos.map((src) => (
        <img
          key={src}
          alt="store img"
          style={{
            objectFit: "contain",
            width: "80%",
            borderRadius: "8px",
          }}
          src={src}
        />
      ))}
    </div>
  );
}

function OpeningHours({ hours }: { hours: string }) {
  return (
    <div>
      <span style={{ fontWeight: "bold", fontSize: "18px" }}>
        Opening Hours
      </span>
      <br />
      <pre style={{ border: "2px solid", padding: "8px" }}>{hours}</pre>
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
      <span style={{ fontSize: "18px", fontWeight: "bold" }}>
        <Star style={{ marginRight: "4px" }} fill="yellow" stroke="blue" />
        {rating}
      </span>
      <span style={{ fontSize: "14px", fontWeight: "300" }}>
        {" "}
        ({ratingCount} reviews)
      </span>
    </div>
  );
}
function Reviews({ reviews }: { reviews: string[] }) {
  return (
    <div>
      <span style={{ fontWeight: "bold" }}>Most Recent Reviews</span>
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          width: "100%",
          gap: "8px",
          border: "2px solid",
          padding: "8px",
        }}
      >
        {reviews.map((review, i) => {
          const [userRating, userReview, user] = review.split("_");
          return (
            <div
              key={i}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                minWidth: "300px",
                maxHeight: "300px",
                overflowY: "auto",
                fontSize: "14px",
                lineHeight: "1.5",
                letterSpacing: "0.5px",
              }}
            >
              <span style={{ fontWeight: "600" }}>
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
      <span
        style={{
          textDecoration: "underline",
          fontWeight: "bold",
        }}
      >
        {phoneNumber}
      </span>
    </div>
  );
}

function PriceRange({ priceRange }: { priceRange: PriceRange }) {
  const priceRangeColor =
    priceRange === "Budget"
      ? "green"
      : priceRange === "Mid-Range"
        ? "gray"
        : priceRange === "High-end"
          ? "red"
          : "darkred";

  return (
    <div>
      <span>Price Range:</span>{" "}
      <span
        style={{
          color: priceRangeColor,
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {priceRange}{" "}
        <span style={{ fontSize: "16px" }}>
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
        style={{
          fontWeight: "bold",
          fontSize: "18px",
          color: value === "true" ? "green" : "red",
        }}
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
          style={{
            fontWeight: "bold",
            fontSize: "18px",
            border: "1px solid",
            borderRadius: "4px",
            backgroundColor: "green",
            color: "white",
            marginRight: "4px",
            padding: "2px 4px",
          }}
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
      <span>Brand:</span>{" "}
      <span
        style={{
          fontWeight: "bold",
          fontSize: "18px",
        }}
      >
        {brand}
      </span>
    </div>
  );
}
