"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [videoStatus, setVideoStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    // Get the environment variable
    const url = process.env.NEXT_PUBLIC_VIDEO_URL
    setVideoUrl(url || null)

    // Test if the URL is accessible
    if (url) {
      fetch(url, { method: "HEAD" })
        .then((response) => {
          if (response.ok) {
            setVideoStatus("success")
          } else {
            setVideoStatus("error")
            setErrorMessage(`URL returned status: ${response.status}`)
          }
        })
        .catch((error) => {
          setVideoStatus("error")
          setErrorMessage(`Error accessing URL: ${error.message}`)
        })
    } else {
      setVideoStatus("error")
      setErrorMessage("NEXT_PUBLIC_VIDEO_URL environment variable is not set")
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Environment Variable Debug</CardTitle>
          <CardDescription>Check if your video URL is correctly configured</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">NEXT_PUBLIC_VIDEO_URL</h3>
            <p className="font-mono text-sm break-all bg-gray-100 p-2 rounded">{videoUrl || "Not set"}</p>
          </div>

          <div>
            <h3 className="text-lg font-medium">Status</h3>
            <div
              className={`p-2 rounded ${
                videoStatus === "loading"
                  ? "bg-yellow-100 text-yellow-800"
                  : videoStatus === "success"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
              }`}
            >
              {videoStatus === "loading" && "Checking URL..."}
              {videoStatus === "success" && "URL is accessible ✓"}
              {videoStatus === "error" && errorMessage}
            </div>
          </div>

          {videoStatus === "success" && (
            <div>
              <h3 className="text-lg font-medium">Video Preview</h3>
              <video className="w-full h-64 object-cover bg-black" controls src={videoUrl || undefined}></video>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.location.reload()}>
            Refresh
          </Button>
          <Button onClick={() => (window.location.href = "/")}>Back to Home</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
