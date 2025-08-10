'use client';
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Globe, BookOpen } from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional().default(false),
});

type FormValues = z.infer<typeof schema>;

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: "", password: "", remember: false } });

  const onSubmit = async (data: FormValues) => {
    // Demo only: show success UI. Hook up your auth here.
    await new Promise((r) => setTimeout(r, 600));
    toast({ title: "Welcome back!", description: `Signed in as ${data.email}` });
  };

  // Simple SEO
  useEffect(() => {
    const title = "Login | Modern Library";
    document.title = title;
    const desc = "Login to your account to access your dashboard and library.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", desc);
    // Canonical
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", window.location.href);
  }, []);

  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <main className="min-h-screen relative overflow-hidden bg-orange-50">
      {/* Ambient gradient canvas */}
      <div className="absolute inset-0 -z-10 bg-gradient-canvas" aria-hidden="true" />
      {/* Subtle vignette */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true"
           style={{ background: "radial-gradient(1200px 600px at 50% 10%, hsl(var(--ring)/0.12), transparent 60%)" }} />

      <section className="container py-16 md:py-24">
        <header className="mx-auto mb-10 max-w-md text-center animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">Login to your account</h1>
          <p className="mt-2 text-muted-foreground">Welcome back. Enter your details to continue.</p>
        </header>

          <div className="mx-auto grid max-w-5xl grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <aside className="order-1 md:order-1">
              <div className="relative overflow-hidden rounded-2xl bg-orange-500 text-white shadow-lg">
                <div className="absolute -top-1/2 -right-1/2 h-[300px] w-[300px] rounded-full bg-white/10 blur-2xl" aria-hidden="true" />
                <div className="relative p-8 md:p-10">
                  <BookOpen className="size-12 mb-4" aria-hidden="true" />
                  <h2 className="text-2xl font-semibold">Dive into your library</h2>
                  <p className="mt-2 text-white/90">Fast, secure access to your reading world.</p>
                </div>
              </div>
            </aside>

            <div className="order-2 md:order-2">
              <Card ref={cardRef} className="bg-white shadow-elevated animate-scale-in">
                <CardHeader>
                  <CardTitle>Welcome back</CardTitle>
                  <CardDescription>Enter your credentials to continue</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email address</Label>
                      <Input id="email" type="email" autoComplete="email" {...register("email")}
                        placeholder="you@example.com" aria-invalid={!!errors.email} />
                      {errors.email && (
                        <p className="text-sm text-destructive" role="alert">{errors.email.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <a href="#" className="text-sm text-primary underline-offset-4 hover:underline">Forgot password?</a>
                      </div>
                      <Input id="password" type="password" autoComplete="current-password" {...register("password")}
                        placeholder="••••••••" aria-invalid={!!errors.password} />
                      {errors.password && (
                        <p className="text-sm text-destructive" role="alert">{errors.password.message}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input id="remember" type="checkbox" className="h-4 w-4 rounded border-input" {...register("remember")} />
                      <Label htmlFor="remember" className="text-sm font-normal">Remember me</Label>
                    </div>

                    <Button type="submit" variant="hero" className="w-full hover-scale" disabled={isSubmitting}
                      aria-label="Login">
                      {isSubmitting ? "Signing in…" : "Login"}
                    </Button>

                    <div className="relative text-center">
                      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-border" aria-hidden="true" />
                      <span className="relative bg-card px-3 text-xs text-muted-foreground">or continue with</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <Button type="button" variant="outline" className="w-full"><Mail className="mr-2" /> Google</Button>
                      <Button type="button" variant="outline" className="w-full"><Globe className="mr-2" /> Facebook</Button>
                    </div>

                    <p className="text-sm text-muted-foreground text-center">
                      Don’t have an account?
                      <a className="ml-1 text-primary underline-offset-4 hover:underline" href="#">Sign up</a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
      </section>
    </main>
  );
};

export default Login;
