"use client"

import { useEffect, useState } from "react"
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { supabase } from "@/lib/supabaseClient"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Clock, User } from "lucide-react"
import { formatDateTime } from "@/lib/dateUtils"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Doctor {
  id: string
  name: string
  specialty: string
  available_days: string[]
  time_slots: string[]
  image_url: string
  email: string
}

interface Appointment {
  id: string
  patient_id: string
  doctor_id: string
  appointment_date: string
  appointment_time: string
  status: string
  created_at: string
  patient: {
    email: string
  }
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
//   const supabase = createClientComponentClient()

  useEffect(() => {
    async function fetchDoctorData() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("*")
          .eq("email", user.email)
          .single()

        if (doctorError) {
          console.error("Error fetching doctor data:", doctorError)
        } else {
          setDoctor(doctorData)

          const { data: appointmentsData, error: appointmentsError } = await supabase
            .from("appointments")
            .select("*, patient:auth.users(email)")
            .eq("doctor_id", doctorData.id)
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true })

          if (appointmentsError) {
            console.error("Error fetching appointments:", appointmentsError)
          } else {
            setAppointments(appointmentsData)
          }
        }
      }
      setLoading(false)
    }

    fetchDoctorData()
  }, [supabase])

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (!doctor) {
    return <div className="flex justify-center items-center h-screen">No doctor data found.</div>
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={doctor.image_url} alt={doctor.name} />
                <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{doctor.name}</CardTitle>
                <CardDescription>{doctor.specialty}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {doctor.available_days.map((day) => (
                <Badge key={day} variant="secondary">
                  {day}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
      <AnimatePresence>
        {appointments.map((appointment, index) => (
          <motion.div
            key={appointment.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="mb-4 hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{formatDateTime(appointment.appointment_date, appointment.appointment_time)}</span>
                  <Badge>{appointment.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4" />
                  <span>{appointment.patient.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{appointment.appointment_date}</span>
                  <Clock className="w-4 h-4 ml-4" />
                  <span>{appointment.appointment_time}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

