export default function VideoTestPage() {
  // The video URL
  const videoUrl =
    "https://hbnpsgpm7ka33yva.public.blob.vercel-storage.com/436923_Croatia_Boat_Sea_Sailing_By_Denys_Hrishyn_Artlist_4K-8VStwETVo6CUgQ4TKH5JbWMigUc53g.mp4"

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Video Test Page</h1>

      <div className="mb-4">
        <p className="text-sm mb-2 font-mono break-all">{videoUrl}</p>
      </div>

      <div className="aspect-video bg-black mb-8">
        <video src={videoUrl} controls className="w-full h-full" poster="/api/video-poster" />
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-2">Direct Link Test</h2>
        <p className="mb-2">Click the link below to test if the video URL is accessible directly:</p>
        <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
          Open Video Directly
        </a>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Iframe Test</h2>
        <iframe
          src={videoUrl}
          className="w-full aspect-video border-0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  )
}
