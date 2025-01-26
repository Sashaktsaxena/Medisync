"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { LoginForm } from "@/components/LoginForm"
import { SignupForm } from "@/components/SignupForm"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-teal-100">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden flex max-w-4xl w-full">
        <div className="w-1/2 p-8 flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <LoginForm key="login" onSwitchToSignup={() => setIsLogin(false)} />
            ) : (
              <SignupForm key="signup" onSwitchToLogin={() => setIsLogin(true)} />
            )}
          </AnimatePresence>
        </div>
        <div className="w-1/2 bg-primary p-8 flex flex-col justify-center items-center text-white">
          <h1 className="text-4xl font-bold mb-4">Welcome to Medisync</h1>
          <p className="text-lg text-center mb-8">
            Your trusted platform for seamless medical synchronization and collaboration.
          </p>
          <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
            {/* You can add a medical-themed SVG or icon here */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-32 h-32"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}

