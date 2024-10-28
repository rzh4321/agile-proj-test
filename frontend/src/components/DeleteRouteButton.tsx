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
import { useToast } from "@/hooks/use-toast";
import { SavedRoute } from "@/types";
import { DialogClose } from "@radix-ui/react-dialog";
import { Trash2 } from "lucide-react";

type Props = {
  route: SavedRoute;
};

export default function DeleteRouteButton({ route }: Props) {
  const { toast } = useToast();

  const handleDelete = async () => {
    // make call to backend
    if (true) {
      toast({
        description: "✓ Successfully deleted route",
        duration: 1000,
      });
    } else {
      const { message } = await response.json();
      toast({
        variant: "destructive",
        title: `An error occurred`,
        description: message,
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Trash2
          width={30}
          height={30}
          className="rounded-sm border-green-300 p-1 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader className="flex flex-col gap-2">
          <DialogTitle>Delete route {route.name}?</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
        </DialogHeader>
        <DialogFooter className="mt-2">
          <div className="flex justify-around">
            <DialogClose asChild>
              <Button className="w-[100px]">No</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button
                onClick={handleDelete}
                className="w-[100px]"
                variant={"destructive"}
              >
                Yes
              </Button>
            </DialogClose>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
