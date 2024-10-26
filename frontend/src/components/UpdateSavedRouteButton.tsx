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
import EditRouteStoresButton from "./EditRouteStoresButton";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Required",
  }).max(35, {
    message: "Name cannot exceed 35 characters"
  }),
  description: z.string().max(250, {
    message: "Description cannot exceed 250 characters",
  }),
});

type Props = {
  route: SavedRoute;
};

export default function UpdateSavedRouteButton({ route }: Props) {
  const [pending, setPending] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: route.name,
      description: route.description,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('HDIUABDIASUD')
    console.log(values);
    // make call to backend
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Pen
          width={30}
          height={30}
          className="rounded-sm border-green-300 p-1"
        />
      </DialogTrigger>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
        >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Route {route.name}</DialogTitle>
          <DialogDescription>
            Make changes to your route here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <EditRouteStoresButton initialStores={route.stores} />
        <div className="grid gap-4 pb-4">
          <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel
                      htmlFor="name"
                      className="text-right"
                    >
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
                    <FormMessage />
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
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
        </form>
        </Form>
    </Dialog>
  );
}
