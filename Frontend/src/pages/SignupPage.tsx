import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { 
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  Pill,
  Stethoscope,
  Droplets,
  Dumbbell,
  Heart,
  Activity,
  Zap
} from "lucide-react";

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupForm = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema) as Resolver<SignupForm>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const res = await api.post("/auth/signup", payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      window.dispatchEvent(new Event("user-updated"));
      
      toast.success("Signup successful! Redirecting to dashboard...", {
        duration: 1800,
        position: "top-center",
        style: { background: "linear-gradient(90deg,#fdf6e3,#e0f2fe)" },
      });
      setTimeout(() => navigate("/quiz"), 900);
    } catch (err: unknown) {
      interface ApiError {
        response?: {
          data?: {
            message?: string;
            error?: string;
          };
        };
      }
      
      const errorMessage =
        (err as ApiError)?.response?.data?.message ||
        (err as ApiError)?.response?.data?.error ||
        (err as Error)?.message ||
        "Signup failed.";
      toast.error(errorMessage, {
        duration: 2200,
        position: "top-center",
        style: { background: "linear-gradient(90deg,#fee2e2,#e0f2fe)" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toaster richColors />
      <div className="auth-page h-screen w-screen relative overflow-hidden bg-gray-100 dark:bg-[#252545]">
        {/* Full Screen Background - Consistent with dashboard */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-blue-50 to-orange-50 dark:from-[#252545] dark:via-[#1e1e3a] dark:to-[#2a2a4a] animate-gradient-shift"></div>
        
                  {/* Floating Animated Icons */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {/* Icon 1 - Pill */}
            <div className="absolute top-1/4 left-1/4 text-orange-500/30 dark:text-orange-400/30 animate-float-slow">
              <Pill size={32} />
            </div>
            
            {/* Icon 2 - Stethoscope */}
            <div className="absolute top-1/3 right-1/4 text-blue-500/25 dark:text-blue-400/25 animate-float-medium">
              <Stethoscope size={28} />
            </div>
            
            {/* Icon 3 - Droplets */}
            <div className="absolute bottom-1/3 left-1/3 text-blue-600/35 dark:text-blue-500/35 animate-float-fast">
              <Droplets size={24} />
            </div>
            
            {/* Icon 4 - Dumbbell */}
            <div className="absolute bottom-1/4 right-1/3 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
              <Dumbbell size={36} />
            </div>
            
            {/* Icon 5 - Heart */}
            <div className="absolute top-1/2 left-1/6 text-orange-500/30 dark:text-orange-400/30 animate-float-medium">
              <Heart size={26} />
            </div>
            
            {/* Icon 6 - Activity */}
            <div className="absolute top-2/3 right-1/6 text-blue-500/25 dark:text-blue-400/25 animate-float-fast">
              <Activity size={30} />
            </div>
            
            {/* Icon 7 - Zap */}
            <div className="absolute bottom-1/3 right-1/2 text-orange-600/20 dark:text-orange-500/20 animate-float-slow">
              <Zap size={22} />
            </div>
          </div>
        
        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col lg:flex-row">
          {/* Left Side - Welcome Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 lg:p-8">
            <div className="max-w-md">
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                Track your health,{" "}
                <span className="text-orange-600 dark:text-orange-400">achieve your goals</span> 🚀
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Join thousands of users managing their health journey with our comprehensive dashboard.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              <Card className="w-full shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    Create Account
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Start your health journey today
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name Field */}
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <User size={16} className="text-orange-500 dark:text-orange-400" />
                        Full Name
                      </Label>
                      <Input
                        id="name"
                        placeholder="Enter your full name"
                        {...register("name")}
                        className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {errors.name && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.name.message}</p>
                      )}
                    </div>

                    {/* Email Field */}
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Mail size={16} className="text-orange-500 dark:text-orange-400" />
                        Email Address
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        className="h-10 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.email.message}</p>
                      )}
                    </div>

                    {/* Password Field */}
                    <div className="space-y-1">
                      <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Lock size={16} className="text-orange-500 dark:text-orange-400" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          {...register("password")}
                          className="h-10 pr-12 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setShowPassword((v) => !v)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {loading ? "Creating Account..." : "Create Account"}
                    </Button>
                  </form>

                  {/* Toggle to Login */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Already have an account?{" "}
                      <a 
                        href="/login" 
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
                      >
                        Sign In
                      </a>
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}