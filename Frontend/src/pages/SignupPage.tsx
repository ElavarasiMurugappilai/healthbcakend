import { useMemo, useState } from "react";
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
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Toaster, toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const genders = ["Female", "Male", "Non-binary", "Prefer not to say"] as const;

const SignupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  age: z
    .preprocess((v) => (v === '' || v === undefined || v === null ? undefined : v), z.coerce.number().int().min(1).max(120))
    .optional(),
  gender: z.enum(genders).optional(),
  primaryGoal: z.string().optional(),
  notes: z.string().optional(),
  consent: z.boolean().optional(),
});

type SignupForm = z.infer<typeof SignupSchema>;

export default function SignupPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<number>(1);
  const [conditionsText, setConditionsText] = useState("");
  const [goalsText, setGoalsText] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm<SignupForm>({
    resolver: zodResolver(SignupSchema) as Resolver<SignupForm>,
    defaultValues: {
      name: "",
      email: "",
      password: "",
      age: undefined,
      gender: undefined,
      primaryGoal: undefined,
      notes: "",
      consent: false,
    },
  });

  const passwordValue = watch("password") || "";

  const passwordStrength = useMemo(() => {
    let score = 0;
    if (passwordValue.length >= 6) score++;
    if (/[A-Z]/.test(passwordValue)) score++;
    if (/[0-9]/.test(passwordValue)) score++;
    if (/[^A-Za-z0-9]/.test(passwordValue)) score++;
    const labels = ["Weak", "Fair", "Good", "Strong"];
    return {
      label: score === 0 ? "Very weak" : labels[Math.min(score - 1, 3)],
      percent: Math.min((score / 4) * 100, 100),
    };
  }, [passwordValue]);

  const toArray = (value: string): string[] =>
    value
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

  const onSubmit: SubmitHandler<SignupForm> = async (data) => {
    setLoading(true);
    try {
      const payload = {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        password: passwordValue,
        age: typeof data.age === "number" ? data.age : undefined,
        gender: data.gender,
        medicalInfo: {
          conditions: toArray(conditionsText),
          goals: toArray(goalsText),
        },
        primaryGoal: data.primaryGoal,
        notes: data.notes,
        consent: Boolean(data.consent),
      };

      await api.post("/auth/signup", payload);
      toast.success("Signup successful! Redirecting to dashboard...", {
        duration: 1800,
        position: "top-center",
        style: { background: "linear-gradient(90deg,#fdf6e3,#e0f2fe)" },
      });
      setTimeout(() => navigate("/dashboard"), 900);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
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

  const stepPercent = step === 1 ? 33 : step === 2 ? 66 : 100;

  const nextFromStep1 = async () => {
    const valid = await trigger(["name", "email", "password"], { shouldFocus: true });
    if (valid) setStep(2);
  };
  const nextFromStep2 = () => setStep(3);
  const back = () => setStep((s) => Math.max(1, s - 1));

  const renderChips = (value: string) => {
    const items = toArray(value);
    if (items.length === 0) return null;
    return (
      <div className="mt-1 flex flex-wrap gap-2">
        {items.map((item) => (
          <Badge key={item} variant="secondary" className="px-2 py-1 text-xs">{item}</Badge>
        ))}
      </div>
    );
  };

  // Animation variants for step transitions
  const stepVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0, transition: { type: "spring" as const, duration: 0.5 } },
    exit: { opacity: 0, x: -40, transition: { duration: 0.3 } },
  };

  return (
    <>
      <Toaster richColors />
      <div className="min-h-screen w-full flex flex-col md:flex-row bg-gradient-to-br from-orange-50 via-sky-100 to-white dark:from-gray-900 dark:to-sky-900 transition-colors duration-700">
        {/* Left: Illustration/Copy */}
        <div className="flex flex-col justify-space-evenly items-center md:w-1/2 w-full py-8 px-4 bg-gradient-to-br from-orange-50 via-sky-100 to-white dark:from-gray-900 dark:to-sky-900 animate-gradient-move">
          <Card className="w-full max-w-md rounded-2xl shadow-none border-0 bg-transparent flex flex-col items-space-evenly">
            <CardHeader className="text-center">
              <CardTitle className="text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                Welcome To Health Dashboard 👋
              </CardTitle>
              <CardDescription className="mt-4 text-gray-700 dark:text-gray-200 text-lg max-w-xl">
                Track your glucose, medications, and goals—get insights and celebrate progress with your care team.
              </CardDescription>
            </CardHeader>
            <div className="w-full flex justify-center mt-6">
              <motion.div
                initial={{ scale: 0.9, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                className="w-40 h-40 rounded-full bg-gradient-to-br from-orange-200 via-sky-200 to-white flex items-center justify-center shadow-lg"
              >
                <span className="text-6xl" role="img" aria-label="Health">💡</span>
              </motion.div>
            </div>
          </Card>
        </div>
        {/* Right: Signup Wizard */}
        <div className="flex flex-col justify-content-startitems-center md:w-1/2 w-full py-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="w-full"
          >
            <Card className="w-full max-w-lg rounded-2xl shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/30">
              <CardContent className="p-6 sm:p-8 space-y-6">
                <div>
                  <Progress value={stepPercent} className="h-2 mb-4 transition-all duration-500" />
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Sign Up</h2>
                </div>
                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-5"
                      >
                        <Label className="text-base mb-2 block">Let’s get you started on your health journey 🚀</Label>
                        <div>
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="What should we call you?"
                            {...register("name")}
                            className="mt-1"
                            autoFocus
                          />
                          {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            {...register("email")}
                            className="mt-1"
                          />
                          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
                        </div>
                        <div>
                          <Label htmlFor="password">Set a strong password 🔒</Label>
                          <div className="relative">
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Minimum 6 characters"
                              {...register("password")}
                              className="mt-1 pr-20"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 px-2 text-xs"
                              onClick={() => setShowPassword((v) => !v)}
                              tabIndex={-1}
                            >
                              {showPassword ? "Hide" : "Show"}
                            </Button>
                          </div>
                          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
                          <div className="mt-2">
                            <Progress value={passwordStrength.percent} className="h-2 transition-all duration-500" />
                            <div className="mt-1 text-xs text-gray-500">Strength: {passwordStrength.label}</div>
                          </div>
                        </div>
                        <div className="flex justify-end">
                          <Button type="button" onClick={nextFromStep1} className="w-full sm:w-auto">Next</Button>
                        </div>
                      </motion.div>
                    )}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-5"
                      >
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="age">Age</Label>
                            <Input
                              id="age"
                              type="number"
                              placeholder="Optional"
                              {...register("age")}
                              className="mt-1"
                            />
                            {errors.age && <p className="mt-1 text-xs text-red-600">{errors.age.message as string}</p>}
                          </div>
                          <div>
                            <Label>Gender</Label>
                            <Select onValueChange={(v) => setValue("gender", v as SignupForm["gender"])}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {genders.map((g) => (
                                  <SelectItem key={g} value={g}>{g}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <Separator />
                        <div>
                          <Label htmlFor="conditions">Medical conditions (comma separated)</Label>
                          <Textarea
                            id="conditions"
                            placeholder="e.g., Diabetes, Hypertension"
                            value={conditionsText}
                            onChange={(e) => setConditionsText(e.target.value)}
                            className="mt-1"
                          />
                          {renderChips(conditionsText)}
                        </div>
                        <div>
                          <Label htmlFor="goals">Health goals (optional, comma separated)</Label>
                          <Textarea
                            id="goals"
                            placeholder="e.g., Lose weight, Improve sleep"
                            value={goalsText}
                            onChange={(e) => setGoalsText(e.target.value)}
                            className="mt-1"
                          />
                          {renderChips(goalsText)}
                        </div>
                        <div className="flex justify-between gap-2">
                          <Button type="button" variant="outline" onClick={back} className="w-1/2">Back</Button>
                          <Button type="button" onClick={nextFromStep2} className="w-1/2">Next</Button>
                        </div>
                      </motion.div>
                    )}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        variants={stepVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="space-y-5"
                      >
                        <div>
                          <Label>Primary goal</Label>
                          <Select onValueChange={(v) => setValue("primaryGoal", v)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose your primary goal" />
                            </SelectTrigger>
                            <SelectContent>
                              {["Weight management","Better sleep","Improve glucose control","Reduce stress","Increase activity","Custom"].map((opt) => (
                                <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="notes">Custom notes / preferences</Label>
                          <Textarea
                            id="notes"
                            placeholder="Anything we should know?"
                            {...register("notes")}
                            className="mt-1"
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="consent" onCheckedChange={(v) => setValue("consent", Boolean(v))} />
                          <Label htmlFor="consent">I agree to the Terms and Privacy Policy</Label>
                        </div>
                        <div className="flex justify-between gap-2">
                          <Button type="button" variant="outline" onClick={back} className="w-1/2">Back</Button>
                          <Button type="submit" disabled={loading} className="w-1/2">
                            {loading ? "Creating…" : "Create my account"}
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="underline">Login</a>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      {/* Animate gradient background */}
      <style>
        {`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradient-move 8s ease-in-out infinite;
        }
        `}
      </style>
    </>
  );
}