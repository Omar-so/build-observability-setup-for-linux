export default function DashboardLayout({
  children,
  card1,
  card2,
}: {
  children: React.ReactNode
  card1: React.ReactNode
  card2: React.ReactNode
}) {
  return (
    <section className="p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard Layout</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 bg-white rounded-lg shadow">{card1}</div>
        <div className="md:col-span-1 bg-white rounded-lg shadow">{children}</div>
        <div className="md:col-span-1 bg-white rounded-lg shadow">{card2}</div>
      </div>
    </section>
  )
}