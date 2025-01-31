"use client"

import { useEffect, useRef, useState } from "react"
import Peer from "peerjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff } from "lucide-react"

export default function VideoCall() {
  const [peerId, setPeerId] = useState<string | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [call, setCall] = useState<Peer.MediaConnection | null>(null)
  const [callStatus, setCallStatus] = useState<"idle" | "incoming" | "connected">("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const userStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    async function initializePeer() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

      const newPeer = new Peer(user.id)
      newPeer.on("open", (id) => {
        setPeerId(id)
      })

      newPeer.on("call", (incomingCall) => {
        setCall(incomingCall)
        setCallStatus("incoming")
      })

      setPeer(newPeer)

      return () => {
        newPeer.destroy()
      }
    }

    initializePeer()
  }, [])

  useEffect(() => {
    if (call && callStatus === "connected") {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          userStreamRef.current = stream
          if (userVideoRef.current) {
            userVideoRef.current.srcObject = stream
          }
          call.answer(stream)
          call.on("stream", (remoteStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = remoteStream
            }
          })
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error)
        })
    }
  }, [call, callStatus])

  const answerCall = () => {
    setCallStatus("connected")
  }

  const rejectCall = () => {
    if (call) {
      call.close()
    }
    setCall(null)
    setCallStatus("idle")
  }

  const endCall = () => {
    if (call) {
      call.close()
    }
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach((track) => track.stop())
    }
    setCall(null)
    setCallStatus("idle")
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
  }

  const toggleMute = () => {
    if (userStreamRef.current) {
      const audioTrack = userStreamRef.current.getAudioTracks()[0]
      audioTrack.enabled = !audioTrack.enabled
      setIsMuted(!audioTrack.enabled)
    }
  }

  const toggleVideo = () => {
    if (userStreamRef.current) {
      const videoTrack = userStreamRef.current.getVideoTracks()[0]
      videoTrack.enabled = !videoTrack.enabled
      setIsVideoOff(!videoTrack.enabled)
    }
  }

  return (
    <div className="h-screen w-full flex flex-col bg-black ">
      {callStatus === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Waiting for a call...</p>
            <p className="text-sm text-muted-foreground">
              Your Peer ID: <span className="font-mono text-primary">{peerId}</span>
            </p>
          </div>
        </div>
      )}

      {callStatus === "incoming" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl font-semibold">Incoming Call</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={answerCall} variant="default" size="lg">
                <Phone className="mr-2 h-5 w-5" /> Answer
              </Button>
              <Button onClick={rejectCall} variant="destructive" size="lg">
                <PhoneOff className="mr-2 h-5 w-5" /> Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {callStatus === "connected" && (
        <>
          <div className="flex-1 grid grid-cols-2 gap-4 p-4">
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <video ref={userVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
            </div>
          <div className="relative bg-gray-200 rounded-lg overflow-hidden">
            <video ref={remoteVideoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
            </div>
          </div>
          <div className="flex justify-center items-center mb-4">
          <div className="bg-background p-4 flex justify-center space-x-4  rounded-xl w-2/5">
            <Button onClick={toggleMute} variant="outline" size="icon">
              {isMuted ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
            </Button>
            <Button onClick={toggleVideo} variant="outline" size="icon">
              {isVideoOff ? <VideoOff className="h-8 w-8" /> : <Video className="h-8 w-8" />}
            </Button>
            <Button onClick={endCall} variant="destructive" size="icon">
              <PhoneOff className="h-8 w-8" />
            </Button>
          </div>
          </div>
        </>
      )}
    </div>
  )
}

