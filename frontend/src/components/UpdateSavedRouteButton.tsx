import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SavedRoute } from "@/types";
import { Pen } from "lucide-react";
import { Textarea } from "./ui/textarea";
import EditRouteStoresButton from "./EditRouteStoresButton";

type Props = {
  route: SavedRoute;
};

export default function UpdateSavedRouteButton({ route }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pen
          width={30}
          height={30}
          className="rounded-sm border-green-300 p-1"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Route {route.name}</DialogTitle>
          <DialogDescription>
            Make changes to your route here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditRouteStoresButton initialStores={route.stores} />
        <div className="grid gap-4 pb-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" defaultValue={route.name} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            <Label htmlFor="description" className="text-right mt-1">
              Description
            </Label>
            <Textarea
              id="description"
              defaultValue={route.description}
              className="col-span-3 max-h-[300px]"
              maxLength={100}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
