import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setMsg("Login successful! Redirecting...");
      setTimeout(() => navigate("/onboarding"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 shadow-xl border border-border bg-card">
        <CardContent className="p-0">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required autoFocus className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="mt-1" />
            </div>
            <Button type="submit" className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            {msg && <div className="text-center mt-2 text-primary">{msg}</div>}
          </form>
          <div className="mt-4 text-center text-muted-foreground text-sm">
            Don't have an account? <a href="/signup" className="text-primary underline">Sign Up</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}