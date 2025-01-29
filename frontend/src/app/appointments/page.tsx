"use client"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { DoctorCard } from "@/components/DoctorCard"
import { BookingModal } from "@/components/BookingModal"
import { Sidebar } from "@/components/sidebar"

export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Fetch doctors data from Supabase
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from("doctors")
        .select("id, name, specialty, available_days, time_slots, image_url")

      if (error) {
        console.error("Error fetching doctors:", error)
      } else {
        setDoctors(data)
      }
    }

    fetchDoctors()
  }, [])

  const handleBookAppointment = (doctor: any) => {
    setSelectedDoctor(doctor)
    setIsModalOpen(true)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    setSelectedDoctor(null)
  }

  const handleSuccessBooking = () => {
    setSuccessMessage("Appointment successfully booked!")
    setTimeout(() => {
      setSuccessMessage("")
    }, 3000) // Clear success message after 3 seconds
  }

  return (
    <div className="relative flex min-h-screen bg-gray-100">
      <Sidebar onOpenChange={setIsSidebarOpen} />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`flex-1 p-4 md:p-8 pl-20 md:pl-4 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl md:text-4xl font-bold mb-4 md:mb-8 text-indigo-800"
        >
          Book an Appointment
        </motion.h1>
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 md:mb-6 shadow-md"
            >
              {successMessage}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="space-y-4 md:space-y-6"
        >
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * (index + 1), duration: 0.5 }}
            >
              <DoctorCard
                name={doctor.name}
                specialty={doctor.specialty}
                imageUrl={doctor.image_url || "/placeholder.svg?height=100&width=100"}
                onBook={() => handleBookAppointment(doctor)}
              />
            </motion.div>
          ))}
        </motion.div>

        <BookingModal
          doctor={selectedDoctor}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleSuccessBooking}
        />
      </motion.div>
    </div>
  )
}

