import ClientButton from "../_component/button";

export default function DashboardPage() {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>
        <div className="rounded-lg border p-4">
          <p>Welcome to the dashboard</p>
        </div>
        <div className="flex justify-end">
          <ClientButton />
        </div>
      </div>
    </div>
  );
}