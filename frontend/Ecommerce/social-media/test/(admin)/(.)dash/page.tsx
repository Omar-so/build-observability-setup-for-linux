'use client'

import { useRouter } from 'next/navigation'

export default function InterceptedDashboard() {
  const router = useRouter()

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-xl w-full mx-4">
        <h1 className="text-2xl font-bold mb-4">Intercepted Dashboard</h1>
        <p className="mb-4">This is the intercepted modal view</p>
        <button 
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-200 rounded"
        >
          Close
        </button>
      </div>
    </div>
  )
}