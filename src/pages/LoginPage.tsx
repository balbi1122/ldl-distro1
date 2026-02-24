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
import { isSupabaseConfigured } from "../lib/supabase";
import { Eye, EyeOff } from "lucide-react";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const { signIn, demoLogin } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setError("");
    const { error } = await signIn(data.email, data.password);
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
            Welcome Back
          </h1>
          <p className="text-muted-foreground">
            Sign in to your Swiftie account
          </p>
        </div>

        <div className="bg-card border rounded-2xl p-8 shadow-sm">
          {!isSupabaseConfigured && (
            <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
              <strong>Demo Mode:</strong> Supabase is not configured. Use the
              demo login buttons below to explore the portal.
            </div>
          )}

          {error && (
            <Alert variant="destructive" className="mb-4 text-sm">
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  onClick={() => setShowPw(!showPw)}
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-destructive text-xs mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90"
              disabled={isSubmitting || !isSupabaseConfigured}
            >
              {isSubmitting ? "Signing in…" : "Sign In"}
            </Button>
          </form>

          {!isSupabaseConfigured && (
            <div className="mt-4 space-y-2">
              <p className="text-xs text-center text-muted-foreground">Demo quick-login:</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    demoLogin("user");
                    navigate("/");
                  }}
                >
                  Demo User
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    demoLogin("admin");
                    navigate("/admin");
                  }}
                >
                  Demo Admin
                </Button>
              </div>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-primary font-medium hover:underline"
            >
              Join free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
