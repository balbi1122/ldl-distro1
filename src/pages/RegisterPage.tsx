import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Alert } from "../components/ui/alert";
import { Checkbox } from "../components/ui/checkbox";
import { isSupabaseConfigured } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

const schema = z
  .object({
    displayName: z
      .string()
      .min(2, "Display name must be at least 2 characters"),
    username: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .regex(/^[a-z0-9_]+$/, "Only lowercase letters, numbers, and underscores"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    agreeToRules: z.boolean().refine((v) => v, {
      message: "You must agree to the community rules",
    }),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const { signUp, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const agreeToRules = watch("agreeToRules");

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await signUp(
      data.email,
      data.password,
      data.username,
      data.displayName,
    );
    if (error) {
      setError(error.message);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-5xl">🎤</span>
          <h1 className="font-serif text-3xl font-bold text-foreground mt-4 mb-1">
            Join the Community
          </h1>
          <p className="text-muted-foreground">
            Create your free Swiftie account
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Demo Mode:</strong> Supabase not configured. Use the demo
              login on the{" "}
              <Link to="/login" className="underline">
                sign-in page
              </Link>{" "}
              to explore the portal.
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4 text-sm">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Taylor Fan"
                  className="mt-1"
                  {...register("displayName")}
                />
                {errors.displayName && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.displayName.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="swiftie_poet"
                  className="mt-1"
                  {...register("username")}
                />
                {errors.username && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.username.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="mt-1"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPw ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 8 characters"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat password"
                className="mt-1"
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-destructive text-xs mt-1">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            {/* Community rules */}
            <div className="bg-rose-50 border border-rose-200 rounded-lg p-4 text-sm">
              <p className="font-semibold text-foreground mb-2">
                Community Rules
              </p>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground text-xs">
                <li>Post only your own original work</li>
                <li>Do not reproduce Taylor Swift's copyrighted lyrics or music</li>
                <li>Be respectful to all community members</li>
                <li>Fan fiction / creative works inspired by her art are welcome</li>
              </ul>
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="agreeToRules"
                checked={agreeToRules}
                onCheckedChange={(v) =>
                  setValue("agreeToRules", v as boolean, {
                    shouldValidate: true,
                  })
                }
              />
              <Label
                htmlFor="agreeToRules"
                className="text-sm cursor-pointer leading-tight"
              >
                I agree to the community rules and confirm I will only post
                original, non-infringing content
              </Label>
            </div>
            {errors.agreeToRules && (
              <p className="text-destructive text-xs">
                {errors.agreeToRules.message}
              </p>
            )}

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 mt-2"
              disabled={isSubmitting || !isSupabaseConfigured}
            >
              {isSubmitting ? "Creating account…" : "Create Free Account"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
