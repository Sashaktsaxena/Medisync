"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Navbar from "@/components/ui/Navbar"
import { FloatingNav } from "@/components/ui/floating-navbar"
import { FileText, MessageSquare, Stethoscope, Watch, Phone, Video, Send, Camera } from "lucide-react"
import Link from "next/link"

const navItems = [
  { name: "Home", link: "#home" },
  { name: "Features", link: "#features" },
  { name: "Contact", link: "#contact" }
]

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <FloatingNav navItems={navItems} />
      <main className="flex-1">
        <section id="home" className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-blue-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Welcome to Medisync
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl">
                  Your AI-powered medical companion for personalized healthcare solutions.
                </p>
              </div>
              <div className="space-x-4">
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Our Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureCard icon={<FileText className="h-10 w-10 mb-4 text-blue-500" />} title="Prescription Analysis" description="Upload your prescription for AI-powered analysis and information." />
              <FeatureCard icon={<MessageSquare className="h-10 w-10 mb-4 text-green-500" />} title="AI Chatbot" description="Get help for minor injuries with our sentiment-analyzing chatbot." />
              <FeatureCard icon={<Stethoscope className="h-10 w-10 mb-4 text-purple-500" />} title="Symptom Checker" description="Enter your symptoms to get probable disease information." />
              <FeatureCard icon={<Watch className="h-10 w-10 mb-4 text-indigo-500" />} title="Health Tracking" description="Track your health metrics using wearable devices." />
              <FeatureCard icon={<Phone className="h-10 w-10 mb-4 text-red-500" />} title="Emergency Assistance" description="One-click emergency ambulance calling feature." />
              <FeatureCard icon={<Video className="h-10 w-10 mb-4 text-yellow-500" />} title="Virtual Consultation" description="Connect with healthcare professionals via video calls." />
              <FeatureCard icon={<Camera className="h-10 w-10 mb-4 text-pink-500" />} title="Rash & Injury Analysis" description="Upload photos of rashes or injuries for AI-powered diagnosis and treatment suggestions." />
            </div>
          </div>
        </section>
        <section id="contact" className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">Contact Us</h2>
            <form className="max-w-md mx-auto space-y-4">
              <Input placeholder="Your Name" />
              <Input type="email" placeholder="Your Email" />
              <Textarea placeholder="Your Message" />
              <Button className="w-full">
                Send Message
                <Send className="ml-2 h-4 w-4" />
              </Button>
            </form>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-gray-500">© 2024 Medisync. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
      {icon}
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  )
}