"use client";

import { useState } from "react";
import api from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { motion } from "framer-motion";

import { Space_Grotesk } from "next/font/google";
import { useRouter } from "next/navigation";

const grotesk = Space_Grotesk({ subsets: ["latin"] });

export default function LoginPage() {
  const setToken = useAuthStore((s) => s.setToken);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);

      const res = await api.post("/auth/login", {
        email,
        password,
      });

      setToken(res.data.data.token);
      localStorage.setItem("token", res.data.data.token);
      router.push("/dashboard");
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white"
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.06),transparent_50%)]" />

      <div className="w-full max-w-md px-6">
        <div className="mb-10 text-center">
          <h1
            className={`text-4xl font-semibold tracking-tight ${grotesk.className}`}
          >
            TaskFlow
          </h1>
          <p className="text-sm text-gray-500 mt-2">Sign in to continue</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="bg-white/4 border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
        >
          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Email</Label>
              <Input
                className="bg-transparent border-white/10 focus:border-white/40 focus:ring-0 text-sm"
                placeholder="you@example.com"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs text-gray-400">Password</Label>
              <Input
                className="bg-transparent border-white/10 focus:border-white/40 focus:ring-2 focus:ring-white/10 transition-all text-sm"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <Button
              className="w-full bg-white text-black hover:bg-gray-200 transition-all rounded-xl hover:scale-[1.02] active:scale-[0.98]"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? "Signing in..." : "Continue"}
            </Button>
          </div>
        </motion.div>

        <p className="text-center text-xs text-gray-500 mt-6">
          Designed for clarity. Built for speed.
        </p>
      </div>
    </motion.div>
  );
}
