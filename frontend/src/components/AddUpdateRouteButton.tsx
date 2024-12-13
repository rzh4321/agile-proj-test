import { API_URL } from "@/config";
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
import { SavedRoute, Store } from "@/types";
import { Pen } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import EditRouteStoresButton from "./EditRouteStoresButton";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Required",
    })
    .max(35, {
      message: "Name cannot exceed 35 characters",
    }),
  description: z.string().max(250, {
    message: "Description cannot exceed 250 characters",
  }),
});

type Props = {
  route: SavedRoute | Store[];
  type: "Add" | "Update";
  onRouteUpdate?: () => Promise<void> | undefined;
};

export default function AddUpdateRouteButton({
  route,
  type,
  onRouteUpdate,
}: Props) {
  const [pending, setPending] = useState(false);
  const [stores, setStores] = useState<Store[]>(
    Array.isArray(route) ? route : route.stores,
  );
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      // if route is an array of stores, this route isn't saved, so no default values
      name: Array.isArray(route) ? "" : route.name,
      description: Array.isArray(route) ? "" : route.description,
    },
  });

  const removeStore = async (removedStore: Store) => {
    const newStores = stores.filter((store) => store._id != removedStore._id);
    setStores(newStores);
  };

  const addStore = async (addedStore: Store) => {
    const newStores = [...stores, addedStore];
    setStores(newStores);
  };

  const isSavedStore = (store: Store) => {
    return stores.some((saved) => saved._id === store._id);
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (stores.length === 0) {
      toast({
        variant: "destructive",
        title: `An error occurred`,
        description: "A route must have at least one store.",
      });
      return;
    }
    setPending(true);
    const token = localStorage.getItem("token");
    const storeIds = stores.map((store) => store._id);

    const response = await fetch(
      `${API_URL}/routes${type === "Update" ? `/${(route as SavedRoute)._id}` : ""}`,
      {
        method: type === "Add" ? "POST" : "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: values.name,
          description: values.description,
          stores: storeIds,
        }),
      },
    );

    // make call to backend
    if (response.ok) {
      toast({
        description: `✓ Successfully ${type === "Update" ? "updated" : "added"} route`,
        duration: 1000,
      });
      if (type === "Add") {
        const savedRoute = await response.json();
        const routeId = savedRoute._id;
        // refresh page to render name, desc, share link
        setTimeout(() => {
          // refresh page with the returned id
          navigate(`/route/${routeId}`);
        }, 1000);
      } else {
        // callback function is provided if type is "Update"
        onRouteUpdate!();
      }
    } else {
      const { message } = await response.json();
      toast({
        variant: "destructive",
        title: `An error occurred`,
        description: message,
      });
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {type === "Update" ? (
          <Pen
            onClick={(e) => e.stopPropagation()}
            width={30}
            height={30}
            className="rounded-sm border-green-300 p-1 cursor-pointer"
          />
        ) : (
          <Button variant={"add"}>Save Route</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {type === "Update"
                  ? `Edit ${(route as SavedRoute).name}`
                  : "Enter Route Details"}
              </DialogTitle>
              <DialogDescription>
                {type === "Update"
                  ? `Make changes to your route here.`
                  : "Enter the details of this new route."}{" "}
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <EditRouteStoresButton
                stores={stores}
                addStore={addStore}
                removeStore={removeStore}
                isSavedStore={isSavedStore}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel htmlFor="name" className="text-right">
                      Name
                    </FormLabel>

                    <FormControl>
                      <Input
                        {...field}
                        className="col-span-3"
                        id="name"
                        type="text"
                        name="name"
                        defaultValue={Array.isArray(route) ? "" : route.name}
                        maxLength={35}
                        required
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 gap-4">
                    <FormLabel
                      htmlFor="description"
                      className="text-right mt-4"
                    >
                      Description
                    </FormLabel>

                    <FormControl>
                      <Textarea
                        {...field}
                        className="col-span-3 max-h-[300px]"
                        id="description"
                        name="description"
                        defaultValue={
                          Array.isArray(route) ? "" : route.description
                        }
                        maxLength={250}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={pending}>
                {type === "Update" ? "Save Changes" : "Save Route"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
