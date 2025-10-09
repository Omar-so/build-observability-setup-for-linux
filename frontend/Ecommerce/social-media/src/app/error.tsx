"use client";

export default function ErrorBoundary({ error, reset }: { error: Error; reset: () => void }) {
    
  
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1>Something went wrong!</h1>
      <p>{error.message}</p>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => reset()} 
      >
        Try again
      </button>
    </div>
  );
}
