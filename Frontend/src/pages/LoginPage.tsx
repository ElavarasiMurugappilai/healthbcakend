import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";
import { Switch } from "../components/ui/switch";

const LoginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginForm = z.infer<typeof LoginSchema>;

export default function LoginPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema) as Resolver<LoginForm>,
    defaultValues: { email: "", password: "" },
  });

  const onSubmit: SubmitHandler<LoginForm> = async (data) => {
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      if (remember) localStorage.setItem("remember", "1"); else localStorage.removeItem("remember");
      window.dispatchEvent(new Event("user-updated"));
      setMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/dashboard"), 600);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br bg-gradient-to-br from-gray-100 via-orange-50 to-sky-100 dark:from-gray-900 dark:to-sky-900">
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-8 py-10 px-4 sm:px-6 lg:px-8">
        {/* Left: Copy */}
        <div className="hidden md:flex flex-col justify-center">
          <Card className="shadow-none border-0 bg-transparent">
            <CardContent className="p-0">
              <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">Welcome back 👋</h1>
              <p className="mt-4 text-gray-700 text-lg max-w-xl">
                Hi there 👋, ready to take charge of your health today? Your dashboard keeps everything in one place – from your medications to your fitness goals. Let’s get started!
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Right: Form */}
        <div className="flex items-center">
          <Card className="w-full max-w-lg ml-auto shadow-xl bg-white/60 backdrop-blur-lg border border-white/30 p-8 ">
            <CardContent className="p-6 sm:p-8 space-y-4">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-gray-900">Login</h2>
                <p className="text-sm text-gray-600">Access your dashboard securely.</p>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="you@example.com" autoFocus {...register("email")} />
                  {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                </div>
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="Your password" {...register("password")} />
                    <Button
                      type="button"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs"
                      onClick={() => setShowPassword((v) => !v)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                  {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Switch id="remember" checked={remember} onCheckedChange={setRemember} />
                    <Label htmlFor="remember">Remember me</Label>
                  </div>
                  <a href="/forgot-password" className="text-sm underline">Forgot password?</a>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Logging in…" : "Log in"}
                </Button>

                {msg && (
                  <div className={`mt-2 rounded-md text-sm px-3 py-2 text-center ${msg.includes("successful") ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                    {msg}
                  </div>
                )}

                <Separator className="my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <Button variant="outline" onClick={() => (window.location.href = "/api/auth/oauth/google")}>Google</Button>
                 
                </div>

                <div className="text-center text-sm text-gray-600">
                  Don’t have an account? <a href="/signup" className="underline">Sign up</a>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}