"use client"

import { useEffect, useRef, useState } from "react"
import Peer from "peerjs"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, X } from "lucide-react"

interface DocVideoProps {
  patientId: string | null
}

export default function DocVideo({ patientId }: DocVideoProps) {
  const [peerId, setPeerId] = useState<string | null>(null)
  const [peer, setPeer] = useState<Peer | null>(null)
  const [call, setCall] = useState<Peer.MediaConnection | null>(null)
  const [callStatus, setCallStatus] = useState<"idle" | "incoming" | "outgoing" | "connected">("idle")
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const userVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const userStreamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    async function initializePeer() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const newPeer = new Peer(user.id)
      newPeer.on("open", (id) => {
        setPeerId(id)
        if (patientId) startCall(newPeer, patientId)
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
  }, [patientId])

  const startCall = (peerInstance: Peer, remoteId: string) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userStreamRef.current = stream
      userVideoRef.current!.srcObject = stream
      const outgoingCall = peerInstance.call(remoteId, stream)
      setCall(outgoingCall)
      setCallStatus("outgoing")

      outgoingCall.on("stream", (remoteStream) => {
        remoteVideoRef.current!.srcObject = remoteStream
        setCallStatus("connected")
      })
    })
  }

  const answerCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userStreamRef.current = stream
      userVideoRef.current!.srcObject = stream
      call!.answer(stream)
      call!.on("stream", (remoteStream) => {
        remoteVideoRef.current!.srcObject = remoteStream
      })
      setCallStatus("connected")
    })
  }

  const rejectCall = () => {
    call!.close()
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
    userVideoRef.current!.srcObject = null
    remoteVideoRef.current!.srcObject = null
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
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Video Call</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground">
          Your Peer ID: <span className="font-mono text-primary">{peerId}</span>
        </div>
        {callStatus === "incoming" && (
          <div className="flex justify-center space-x-2">
            <Button onClick={answerCall} variant="default">
              <Phone className="mr-2 h-4 w-4" /> Answer
            </Button>
            <Button onClick={rejectCall} variant="destructive">
              <X className="mr-2 h-4 w-4" /> Reject
            </Button>
          </div>
        )}
        {callStatus === "outgoing" && <div className="text-center text-muted-foreground">Calling patient...</div>}
        <div className="grid grid-cols-2 gap-4">
          <video ref={userVideoRef} autoPlay playsInline muted className="w-full aspect-video bg-muted rounded-lg" />
          <video ref={remoteVideoRef} autoPlay playsInline className="w-full aspect-video bg-muted rounded-lg" />
        </div>
      </CardContent>
      {callStatus === "connected" && (
        <CardFooter className="justify-center space-x-2">
          <Button onClick={toggleMute} variant="outline" size="icon">
            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button onClick={toggleVideo} variant="outline" size="icon">
            {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
          </Button>
          <Button onClick={endCall} variant="destructive" size="icon">
            <PhoneOff className="h-4 w-4" />
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}