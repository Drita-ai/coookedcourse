export default function PlaylistInsight() {
  return (
    <div className="w-80 rounded-lg shadow shadow-gray-300 p-5 absolute right-10 top-25 z-40 bg-gray-100">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
        Introduction Overview
      </h2>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between bg-gray-200 p-2">
          <span>Coverage</span>
          <span className="font-medium">92%</span>
        </div>

        <div className="flex justify-between p-2">
          <span>Core Videos</span>
          <span className="font-medium">4</span>
        </div>

        <div className="flex justify-between bg-gray-200 p-2">
          <span>Fallback Videos</span>
          <span className="font-medium">11</span>
        </div>

        <div className="flex justify-between p-2">
          <span>Primary Source</span>
          <span className="font-medium">5 Minutes</span>
        </div>

        <div className="flex justify-between bg-gray-200 p-2">
          <span>Estimated Time</span>
          <span className="font-medium">2h 15m</span>
        </div>
      </div>
    </div>
  )
}