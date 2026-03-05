import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "../services/api";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";

// 1. กำหนด Schema สำหรับ Validate ข้อมูล
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsLoading(true);

    const loginPromise = api.post("/login.php", values);

    toast.promise(loginPromise, {
      loading: "Signing in...",
      success: (response) => {
        if (response.data.token) {
          localStorage.setItem("token", response.data.token);
          navigate("/dashboard");
          return "Welcome back!";
        }
        return "Logged in successfully";
      },
      error: (err) => {
        return err.response?.data?.message || "Login failed. Please check your credentials.";
      },
    });

    try {
      await loginPromise;
    } catch {
      // Error is handled by toast.promise
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-pink-50 px-4">
      <Card className="w-full max-w-md border-none bg-white/70 backdrop-blur-xl shadow-2xl shadow-orange-100 rounded-[2rem] p-6">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-2xl w-fit shadow-lg mb-4">
            <Zap className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access the ERP</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="email" render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="admin@tcl.com" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full rounded-xl h-11 bg-gradient-to-r from-orange-500 to-pink-600 font-bold hover:scale-[1.02] transition-transform"
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}