"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Brain } from "lucide-react";

export default function OnboardingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    class: "6",
    school: "",
    city: "",
    state: "",
    dob: ""
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save profile");
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 py-12 px-4 flex justify-center items-center">
      <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800 shadow-2xl">
        <CardContent className="p-8">
          <div className="flex flex-col flex-start mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight">Create your Identity</h1>
            <p className="text-zinc-400 mt-2">Finish setting up your profile to join battles.</p>
          </div>

          {error && <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Full Name</label>
                <Input name="name" required value={formData.name} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus-visible:ring-violet-500" placeholder="John Doe" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Class (6-12)</label>
                <select name="class" required value={formData.class} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 text-white h-12 rounded-xl px-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 appearance-none">
                  {[6, 7, 8, 9, 10, 11, 12].map(c => <option key={c} value={c}>Class {c}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">School Name</label>
                <Input name="school" required value={formData.school} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus-visible:ring-violet-500" placeholder="Delhi Public School" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">Date of Birth</label>
                <Input type="date" name="dob" required value={formData.dob} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus-visible:ring-violet-500 [color-scheme:dark]" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">City</label>
                <Input name="city" required value={formData.city} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus-visible:ring-violet-500" placeholder="Mumbai" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">State</label>
                <Input name="state" required value={formData.state} onChange={handleChange} className="bg-zinc-950 border-zinc-800 text-white h-12 rounded-xl focus-visible:ring-violet-500" placeholder="Maharashtra" />
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" disabled={loading} className="w-full h-14 bg-violet-600 hover:bg-violet-700 text-white font-bold rounded-xl text-lg">
                {loading ? "Saving..." : "Start Battling"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
