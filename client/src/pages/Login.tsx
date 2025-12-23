import { useAuth } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "@shared/routes";
import { z } from "zod";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { useEffect } from "react";

type LoginForm = z.infer<typeof api.auth.login.input>;

export default function Login() {
  const { login, isLoggingIn, user } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (user) {
      setLocation("/admin");
    }
  }, [user, setLocation]);

  const form = useForm<LoginForm>({
    defaultValues: { username: "", password: "" }
  });

  const onSubmit = (data: LoginForm) => {
    login(data).catch((e) => {
      console.error(e);
      form.setError("root", { message: e.message });
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md space-y-8 bg-card p-8 rounded-lg border border-white/5 shadow-2xl"
      >
        <div className="text-center">
          <h1 className="text-3xl font-display font-bold">Admin Access</h1>
          <p className="text-muted-foreground mt-2">Enter credentials to manage content.</p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              {...form.register("username")} 
              className="bg-background/50" 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password" 
              {...form.register("password")} 
              className="bg-background/50" 
            />
          </div>

          {form.formState.errors.root && (
            <div className="text-red-500 text-sm text-center">
              {form.formState.errors.root.message}
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary text-black hover:bg-white transition-colors font-bold"
            disabled={isLoggingIn}
          >
            {isLoggingIn ? "Authenticating..." : "Login"}
          </Button>
        </form>
        
        <div className="text-center">
          <button onClick={() => setLocation("/")} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
}
