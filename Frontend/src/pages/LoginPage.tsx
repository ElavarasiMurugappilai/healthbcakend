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
      setTimeout(() => navigate("/dashboard"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center text-foreground">Login</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
            <Label>Password</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} required />
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
            {msg && <div className="text-center mt-2 text-primary">{msg}</div>}
          </form>
          <div className="mt-4 text-center text-muted-foreground">
            Don't have an account? <a href="/signup" className="text-primary underline">Sign Up</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}