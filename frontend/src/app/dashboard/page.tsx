"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { supabase } from "@/lib/supabaseClient"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, User, Video } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface UserDetails {
  name: string
  email: string
  phone: string
  createdAt: string
}

interface Appointment {
  id: string
  appointment_date: string
  appointment_time: string
  status: string
  patient?: {
    id: string
  }
  doctor: {
    name: string
    specialty: string
    id:string 
  }
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null)
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAppointmentNow = (date: string, time: string) => {
    const now = new Date();
    const [timeStr, period] = time.split(" ");
    const [hours, minutes] = timeStr.split(":");
    
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }
    const appointmentTime = new Date(date);
    appointmentTime.setHours(hour, parseInt(minutes), 0);
    const timeDiff = Math.abs(now.getTime() - appointmentTime.getTime());
    // Allow starting call 5 minutes before and up to 30 minutes after appointment time
    return timeDiff <= 30 * 60 * 1000 && now.getTime() >= appointmentTime.getTime() - 5 * 60 * 1000;
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError || !user) {
        console.error("Error fetching user:", userError)
        setLoading(false)
        return
      }

      const [profileData, appointmentsData] = await Promise.all([
        supabase
          .from("profiles")
          .select("Name, Email, Phone, created_at")
          .eq("id", user.id)
          .single(),
        
        supabase
          .from("appointments")
          .select(`
            id,
            appointment_date,
            appointment_time,
            status,
            doctor:doctors(name, specialty,id),
            patient:profiles(id)
          `)
          .eq("patient_id", user.id)
          .gte("appointment_date", new Date().toISOString().split('T')[0])
          .order("appointment_date", { ascending: true })
          .order("appointment_time", { ascending: true })
      ])

      if (profileData.data) {
        setUserDetails({
          name: profileData.data.Name || "N/A",
          email: profileData.data.Email || "N/A",
          phone: profileData.data.Phone || "N/A",
          createdAt: profileData.data.created_at || "N/A",
        })
      }

      if (appointmentsData.data) {
        setAppointments(appointmentsData.data)
      }

      setLoading(false)
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!userDetails) {
    return <div className="flex h-screen items-center justify-center">Failed to load user details.</div>
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onOpenChange={setIsSidebarOpen} />
      <main
        className={`flex-1 p-4 md:p-8 pl-20 md:pl-4 transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "md:ml-64" : "md:ml-16"
        }`}
      >
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-semibold">{userDetails.name}</p>
                <p>Email: {userDetails.email}</p>
                <p>Phone: {userDetails.phone}</p>
              </div>
              <div>
                <p>Account Created: {new Date(userDetails.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-2xl font-bold mb-4">Upcoming Appointments</h2>
        {appointments.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p>No upcoming appointments</p>
            </CardContent>
          </Card>
        ) : (
          appointments.map((appointment) => (
            <Card key={appointment.id} className="mb-4">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">
                       {appointment.doctor.name}
                    </h3>
                    <p className="text-gray-600">{appointment.doctor.specialty}</p>
                  </div>
                  <Badge variant={
                    appointment.status === "confirmed" ? "success" :
                    appointment.status === "pending" ? "warning" : "secondary"
                  }>
                    {appointment.status}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {appointment.appointment_date}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {appointment.appointment_time}
                  </div>
                  <div>
                    {/* {isAppointmentNow(appointment.appointment_date, appointment.appointment_time) && ( */}
                      <Button
                        onClick={() => router.push(`/consultation?doctorId=${appointment.doctor?.id}`)}
                        className="flex items-center space-x-2"
                      >
                        <Video className="w-4 h-4" />
                        <span>Start Call</span>
                      </Button>
                    {/* )} */}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </main>
    </div>
  )
}