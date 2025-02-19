import { API_URL } from "@/config";
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
import { Input } from "@/components/ui/input";
import { Button } from "./ui/button";
import { Loader } from "lucide-react";
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import useAuth from "@/context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import "@/authScreen.scss";

const formSchema = z.object({
  username: z.string().min(1, {
    message: "Required",
  }),
  password: z.string().min(1, {
    message: "Required",
  }),
});

export default function LoginForm() {
  const [pending, setPending] = useState(false);
  const location = useLocation();
  const from = location.state?.from || "/"; // Default to home if no previous location
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setPending(true);
    const response = await fetch(`${API_URL}/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: values.username,
        password: values.password,
      }),
    });
    if (response.ok) {
      const { token, username } = await response.json();
      toast({
        description: `Welcome back, ${username}`,
        duration: 1000,
      });
      login(token);
      navigate(from); // Navigate to the previous page or home
    } else {
      const { message } = await response.json();
      toast({
        variant: "destructive",
        title: "Log in failed",
        description: message,
      });
      setPending(false);
    }
  }

  const circles = useMemo(
    () => Array.from({ length: 100 }, (_, i) => i + 1),
    [],
  );

  return (
    <>
      <div className="container absolute inset-0 z-[0]">
        {circles.map((i) => (
          <div key={i} className="circle-container">
            <div className="circle" />
          </div>
        ))}
      </div>
      <div className="lg:h-[calc(100vh-96px)] h-[75vh] overflow-y-hidden flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="bg-white w-[350px] md:w-[600px] p-5 rounded-xl"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
            }}
          >
            <div className="w-4/5 flex-1 rounded-lg z-[2]">
              <h1 className="mb-3 text-2xl font-bold">Sign in</h1>
              <div className="w-full">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel
                        htmlFor="username"
                        className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                      >
                        Username
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            className="peer text-base w-full block rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm outline-none placeholder:text-zinc-500"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter username"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem style={{ marginTop: "16px" }}>
                      <FormLabel
                        htmlFor="password"
                        className="mb-3 mt-5 block sm:text-xs font-medium text-zinc-400"
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div style={{ position: "relative" }}>
                          <Input
                            {...field}
                            className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm text-base outline-none placeholder:text-zinc-500"
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  className="my-6 flex sm:h-10 border-blue-600 w-full flex-row items-center justify-center rounded-md bg-[#6366f1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  aria-disabled={pending}
                  disabled={pending}
                >
                  {pending ? <Loader className="animate-spin" /> : "Log in"}
                </Button>{" "}
              </div>
            </div>

            <Link
              to="/signup"
              state={{ from: from }} // Pass the same 'from' location
              className="flex flex-row gap-1 text-sm text-zinc-400 z-[1]"
            >
              No account yet?{" "}
              <div className="font-semibold underline">Sign up</div>
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
