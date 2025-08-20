
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const genders = ["Male", "Female", "Other"];

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: "",
    gender: "",
    conditions: "",
    goals: "",
    avatar: null as File | null,
    avatarUrl: ""
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === "avatar" && files && files[0]) {
      setForm(f => ({ ...f, avatar: files[0], avatarUrl: URL.createObjectURL(files[0]) }));
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      // Prepare form data for avatar upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      formData.append("password", form.password);
      formData.append("age", form.age);
      formData.append("gender", form.gender);
      formData.append("conditions", form.conditions);
      formData.append("goals", form.goals);
      if (form.avatar) formData.append("avatar", form.avatar);
      // Use multipart/form-data for avatar upload
      const res = await api.post("/auth/signup", formData, { headers: { "Content-Type": "multipart/form-data" } });
      localStorage.setItem("token", res.data.token);
      setMsg("Signup successful! Redirecting...");
      setTimeout(() => navigate("/onboarding"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <Card className="w-full max-w-sm p-6 shadow-xl border border-border bg-card">
        <CardContent className="p-0">
          <h2 className="text-2xl font-bold mb-6 text-center text-foreground">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="flex flex-col items-center gap-2 mb-2">
              <Avatar className="w-16 h-16">
                {form.avatarUrl ? (
                  <AvatarImage src={form.avatarUrl} alt={form.name || "Avatar"} />
                ) : (
                  <AvatarFallback>{form.name ? form.name[0] : "U"}</AvatarFallback>
                )}
              </Avatar>
              <Button type="button" variant="outline" className="text-xs px-2 py-1 mt-1" onClick={() => fileInputRef.current?.click()}>
                Upload Photo
              </Button>
              <Input
                ref={fileInputRef}
                name="avatar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label htmlFor="name" className="text-foreground">Name</Label>
              <Input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="age" className="text-foreground">Age</Label>
              <Input id="age" name="age" type="number" value={form.age} onChange={handleChange} required className="mt-1" />
            </div>
            <div>
              <Label htmlFor="gender" className="text-foreground">Gender</Label>
              <select id="gender" name="gender" value={form.gender} onChange={handleChange} required className="w-full mt-1 p-2 border rounded bg-background text-foreground">
                <option value="">Select</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <Label htmlFor="conditions" className="text-foreground">Conditions (comma separated)</Label>
              <Input id="conditions" name="conditions" value={form.conditions} onChange={handleChange} className="mt-1" />
            </div>
            <div>
              <Label htmlFor="goals" className="text-foreground">Goals (comma separated)</Label>
              <Input id="goals" name="goals" value={form.goals} onChange={handleChange} className="mt-1" />
            </div>
            <Button type="submit" className="w-full mt-2 bg-primary text-primary-foreground hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            {msg && <div className="text-center mt-2 text-primary">{msg}</div>}
          </form>
          <div className="mt-4 text-center text-muted-foreground text-sm">
            Already have an account? <a href="/login" className="text-primary underline">Login</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}