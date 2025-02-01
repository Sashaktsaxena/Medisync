"use client"
import VideoCall from "@/components/video-call";
import { useSearchParams } from "next/navigation"

export default function Home() {
  const searchParams = useSearchParams()
  const doctorId = searchParams.get("doctorId")
  return (
    <div className="flex justify-center items-center min-h-screen">
      <VideoCall doctorId={doctorId}/>
    </div>
  );
}
