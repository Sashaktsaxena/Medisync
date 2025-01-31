import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabaseClient"
import { useRouter } from "next/navigation"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [loginType, setLoginType] = useState("patient")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      if (loginType === "doctor") {
        // Query the doctors table for matching email
        const { data: doctor, error: doctorError } = await supabase
          .from("doctors")
          .select("*")
          .eq("email", email)
          .single();
  
        if (doctorError || !doctor) {
          setError("Doctor not found");
          return;
        }
  
        // Verify password
        if (doctor.password !== password) {
          setError("Invalid credentials");
          return;
        }
  
        console.log("Doctor login successful");
        router.push("/doctor"); // Redirect to doctor dashboard
      } else {
        // Patient login via Supabase Auth
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
  
        if (loginError) {
          setError(loginError.message);
        } else {
          console.log("Patient login successful");
          router.push("/Symptom"); // Redirect to patient dashboard
        }
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setLoading(false);
    }
  };
  

  const handleTabChange = (value: string) => {
    setLoginType(value)
    setEmail("")
    setPassword("")
    setError(null)
  }

  return (
    <div
      className="w-full max-w-md transform transition-all duration-500 ease-in-out"
      style={{
        opacity: 1,
        transform: "translateX(0)",
        animation: "slideIn 0.5s ease-out"
      }}
    >
      <h2 className="text-3xl font-bold mb-6 text-center text-primary">Login to Medisync</h2>
      
      <Tabs defaultValue="patient" className="w-full mb-6" onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="patient">Patient Login</TabsTrigger>
          <TabsTrigger value="doctor">Doctor Login</TabsTrigger>
        </TabsList>

        <TabsContent value="patient" className="mt-4">
          <p className="text-sm text-gray-600 mb-4 text-center">Login as a patient to access your health records</p>
        </TabsContent>
        
        <TabsContent value="doctor" className="mt-4">
          <p className="text-sm text-gray-600 mb-4 text-center">Login as a doctor to manage your patients</p>
        </TabsContent>
      </Tabs>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full"
            placeholder={`Enter your ${loginType} email`}
          />
        </div>
        
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : `Login as ${loginType}`}
        </Button>
      </form>

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <button
          onClick={onSwitchToSignup}
          className="text-primary hover:underline focus:outline-none"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}

export default LoginForm