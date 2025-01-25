"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Navbar from "@/components/Navbar"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
}

// Mock symptoms data (usually this would come from an API)
const symptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Fatigue",
  "Shortness of breath",
  "Nausea",
  "Dizziness",
  "Sore throat",
  "Runny nose",
  "Body aches",
]

// SymptomInput component
function SymptomInput({ onAddSymptom }: { onAddSymptom: (symptom: string) => void }) {
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (input.length > 1) {
        // Simulating API call with local filtering
        const filteredSymptoms = symptoms.filter((symptom) => symptom.toLowerCase().includes(input.toLowerCase()))
        setSuggestions(filteredSymptoms)
      } else {
        setSuggestions([])
      }
    }

    fetchSuggestions()
  }, [input])

  const handleAddSymptom = (symptom: string) => {
    onAddSymptom(symptom)
    setInput("")
    setSuggestions([])
    inputRef.current?.focus()
  }

  return (
    <div className="relative">
      <input
        ref={inputRef}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your symptoms..."
        className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <AnimatePresence>
        {suggestions.length > 0 && (
          <motion.ul
            className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {suggestions.map((suggestion, index) => (
              <motion.li
                key={suggestion}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: index * 0.05 }}
                className="p-3 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleAddSymptom(suggestion)}
              >
                {suggestion}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}

// SymptomList component
function SymptomList({
  symptoms,
  onRemoveSymptom,
}: { symptoms: string[]; onRemoveSymptom: (symptom: string) => void }) {
  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Selected Symptoms:</h2>
      <AnimatePresence>
        {symptoms.map((symptom) => (
          <motion.div
            key={symptom}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-block bg-blue-100 text-blue-800 rounded-full px-4 py-2 m-1"
          >
            {symptom}
            <button
              onClick={() => onRemoveSymptom(symptom)}
              className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none"
            >
              &times;
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

// Main component
export default function Home() {
  const [symptoms, setSymptoms] = useState<string[]>([])

  const addSymptom = (symptom: string) => {
    if (!symptoms.includes(symptom)) {
      setSymptoms([...symptoms, symptom])
    }
  }

  const removeSymptom = (symptom: string) => {
    setSymptoms(symptoms.filter((s) => s !== symptom))
  }

  const handleSend = () => {
    console.log("Sending symptoms:", symptoms)
    // Here you would typically send the data to your backend
    alert("Symptoms sent successfully!")
    setSymptoms([])
  }

  return (
    <>
    <Navbar/>
    <div className="h-[30rem] bg-gradient-to-br from-blue-100 to-teal-100 flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl"
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-8 text-blue-600"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          MediSync
        </motion.h1>
        <SymptomInput onAddSymptom={addSymptom} />
        <SymptomList symptoms={symptoms} onRemoveSymptom={removeSymptom} />
        <motion.button
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSend}
        >
          Send Symptoms
        </motion.button>
      </motion.div>
    </div>
    </>
  )
}

