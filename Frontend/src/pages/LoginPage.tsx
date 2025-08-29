import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api";
import { saveToken } from "../utils/auth";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Eye,
  EyeOff,
  Mail,
  Lock,
  Heart,
  Pill,
  Stethoscope,
  Droplets,
  Dumbbell,
  Activity,
  Zap,
  Star
} from "lucide-react";
import { Toaster, toast } from "sonner";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string()
    .min(6, "Password must be at least 6 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one lowercase letter, one uppercase letter, and one number"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema) as Resolver<LoginForm>,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", data);

    // Normalize user object
    const userData = {
      name: res.data.data.user?.name || "User",
      email: res.data.data.user?.email || "",
      avatar: res.data.data.user?.avatar || `https://ui-avatars.com/api/?name=${res.data.data.user?.name || "User"}`,
    };

    saveToken(res.data.data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    if (data.rememberMe) localStorage.setItem("remember", "1");
    else localStorage.removeItem("remember");

    // let App.tsx know user changed
    window.dispatchEvent(new Event("user-updated"));

    toast.success("Login successful! Redirecting to dashboard...", {
      duration: 1800,
      position: "top-center",
      style: { background: "linear-gradient(90deg,#fdf6e3,#e0f2fe)" },
    });

    setTimeout(() => navigate("/quiz"), 600);
  } catch (err: unknown) {
    interface ApiError {
      response?: {
        data?: {
          message?: string;
        };
      };
    }

    const errorMessage =
      (err as ApiError)?.response?.data?.message || "Login failed";
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
      <div className="auth-page min-h-screen w-screen relative overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-[#252545]">
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
            
            {/* Icon 8 - Star */}
            <div className="absolute top-1/6 right-1/3 text-blue-600/25 dark:text-blue-500/25 animate-float-medium">
              <Star size={20} />
            </div>
          </div>
        
        {/* Content Container */}
        <div className="relative z-20 min-h-screen flex flex-col lg:flex-row">
          {/* Left Side - Welcome Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center p-4 sm:p-6 lg:p-8 min-h-[25vh] lg:min-h-screen">
            <div className="max-w-md">
              <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 dark:text-white mb-2 sm:mb-3 leading-tight">
                Welcome back to{" "}
                <span className="text-orange-600 dark:text-orange-400">your health</span> 🚀
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Continue your health journey with personalized insights and progress tracking.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 flex items-start sm:items-center justify-center p-3 sm:p-4 lg:p-6 xl:p-8 py-6 sm:py-8 lg:py-12">
            <div className="w-full max-w-sm sm:max-w-md">
              <Card className="w-full shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-2 sm:pb-3">
                  <CardTitle className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
                    Welcome Back
                  </CardTitle>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Sign in to your account
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-2 sm:space-y-3 px-3 sm:px-4 lg:px-6 pb-4 sm:pb-6">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 sm:space-y-3">
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
                        className="h-8 sm:h-9 text-xs sm:text-sm border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        autoFocus
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
                          placeholder="Enter your password"
                          {...register("password")}
                          className="h-8 sm:h-9 pr-10 text-xs sm:text-sm border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 sm:h-7 sm:w-7 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={14} className="sm:w-4 sm:h-4" /> : <Eye size={14} className="sm:w-4 sm:h-4" />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs sm:text-sm">
                      <label className="flex items-center gap-1 sm:gap-2 text-gray-600 dark:text-gray-400">
                        <input
                          type="checkbox"
                          {...register("rememberMe")}
                          className="rounded border-gray-300 dark:border-gray-600 text-orange-500 focus:ring-orange-500 dark:focus:ring-orange-400 w-3 h-3 sm:w-4 sm:h-4"
                        />
                        <span className="text-xs sm:text-sm">Remember me</span>
                      </label>
                      <a 
                        href="#" 
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors text-xs sm:text-sm"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-8 sm:h-9 text-xs sm:text-sm bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  {/* Toggle to Signup */}
                  <div className="text-center pt-1 sm:pt-2">
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{" "}
                      <a 
                        href="/signup" 
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
                      >
                        Sign Up
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