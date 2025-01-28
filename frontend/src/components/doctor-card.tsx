import Image from "next/image"
import { Button } from "@/components/ui/button"

interface DoctorCardProps {
  name: string
  specialty: string
  imageUrl: string
}

export function DoctorCard({ name, specialty, imageUrl }: DoctorCardProps) {
  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-md w-full">
      <Image
        src={imageUrl || "/placeholder.svg"}
        alt={`Dr. ${name}`}
        width={120}
        height={120}
        className="rounded-lg mr-6"
      />
      <div className="flex-grow">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">{specialty}</p>
      </div>
      <Button>Book Appointment</Button>
    </div>
  )
}

