"use client"

import type React from "react"

import { useState } from "react"
import { upload } from "@vercel/blob/client"

export default function UploadVideoPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadedUrl, setUploadedUrl] = useState("")
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError("")
      setUploadedUrl("")
      setProgress(0)
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
      setProgress(0)

      // Direct browser -> Blob upload. Multipart keeps very large files reliable
      // and completely avoids the serverless request body size limit.
      const blob = await upload(file.name, file, {
        access: "public",
        handleUploadUrl: "/api/upload-video",
        multipart: true,
        onUploadProgress: ({ percentage }) => setProgress(Math.round(percentage)),
      })

      setUploadedUrl(blob.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(uploadedUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      setError("Could not copy to clipboard — please select the URL manually")
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-4 py-16">
      <div className="mx-auto flex w-full max-w-lg flex-col gap-8 border border-[#d8d3c2] bg-white p-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Admin</p>
          <h1 className="text-lg font-light uppercase tracking-[0.15em] text-neutral-900">Replace Hero Video</h1>
          <p className="text-sm leading-relaxed text-neutral-600">
            Large files upload straight from your browser to Blob storage, so there is no size limit from the server.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          <label htmlFor="video" className="text-xs uppercase tracking-[0.15em] text-neutral-500">
            Video file
          </label>
          <input
            id="video"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="block w-full text-sm text-neutral-600 file:mr-4 file:border file:border-neutral-900 file:bg-transparent file:px-4 file:py-2 file:text-xs file:uppercase file:tracking-[0.15em] file:text-neutral-900"
          />
        </div>

        {file && (
          <dl className="flex flex-col gap-1 border-t border-[#e0ddd2] pt-4 text-sm text-neutral-600">
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">File</dt>
              <dd className="truncate text-right text-neutral-900">{file.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-neutral-500">Size</dt>
              <dd className="text-neutral-900">{(file.size / (1024 * 1024)).toFixed(1)} MB</dd>
            </div>
          </dl>
        )}

        <button
          type="button"
          onClick={handleUpload}
          disabled={!file || uploading}
          className="w-full border border-neutral-900 py-3 text-xs uppercase tracking-[0.2em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {uploading ? `Uploading ${progress}%` : "Upload video"}
        </button>

        {uploading && (
          <div className="h-px w-full bg-[#e0ddd2]" role="progressbar" aria-valuenow={progress}>
            <div className="h-px bg-neutral-900 transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}

        {error && <p className="text-sm text-red-700">{error}</p>}

        {uploadedUrl && (
          <div className="flex flex-col gap-3 border-t border-[#e0ddd2] pt-6">
            <p className="text-xs uppercase tracking-[0.15em] text-neutral-500">Upload complete</p>
            <code className="block break-all border border-[#e0ddd2] bg-[#f5f3ee] p-3 text-xs text-neutral-800">
              {uploadedUrl}
            </code>
            <button
              type="button"
              onClick={handleCopy}
              className="self-start border border-neutral-900 px-4 py-2 text-xs uppercase tracking-[0.15em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
            >
              {copied ? "Copied" : "Copy URL"}
            </button>
            <p className="text-sm leading-relaxed text-neutral-600">
              Set this as the{" "}
              <code className="text-neutral-900">NEXT_PUBLIC_HERO_VIDEO_URL</code> environment variable to make it the
              hero video, or send it to me and I&apos;ll wire it in directly.
            </p>
          </div>
        )}
      </div>
    </main>
  )
}
