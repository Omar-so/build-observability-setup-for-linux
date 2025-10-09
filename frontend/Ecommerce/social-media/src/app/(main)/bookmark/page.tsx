
import HomePage from "./_component/infinitescroll/HomePage";

export default function Home() {
  return (
    <div className="flex justify-center items-start min-h-screen bg-gray-50 p-6">
     
     <div className="ml-12 ">
     </div>
      {/* Main Content (center) */}
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="w-full mt-4">
          <HomePage />
        </div>
      </div>

    
    </div>
  );
}
