import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "./ui/separator";

export default function HelpButton() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="rounded-full bg-blue-600 text-white text-lg font-normal border-0 p-0 w-[30px] h-[30px]">
          ?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl text-blue-600">Help</DialogTitle>
          <Separator className=" bg-black" />
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <h2 className="font-semibold mb-1 text-lg text-blue-600">
              What is SoHo Shopper?
            </h2>
            <p className="text-gray-600 text-justify font-light text-sm leading-6">
              SoHo Shopper optimizes your shopping experience by generating the
              most efficient route between stores you want to visit. Select
              stores via search or map, and we'll calculate the best path based
              on your current location.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-lg text-blue-600">
              How do I create a route?
            </h2>
            <p className="text-gray-600 text-justify font-light text-sm leading-6">
              Add stores using the search bar or by clicking locations on the
              map. Once you've selected your stores, we'll automatically
              calculate the most efficient path from your current location.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-lg text-blue-600">
              What's the store suggestion feature?
            </h2>
            <p className="text-gray-600 text-justify font-light text-sm leading-6">
              Set filters like brands, categories, price range, and ratings, and
              we'll recommend stores that match your preferences. Add suggested
              stores directly to your route.
            </p>
          </div>

          <div>
            <h2 className="font-semibold mb-1 text-lg text-blue-600">
              Can I save and share my routes?
            </h2>
            <p className="text-gray-600 text-justify font-light text-sm leading-6">
              Yes! Save your selected stores as a named route with an optional
              description. Share your route with others using a unique link -
              they'll get the same stores but optimized for their location.
            </p>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Close
            </Button>
          </DialogClose>{" "}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
