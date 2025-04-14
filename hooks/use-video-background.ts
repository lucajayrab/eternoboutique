"use client"

import { useState, useEffect } from "react"

interface UseVideoBackgroundProps {
  videoUrl?: string
  environmentVariable?: string
}

interface UseVideoBackgroundResult {
  videoUrl: string
  isLoaded: boolean
  isError: boolean
  handleVideoLoaded: () => void
  handleVideoError: () => void
}

export function useVideoBackground({
  videoUrl: initialUrl,
  environmentVariable = "NEXT_PUBLIC_VIDEO_URL",
}: UseVideoBackgroundProps = {}): UseVideoBackgroundResult {
  const [videoUrl, setVideoUrl] = useState(initialUrl || "")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (initialUrl) {
      setVideoUrl(initialUrl)
      return
    }

    // Get URL from environment variable if not provided directly
    if (typeof window !== "undefined") {
      const envUrl = process.env[environmentVariable]
      if (envUrl) {
        setVideoUrl(envUrl)
      } else {
        console.error(`${environmentVariable} environment variable is not set`)
        setIsError(true)
      }
    }
  }, [initialUrl, environmentVariable])

  const handleVideoLoaded = () => {
    setIsLoaded(true)
  }

  const handleVideoError = () => {
    console.error("Video failed to load")
    setIsError(true)
  }

  return {
    videoUrl,
    isLoaded,
    isError,
    handleVideoLoaded,
    handleVideoError,
  }
}
