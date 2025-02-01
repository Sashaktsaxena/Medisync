"use client";

import { useEffect, useRef, useState } from "react";
import Peer from "peerjs";
import { supabase } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, X } from "lucide-react";

interface DocVideoProps {
  patientId: string | null;
}

interface UserNames {
  doctorName: string;
  patientName: string;
}

export default function DocVideo({ patientId }: DocVideoProps) {
  const [peerId, setPeerId] = useState<string | null>(null);
  const [peer, setPeer] = useState<Peer | null>(null);
  const [call, setCall] = useState<Peer.MediaConnection | null>(null);
  const [callStatus, setCallStatus] = useState<
    "idle" | "incoming" | "outgoing" | "connected"
  >("idle");
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const userVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const userStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);
  const [names, setNames] = useState<UserNames>({
    doctorName: "",
    patientName: "",
  });

  useEffect(() => {
    async function fetchNames() {
      try {
        // Get current doctor's info
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch doctor's name from doctors table
        const { data: doctorData, error: doctorError } = await supabase
          .from("doctors")
          .select("name")
          .eq("id", user.id)
          .single();

        if (doctorError) throw doctorError;

        // Fetch patient's name from patients table
        const { data: patientData, error: patientError } = await supabase
          .from("profiles")
          .select("Name")
          .eq("id", patientId)
          .single();

        if (patientError) throw patientError;

        setNames({
          doctorName: doctorData.name,
          patientName: patientData.Name,
        });
      } catch (error) {
        console.error("Error fetching names:", error);
      }
    }

    if (patientId) {
      fetchNames();
    }
  }, [patientId]);

  useEffect(() => {
    async function initializePeer() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const newPeer = new Peer(user.id);
      newPeer.on("open", (id) => {
        setPeerId(id);
        if (patientId) startCall(newPeer, patientId);
      });

      newPeer.on("call", (incomingCall) => {
        setCall(incomingCall);
        setCallStatus("incoming");
      });

      setPeer(newPeer);

      return () => {
        newPeer.destroy();
      };
    }

    initializePeer();
  }, [patientId]);

  useEffect(() => {
    if (callStatus === "connected") {
      if (userVideoRef.current && userStreamRef.current) {
        userVideoRef.current.srcObject = userStreamRef.current;
      }
      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    }
  }, [callStatus]);

  const startCall = (peerInstance: Peer, remoteId: string) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        const outgoingCall = peerInstance.call(remoteId, stream);
        setCall(outgoingCall);
        setCallStatus("outgoing");

        outgoingCall.on("stream", (remoteStream) => {
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setCallStatus("connected");
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const answerCall = () => {
    if (!call) return;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        userStreamRef.current = stream;
        if (userVideoRef.current) {
          userVideoRef.current.srcObject = stream;
        }
        call.answer(stream);
        call.on("stream", (remoteStream) => {
          remoteStreamRef.current = remoteStream;
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remoteStream;
          }
          setCallStatus("connected");
        });
      })
      .catch((error) => {
        console.error("Error accessing media devices:", error);
      });
  };

  const rejectCall = () => {
    if (call) {
      call.close();
    }
    setCall(null);
    setCallStatus("idle");
  };

  const endCall = () => {
    if (call) {
      call.close();
    }
    if (userStreamRef.current) {
      userStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
    }
    setCall(null);
    setCallStatus("idle");
    if (userVideoRef.current) {
      userVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    userStreamRef.current = null;
    remoteStreamRef.current = null;
  };

  const toggleMute = () => {
    if (userStreamRef.current) {
      const audioTrack = userStreamRef.current.getAudioTracks()[0];
      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const toggleVideo = () => {
    if (userStreamRef.current) {
      const videoTrack = userStreamRef.current.getVideoTracks()[0];
      videoTrack.enabled = !videoTrack.enabled;
      setIsVideoOff(!videoTrack.enabled);
    }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-blue-100">
      {callStatus === "idle" && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-lg mb-4">Waiting for a call...</p>
            <p className="text-sm text-muted-foreground">
              Your Peer ID:{" "}
              <span className="font-mono text-primary">{peerId}</span>
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
                <X className="mr-2 h-5 w-5" /> Reject
              </Button>
            </div>
          </div>
        </div>
      )}

      {callStatus === "outgoing" && (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-xl font-semibold">Calling patient...</p>
        </div>
      )}

      {callStatus === "connected" && (
        <>
          <div className="flex-1 grid grid-cols-2 gap-4 p-4">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={userVideoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover"
              />
              {isVideoOff && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75">
                  <p className="text-white text-lg">Video Off</p>
                </div>
              )}
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                <p className="text-white font-semibold">
                  {names.doctorName}
                </p>
              </div>
            </div>
            <div className="relative bg-gray-200 rounded-lg overflow-hidden">
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded-lg">
                <p className="text-white font-semibold">{names.patientName}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center items-center mb-4">
            <div className="bg-background p-4 flex justify-center space-x-4 rounded-xl bg-blue-800 transition-all duration-300 ease-in-out hover:shadow-2xl hover:translate-y-[-5px] hover:shadow-green-500/100">
              <Button
                onClick={toggleMute}
                variant="outline"
                size="icon"
                className="transition-all duration-300 ease-in-out group hover:bg-green-500 hover:shadow-lg hover:scale-125"
              >
                {isMuted ? (
                  <MicOff className="h-10 w-10 transition-transform group-hover:scale-150 group-hover:rotate-12" />
                ) : (
                  <Mic className="h-10 w-10 transition-transform group-hover:scale-150 group-hover:rotate-12" />
                )}
              </Button>

              <Button
                onClick={toggleVideo}
                variant="outline"
                size="icon"
                className="transition-all duration-300 ease-in-out group hover:bg-green-500 hover:shadow-lg hover:scale-125"
              >
                {isVideoOff ? (
                  <VideoOff className="h-10 w-10 transition-transform group-hover:scale-150 group-hover:rotate-12" />
                ) : (
                  <Video className="h-10 w-10 transition-transform group-hover:scale-150 group-hover:rotate-12" />
                )}
              </Button>

              <Button
                onClick={endCall}
                variant="destructive"
                size="icon"
                className="transition-all duration-300 ease-in-out group hover:bg-red-700 hover:shadow-lg hover:scale-125"
              >
                <PhoneOff className="h-10 w-10 transition-transform group-hover:scale-150 group-hover:rotate-12" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
