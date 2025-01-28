import { motion } from "framer-motion"
import { Calendar } from "lucide-react"

interface DoctorCardProps {
  name: string
  specialty: string
  imageUrl: string
  onBook: () => void
}

export const DoctorCard: React.FC<DoctorCardProps> = ({ name, specialty, imageUrl, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
    >
      <div className="flex items-center space-x-4">
        <img
          src={imageUrl || "/placeholder.svg"}
          alt={name}
          className="w-24 h-24 object-cover rounded-full border-4 border-indigo-100"
        />
        <div>
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <p className="text-indigo-600 font-medium">{specialty}</p>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex items-center text-gray-500">
          <Calendar className="w-5 h-5 mr-2" />
          <span>Available Today</span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            console.log("Button clicked")
            onBook()
          }}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition-colors duration-300"
        >
          Book Appointment
        </motion.button>
      </div>
    </motion.div>
  )
}

