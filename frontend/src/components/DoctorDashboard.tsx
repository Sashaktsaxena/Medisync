"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User,Video } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

import { Button } from "./ui/button";

// Rest of the code remains exactly the same...
interface Doctor {
  id: string;
  name: string;
  specialty: string;
  available_days: string[];
  time_slots: string[];
  image_url: string;
  email: string;
}

interface Appointment {
  id: string;
  patient_id: string;
  doctor_id: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  created_at: string;
  patient?: {
    Name?: string;
    Email?: string;
    id?:string 
  };
}

export default function DoctorDashboard() {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const router =useRouter();
  useEffect(() => {
    async function fetchDoctorData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("*")
          .eq("id", user.id)
          .single();

        if (doctorError) {
          console.error("Error fetching doctor data:", doctorError);
          return;
        }

        setDoctor(doctorData);

        const { data: appointmentsData, error: appointmentsError } =
          await supabase
            .from("appointments")
            .select(
              `
            *,
            patient:profiles(Name, Email,id)
          `
            )
            .eq("doctor_id", doctorData.id)
            .order("appointment_date", { ascending: true })
            .order("appointment_time", { ascending: true });

        if (appointmentsError) {
          console.error("Error fetching appointments:", appointmentsError);
          return;
        }

        setAppointments(appointmentsData);
      }
      setLoading(false);
    }

    fetchDoctorData();
  }, []);

  const formatDateTime = (date: string, time: string) => {
    // Split time into hours and minutes, handling AM/PM
    const [timeStr, period] = time.split(" ");
    const [hours, minutes] = timeStr.split(":");

    // Convert hours to 24-hour format if PM
    let hour = parseInt(hours);
    if (period === "PM" && hour !== 12) {
      hour += 12;
    } else if (period === "AM" && hour === 12) {
      hour = 0;
    }

    // Ensure two digits
    const formattedHour = hour.toString().padStart(2, "0");

    // Create proper ISO datetime string
    const isoDateTime = `${date}T${formattedHour}:${minutes}:00`;

    try {
      return new Date(isoDateTime).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Date not available";
    }
  };

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="flex justify-center items-center h-screen">
        No doctor data found.
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
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
                  <span>
                    {formatDateTime(
                      appointment.appointment_date,
                      appointment.appointment_time
                    )}
                  </span>
                  <Badge>{appointment.status}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4" />
                      <span>
                        {appointment.patient?.Name ||
                          appointment.patient?.Email ||
                          "Unknown Patient"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>{appointment.appointment_date}</span>
                      <Clock className="w-4 h-4 ml-4" />
                      <span>{appointment.appointment_time}</span>
                    </div>
                  </div>
                  {isAppointmentNow(appointment.appointment_date, appointment.appointment_time) && (
  <Button
    onClick={() => router.push(`/videodoc?patientId=${appointment.patient?.id}`)}
    className="flex items-center space-x-2"
  >
    <Video className="w-4 h-4" />
    <span>Start Call</span>
  </Button>
)}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}