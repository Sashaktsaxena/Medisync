"use client"
import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { DoctorCard } from "@/components/doctor-card";
import { supabase } from "@/lib/supabaseClient"
// Initialize Supabase Client


export default function AppointmentsPage() {
  const [doctors, setDoctors] = useState([]);

  // Fetch doctors data from Supabase
  useEffect(() => {
    const fetchDoctors = async () => {
      const { data, error } = await supabase
        .from('doctors')
        .select('name, specialty, image_url');

      if (error) {
        console.error('Error fetching doctors:', error);
      } else {
        setDoctors(data);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6">Book an Appointment</h1>
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <DoctorCard 
            key={doctor.name} 
            name={doctor.name} 
            specialty={doctor.specialty} 
            imageUrl={doctor.image_url || '/placeholder.svg?height=100&width=100'} 
          />
        ))}
      </div>
    </div>
  );
}
