import Link from 'next/link'

export default function AdminHome() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Home</h1>
      <div className="space-y-4">
        <Link 
          href="/admin/dash" 
          className="text-blue-500 hover:underline"
        >
          Go to Dashboard (Client Navigation)
        </Link>
      </div>
    </div>
  )
}