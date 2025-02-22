import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { supabase } from "@/lib/supabaseClient"
import { X, Calendar, Clock, User } from "lucide-react"

interface BookingModalProps {
  doctor?: {
    id: string
    name: string
    specialty: string
    image_url: string
    available_days: string[]
    time_slots: string[]
  } | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  doctor, 
  isOpen, 
  onClose, 
  onSuccess 
}) => {
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [availableDates, setAvailableDates] = useState<{ day: string, date: string }[]>([])

  // Reset selections when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedDay(null)
      setSelectedTime(null)
    }
  }, [isOpen])

  useEffect(() => {
    const generateAvailableDates = () => {
      if (!doctor?.available_days?.length) {
        setAvailableDates([])
        return
      }

      const dates: { day: string, date: string }[] = []
      const today = new Date()
      
      for (let i = 0; i < 30; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' })
        
        if (doctor.available_days.includes(dayName)) {
          dates.push({
            day: dayName,
            date: date.toISOString().split('T')[0]
          })
        }
      }
      
      setAvailableDates(dates)
    }

    if (isOpen && doctor) {
      generateAvailableDates()
    }
  }, [doctor, isOpen])

  const handleBooking = async () => {
    if (!doctor) {
      alert("No doctor selected")
      return
    }

    if (!selectedDay || !selectedTime) {
      alert("Please select both a day and time.")
      return
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      alert("Unable to fetch user information. Please log in.")
      return
    }

    try {
      const { error } = await supabase.from("appointments").insert([
        {
          patient_id: user.id,
          doctor_id: doctor.id,
          appointment_date: selectedDay,
          appointment_time: selectedTime,
          status: "booked",
        },
      ])

      if (error) {
        console.error("Error booking appointment:", error.message)
        alert(`Failed to book appointment: ${error.message}`)
      } else {
        alert("Appointment successfully booked!")
        onSuccess()
        onClose()
      }
    } catch (err) {
      console.error("Unexpected error:", err)
      alert("An unexpected error occurred while booking the appointment.")
    }
  }

  if (!doctor) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-6 h-6" />
            </button>

            <h2 className="text-2xl font-bold mb-4 text-indigo-800">Book Appointment</h2>
            
            <div className="flex items-center space-x-4 mb-6">
              <img
                src={doctor?.image_url || "/placeholder.svg"}
                alt={doctor?.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-lg">{doctor?.name}</h3>
                <p className="text-indigo-600">{doctor?.specialty}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-1">
                  Select Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <select
                    id="day"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                    onChange={(e) => setSelectedDay(e.target.value)}
                    value={selectedDay || ""}
                  >
                    <option value="">Select Date</option>
                    {availableDates.map((dateObj) => (
                      <option key={dateObj.date} value={dateObj.date}>
                        {dateObj.date} ({dateObj.day})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {selectedDay && (
                <div>
                  <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-1">
                    Select Time
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      id="time"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none"
                      onChange={(e) => setSelectedTime(e.target.value)}
                      value={selectedTime || ""}
                    >
                      <option value="">Select Time</option>
                      {doctor?.time_slots?.map((time) => (
                        <option key={time} value={time}>
                          {time}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {selectedDay && selectedTime && (
                <div className="flex justify-end space-x-2 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                    onClick={onClose}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-200"
                    onClick={handleBooking}
                  >
                    Book Appointment
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}