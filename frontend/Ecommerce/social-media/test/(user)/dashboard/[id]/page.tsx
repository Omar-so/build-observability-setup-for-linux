import ClientButton from "../../_component/button";

export default function DashboardIdPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { query?: string };
}) {
  return (
    <div className="p-4">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Dashboard Details</h2>
        <div className="rounded-lg border p-4">
          <p className="mb-2">ID: {params.id}</p>
          <p>Query: {searchParams.query}</p>
        </div>
        <div className="flex justify-end">
          <ClientButton />
        </div>
      </div>
    </div>
  );
}