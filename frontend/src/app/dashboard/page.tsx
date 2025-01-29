"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { supabase } from "@/lib/supabaseClient" // Ensure this is correctly set up

export default function DashboardPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [userDetails, setUserDetails] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch user details
  useEffect(() => {
    const fetchUserDetails = async () => {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error("Error fetching user:", userError)
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("Name, Email, Phone, created_at")
        .eq("id", user.id)
        .single()

      if (error) {
        console.error("Error fetching user details:", error)
      } else {
        setUserDetails({
          name: data.Name || "N/A",
          email: data.Email || "N/A",
          phone: data.Phone || "N/A",
          createdAt: data.created_at || "N/A",
        })
      }

      setLoading(false)
    }

    fetchUserDetails()
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
        <h1 className="text-3xl font-bold mb-6">User Details</h1>
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">{userDetails.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p>
                <strong>Email:</strong> {userDetails.email}
              </p>
              <p>
                <strong>Phone:</strong> {userDetails.phone}
              </p>
            </div>
            <div>
              <p>
                <strong>Account Created:</strong> {new Date(userDetails.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
