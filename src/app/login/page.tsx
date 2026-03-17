"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Brain, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"PHONE" | "OTP">("PHONE");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep("OTP");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Verification failed");

      if (data.needsOnboarding) {
        router.push("/onboarding");
      } else {
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-violet-600/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-violet-900/20 via-zinc-950 to-zinc-950" />

      <Card className="w-full max-w-md bg-zinc-900/80 border-zinc-800 backdrop-blur-xl z-10 shadow-2xl">
        <CardContent className="pt-8 pb-8 px-6 sm:px-10">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 p-3 rounded-2xl mb-4 shadow-lg shadow-violet-500/20">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Enter the Arena</h1>
            <p className="text-zinc-400 text-sm mt-2 text-center">
              {step === "PHONE" ? "Enter your phone number to get an OTP" : "Enter the verification code sent to your phone"}
            </p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-xl text-sm mb-6 text-center">{error}</div>}

          {step === "PHONE" ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="10-digit Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 h-14 text-center text-lg text-white placeholder:text-zinc-600 rounded-xl focus-visible:ring-violet-500"
                  required
                  maxLength={10}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-lg group"
                disabled={loading || phone.length < 10}
              >
                {loading ? "Sending..." : "Send OTP"}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter OTP (123456)"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="bg-zinc-950 border-zinc-800 h-14 text-center text-2xl tracking-widest text-white placeholder:text-zinc-600 rounded-xl focus-visible:ring-violet-500"
                  required
                  maxLength={6}
                />
              </div>
              <Button
                type="submit"
                className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl text-lg"
                disabled={loading || otp.length < 6}
              >
                {loading ? "Verifying..." : "Verify & Play"}
              </Button>
              <button
                type="button"
                onClick={() => setStep("PHONE")}
                className="w-full text-zinc-400 text-sm mt-4 hover:text-white transition-colors"
              >
                Change Phone Number
              </button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
