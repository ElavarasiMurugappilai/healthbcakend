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
import { Switch } from "../components/ui/switch";
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
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema) as Resolver<LoginForm>,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
  setLoading(true);
  try {
    const res = await api.post("/auth/login", data);

    // ✅ Normalize user object
    const userData = {
      name: res.data.user?.name || "User",
      email: res.data.user?.email || "",
      avatar: res.data.user?.avatar || `https://ui-avatars.com/api/?name=${res.data.user?.name || "User"}`,
    };

    saveToken(res.data.token);
    localStorage.setItem("user", JSON.stringify(userData));

    if (remember) localStorage.setItem("remember", "1");
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
            
            {/* Icon 8 - Star */}
            <div className="absolute top-1/6 right-1/3 text-blue-600/25 dark:text-blue-500/25 animate-float-medium">
              <Star size={20} />
            </div>
          </div>
        
        {/* Content Container */}
        <div className="relative z-20 h-full flex flex-col lg:flex-row">
          {/* Left Side - Welcome Content */}
          <div className="flex-1 flex flex-col justify-center items-center text-center p-6 lg:p-8">
            <div className="max-w-md">
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-orange-500/20 dark:bg-orange-400/20 flex items-center justify-center backdrop-blur-sm">
                  <Heart size={32} className="text-orange-600 dark:text-orange-400" />
                </div>
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-800 dark:text-white mb-4 leading-tight">
                Welcome back to{" "}
                <span className="text-orange-600 dark:text-orange-400">your health</span> 🚀
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Continue your health journey with personalized insights and progress tracking.
              </p>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="flex-1 flex items-center justify-center p-6 lg:p-8">
            <div className="w-full max-w-md">
              <Card className="w-full shadow-2xl border-0 bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                    Welcome Back
                  </CardTitle>
                  <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Sign in to your account
                  </p>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                          className="h-10 pr-12 border-gray-300 dark:border-gray-600 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-orange-500 dark:focus:ring-orange-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </Button>
                      </div>
                      {errors.password && (
                        <p className="text-xs text-red-600 dark:text-red-400">{errors.password.message}</p>
                      )}
                    </div>

                    {/* Remember Me & Forgot Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Switch 
                          id="remember" 
                          checked={remember} 
                          onCheckedChange={setRemember}
                        />
                        <Label htmlFor="remember" className="text-sm text-gray-700 dark:text-gray-300">
                          Remember me
                        </Label>
                      </div>
                      <a 
                        href="/forgot-password" 
                        className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium transition-colors"
                      >
                        Forgot password?
                      </a>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-full h-10 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      {loading ? "Signing In..." : "Sign In"}
                    </Button>
                  </form>

                  {/* Toggle to Signup */}
                  <div className="text-center pt-2">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Don't have an account?{" "}
                      <a 
                        href="/signup" 
                        className="text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-semibold transition-colors"
                      >
                        Create Account
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