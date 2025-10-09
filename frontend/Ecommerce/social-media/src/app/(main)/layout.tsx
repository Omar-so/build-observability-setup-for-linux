import Nav from "./_component/nav";
import Sidebar from "./_component/sidebar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 🔹 Top navigation bar */}
      <Nav />

      {/* 🔹 Below nav: sidebar + main content */}
      <div className="flex flex-1">
        {/* Main content beside sidebar */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
