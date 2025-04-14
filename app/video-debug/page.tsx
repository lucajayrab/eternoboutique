"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"

export default function VideoDebugPage() {
  const [videoStatus, setVideoStatus] = useState<"loading" | "success" | "error" | "playing">("loading")
  const [errorMessage, setErrorMessage] = useState("")
  const videoRef = useRef<HTMLVideoElement>(null)

  // The video URL to test
  const videoUrl =
    "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

  useEffect(() => {
    // Test if the URL is accessible
    const checkVideo = async () => {
      try {
        const response = await fetch(videoUrl, { method: "HEAD" })
        if (response.ok) {
          setVideoStatus("success")
          console.log("Video URL is accessible")
        } else {
          setVideoStatus("error")
          setErrorMessage(`URL returned status: ${response.status}`)
          console.error(`Video URL returned status: ${response.status}`)
        }
      } catch (error) {
        setVideoStatus("error")
        setErrorMessage(`Error accessing URL: ${error instanceof Error ? error.message : String(error)}`)
        console.error("Error checking video URL:", error)
      }
    }

    checkVideo()
  }, [videoUrl])

  const handleVideoLoaded = () => {
    console.log("Video loaded successfully")

    // Try to play the video
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setVideoStatus("playing")
          console.log("Video is playing")
        })
        .catch((e) => {
          setVideoStatus("error")
          setErrorMessage(`Error playing video: ${e.message}`)
          console.error("Error playing video:", e)
        })
    }
  }

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const videoElement = e.currentTarget
    setVideoStatus("error")
    setErrorMessage(`Video error: ${videoElement.error ? videoElement.error.message : "Unknown error"}`)
    console.error("Video error:", videoElement.error)
  }

  const handleManualPlay = () => {
    if (videoRef.current) {
      videoRef.current
        .play()
        .then(() => {
          setVideoStatus("playing")
          console.log("Video is playing (manual)")
        })
        .catch((e) => {
          setVideoStatus("error")
          setErrorMessage(`Error playing video (manual): ${e.message}`)
          console.error("Error playing video (manual):", e)
        })
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Video Debug Page</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Video URL</h2>
        <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{videoUrl}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Status</h2>
        <div
          className={`p-2 rounded ${
            videoStatus === "loading"
              ? "bg-yellow-100 text-yellow-800"
              : videoStatus === "success" || videoStatus === "playing"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
          }`}
        >
          {videoStatus === "loading" && "Checking video..."}
          {videoStatus === "success" && "Video is accessible ✓"}
          {videoStatus === "playing" && "Video is playing ✓"}
          {videoStatus === "error" && errorMessage}
        </div>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Video Test</h2>
        <div className="bg-black p-2 rounded">
          <video
            ref={videoRef}
            className="w-full h-64 object-cover"
            controls
            muted
            onLoadedData={handleVideoLoaded}
            onError={handleVideoError}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="mb-4">
        <Button onClick={handleManualPlay} className="mr-2">
          Play Video Manually
        </Button>
        <Button onClick={() => window.location.reload()} variant="outline">
          Refresh Page
        </Button>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Steps</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Check if the video URL is accessible</li>
          <li>Verify that the video format is supported by your browser</li>
          <li>Ensure there are no CORS issues with the video source</li>
          <li>Try playing the video with controls enabled</li>
          <li>Check browser console for any errors</li>
        </ul>
      </div>

      <div className="mt-8">
        <Button onClick={() => (window.location.href = "/confirmation")}>Go to Thank You Page</Button>
      </div>
    </div>
  )
}
