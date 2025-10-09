import Sidebar from "./_component/sidebar";
import CreatePostDialog from "./_component/createposts";
import HomePage from "./_component/infinitescroll/HomePage";

export default function Home() {
  return (
    <div className="flex justify-center items-start min-h-screen  p-6">
     
      {/* Main Content (center) */}
      <div className="flex flex-col items-center w-full max-w-2xl">
        <div className="w-full">
          <CreatePostDialog />
        </div>
        <div className="w-full mt-4">
          <HomePage />
        </div>
      </div>

      {/* Optional Right Sidebar (you can replace with your own widgets later) */}
      <div className="ml-12 hidden lg:block">
        <Sidebar />
      </div>
    </div>
  );
}
