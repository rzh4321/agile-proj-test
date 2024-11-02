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
import { SavedRoute } from "@/types";
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
  route: SavedRoute;
  type: 'Add' | 'Update';
};

export default function AddUpdateSavedRouteButton({ route, type }: Props) {
  const [pending, setPending] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: route.name,
      description: route.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    setPending(true);
    // make call to backend
    if (true) {
      toast({
        description: "✓ Successfully updated route",
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
    setPending(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pen
          width={30}
          height={30}
          className="rounded-sm border-green-300 p-1 cursor-pointer"
        />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Edit Route {route.name}</DialogTitle>
              <DialogDescription>
                Make changes to your route here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <EditRouteStoresButton initialStores={route.stores} />
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
                        defaultValue={route.name}
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
                        defaultValue={route.description}
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
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
