import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Label } from "../components/ui/label";

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
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const res = await api.post("/auth/signup", {
        name: form.name,
        email: form.email,
        password: form.password,
        age: Number(form.age),
        gender: form.gender,
        medicalInfo: {
          conditions: form.conditions.split(",").map(s => s.trim()),
          goals: form.goals.split(",").map(s => s.trim()),
        },
      });
      setMsg("Signup successful! Redirecting...");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err: any) {
      setMsg(err.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="flex items-center justify-center min-h-screen bg-gray-200">
      <Card className="w-full max-w-md mx-auto p-6 shadow-lg">
        <CardContent>
          <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <Label>Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} required />
            <Label>Email</Label>
            <Input name="email" type="email" value={form.email} onChange={handleChange} required />
            <Label>Password</Label>
            <Input name="password" type="password" value={form.password} onChange={handleChange} required />
            <Label>Age</Label>
            <Input name="age" type="number" value={form.age} onChange={handleChange} required />
            <Label>Gender</Label>
            <select name="gender" value={form.gender} onChange={handleChange} required className="w-full p-2 border rounded">
              <option value="">Select</option>
              {genders.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
            <Label>Conditions (comma separated)</Label>
            <Input name="conditions" value={form.conditions} onChange={handleChange} />
            <Label>Goals (comma separated)</Label>
            <Input name="goals" value={form.goals} onChange={handleChange} />
            <Button type="submit" className="w-full mt-2" disabled={loading}>
              {loading ? "Signing up..." : "Sign Up"}
            </Button>
            {msg && <div className="text-center mt-2 text-primary">{msg}</div>}
          </form>
          <div className="mt-4 text-center">
            Already have an account? <a href="/login" className="text-primary underline">Login</a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}