import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import api from "../services/api"; // นำเข้า Axios instance
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus } from "lucide-react";

// 1. กำหนด Schema พร้อมการตรวจสอบ Password Match
const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const onSubmit = async (values: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    // แยก confirmPassword ออกก่อนส่งไป Backend
    const { confirmPassword, ...registerData } = values;
    
    // เรียกใช้ API จริง
    const registerPromise = api.post("/register.php", registerData);

    toast.promise(registerPromise, {
      loading: "Creating your account...",
      success: () => {
        navigate("/login");
        return "Account created successfully! Please login.";
      },
      error: (err) => err.response?.data?.message || "Something went wrong.",
    });

    try {
      await registerPromise;
    } catch {
      // Error handled by toast.promise
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-orange-50 via-white to-pink-50 px-4">
      <Card className="w-full max-w-md border-none bg-white/70 backdrop-blur-xl shadow-2xl shadow-orange-100 rounded-[2rem] p-6">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto bg-gradient-to-br from-orange-400 to-pink-500 p-3 rounded-2xl w-fit shadow-lg mb-4">
            <UserPlus className="text-white w-6 h-6" />
          </div>
          <CardTitle className="text-2xl font-black">Create Account</CardTitle>
          <CardDescription>Join the Thai Creative Lighting ERP</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField control={form.control} name="name" render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
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
              <FormField control={form.control} name="confirmPassword" render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
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
                {isLoading ? "Creating..." : "Sign Up"}
              </Button>
            </form>
          </Form>
          <div className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}
            <Link to="/login" className="font-bold text-orange-600 hover:underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}