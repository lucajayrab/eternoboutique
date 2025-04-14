"use client"

import type React from "react"

import { useState } from "react"

export default function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadedUrl, setUploadedUrl] = useState("")
  const [error, setError] = useState("")

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file first")
      return
    }

    try {
      setUploading(true)
      setError("")

      // Create a FormData object
      const formData = new FormData()
      formData.append("file", file)

      // Upload to Vercel Blob via API route
      const response = await fetch(`/api/upload-video?filename=${encodeURIComponent(file.name)}`, {
        method: "POST",
        body: file,
      })

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      setUploadedUrl(data.url)
    } catch (err) {
      console.error("Upload error:", err)
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-2xl font-bold mb-6">Upload Video to Vercel Blob</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Video File</label>
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
      </div>

      {file && (
        <div className="mb-4 p-3 bg-gray-50 rounded">
          <p className="text-sm">
            <span className="font-medium">Selected file:</span> {file.name}
          </p>
          <p className="text-sm">
            <span className="font-medium">Size:</span> {(file.size / (1024 * 1024)).toFixed(2)} MB
          </p>
          <p className="text-sm">
            <span className="font-medium">Type:</span> {file.type}
          </p>
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={!file || uploading}
        className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {uploading ? "Uploading..." : "Upload Video"}
      </button>

      {error && <p className="mt-4 text-red-500 text-sm">{error}</p>}

      {uploadedUrl && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <h3 className="text-green-800 font-medium mb-2">Upload Successful!</h3>
          <p className="text-sm mb-2">Your video is now available at:</p>
          <div className="bg-white p-2 rounded border overflow-x-auto">
            <code className="text-xs break-all">{uploadedUrl}</code>
          </div>
          <p className="text-xs mt-4">
            Add this URL to your <code>NEXT_PUBLIC_VIDEO_URL</code> environment variable in Vercel.
          </p>
        </div>
      )}
    </div>
  )
}
