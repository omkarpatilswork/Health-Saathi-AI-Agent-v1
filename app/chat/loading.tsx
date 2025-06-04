export default function Loading() {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50">
      {/* Header Skeleton */}
      <header className="bg-white p-4 flex items-center border-b">
        <div className="w-5 h-5 bg-gray-200 rounded mr-3 animate-pulse"></div>
        <div className="w-32 h-6 bg-gray-200 rounded animate-pulse"></div>
      </header>

      {/* Context Box Skeleton */}
      <div className="bg-white border-b border-gray-200 p-3">
        <div className="w-40 h-5 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Chat Messages Skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {/* System message skeleton */}
        <div className="flex justify-center">
          <div className="w-64 h-12 bg-gray-100 rounded-lg animate-pulse"></div>
        </div>

        {/* Agent message skeleton */}
        <div className="flex">
          <div className="w-8 h-8 bg-blue-100 rounded-full mr-2 animate-pulse"></div>
          <div className="w-48 h-16 bg-white border rounded-lg animate-pulse"></div>
        </div>

        {/* User message skeleton */}
        <div className="flex justify-end">
          <div className="w-40 h-12 bg-blue-200 rounded-lg animate-pulse"></div>
        </div>

        {/* Another agent message skeleton */}
        <div className="flex">
          <div className="w-8 h-8 bg-blue-100 rounded-full mr-2 animate-pulse"></div>
          <div className="w-56 h-20 bg-white border rounded-lg animate-pulse"></div>
        </div>
      </div>

      {/* Input Area Skeleton */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex">
          <div className="flex-1 h-10 bg-gray-100 rounded-l-md animate-pulse"></div>
          <div className="w-12 h-10 bg-blue-200 rounded-r-md animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}
