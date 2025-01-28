"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"

const userDetails = {
  name: "John Doe",
  email: "john.doe@example.com",
  age: 35,
  gender: "Male",
  bloodType: "O+",
  lastVisit: "2023-05-15",
  upcomingAppointment: "2023-06-01",
}

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar onOpenChange={setIsSidebarOpen} />
      <main className={`flex-1 p-8 transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-64" : "ml-16"}`}>
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{userDetails.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Age:</strong> {userDetails.age}
              </p>
              <p>
                <strong>Gender:</strong> {userDetails.gender}
              </p>
            </div>
            <div>
              <p>
                <strong>Blood Type:</strong> {userDetails.bloodType}
              </p>
              <p>
                <strong>Last Visit:</strong> {userDetails.lastVisit}
              </p>
              <p>
                <strong>Upcoming Appointment:</strong> {userDetails.upcomingAppointment}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

