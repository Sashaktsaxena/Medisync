"use client"

import { useState, useEffect } from "react"
import { Stethoscope, Menu, X } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <div className="min-h-36 bg-gradient-to-br from-blue-200 to-white-100 p-4 flex flex-col items-center justify-center">
        <div className="bg-white-200 w-full rounded-3xl border border-black min-h-[90px] shadow-xl shadow-black flex justify-between items-center p-5">
          <div className="flex items-center">
            <Stethoscope className="h-6 w-6" />
            <span className="ml-2 text-2xl font-bold hidden sm:inline">Medisync</span>
          </div>
          <div className="text-black font-bold text-3xl"></div>
          <nav className="hidden sm:flex space-x-4 text-xl text-black">
            <Link href="#" className="hover:text-gray-300 text-black">
              Home
            </Link>
            <Link href="#" className="hover:text-gray-300 text-black">
              About
            </Link>
            <Link href="#" className="hover:text-gray-300 text-black">
              Services
            </Link>
            <Link href="#" className="hover:text-gray-300 text-black">
              Contact
            </Link>
          </nav>
          <div className="sm:hidden">
            <button onClick={() => setIsOpen(true)} className="text-black">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Sliding drawer */}
      <div
        className={`fixed inset-y-0 right-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} sm:hidden`}
      >
        <div className="p-5">
          <button onClick={() => setIsOpen(false)} className="absolute top-5 right-5 text-black">
            <X className="h-6 w-6" />
          </button>
          <nav className="flex flex-col space-y-4 mt-10">
            <Link href="#" className="text-xl text-black hover:text-gray-300">
              Home
            </Link>
            <Link href="#" className="text-xl text-black hover:text-gray-300">
              About
            </Link>
            <Link href="#" className="text-xl text-black hover:text-gray-300">
              Services
            </Link>
            <Link href="#" className="text-xl text-black hover:text-gray-300">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 sm:hidden" onClick={() => setIsOpen(false)}></div>
      )}
    </>
  )
}

