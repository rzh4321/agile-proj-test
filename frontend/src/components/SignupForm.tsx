import { API_URL } from "@/config";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Form,
  FormControl,
  FormDescription,
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
import { useToast } from "@/hooks/use-toast";
import "@/authScreen.scss";

const formSchema = z.object({
  username: z.string().min(4, {
    message: "Username must be at least 4 characters",
  }),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters",
  }),
});

export default function SignupForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [pending, setPending] = useState(false);
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
    const response = await fetch(`${API_URL}/user/signup`, {
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
        description: `Welcome, ${username}!`,
        duration: 1000,
      });
      login(token);
      navigate(from);
    } else {
      const { message } = await response.json();
      toast({
        variant: "destructive",
        title: "Sign up failed",
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

      <div className="lg:h-[calc(100vh-96px)] h-[75vh] flex items-center justify-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "16px",
              width: "75vw",
            }}
          >
            <div className="w-full flex-1 rounded-lg z-[2] px-6 pb-4  md:w-[500px]">
              <h1 className="mb-3 text-2xl font-bold">Sign Up</h1>
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
                            className="peer block w-full rounded-md border bg-zinc-50 px-2 py-[9px] sm:text-sm text-base outline-none placeholder:text-zinc-500"
                            id="username"
                            type="text"
                            name="username"
                            placeholder="Enter your username"
                            required
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Your username will be shared when sharing routes.
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="mt-4">
                      <FormLabel
                        htmlFor="password"
                        className="mb-3 mt-5 block text-xs font-medium text-zinc-400"
                      >
                        Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
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
                      <FormDescription>
                        {form.getValues("password") &&
                        form.getValues("password").length < 6
                          ? "Password must be at least 6 characters."
                          : ""}
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <Button
                  className="my-4 flex h-10 border-blue-600 w-full flex-row items-center justify-center rounded-md bg-[#6366f1] px-8 text-sm font-medium text-white shadow transition-colors hover:bg-[#4f46e5] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                  aria-disabled={pending}
                  disabled={pending}
                >
                  {pending ? <Loader className="animate-spin" /> : "Sign Up"}
                </Button>{" "}
              </div>
            </div>

            <Link
              to="/login"
              state={{ from: from }}
              className="flex flex-row gap-1 text-sm text-zinc-400 z-[1]"
            >
              Have an account?{" "}
              <div className="font-semibold underline">Log In</div>
            </Link>
          </form>
        </Form>
      </div>
    </>
  );
}
