"use client"

import DocVideo from "@/components/Doc-video"
import { useSearchParams } from "next/navigation"

export default function VideoPage() {
  const searchParams = useSearchParams()
  const patientId = searchParams.get("patientId")

  return (
    <div className="flex justify-center items-center min-h-screen">
      <DocVideo patientId={patientId} />
    </div>
  )
}