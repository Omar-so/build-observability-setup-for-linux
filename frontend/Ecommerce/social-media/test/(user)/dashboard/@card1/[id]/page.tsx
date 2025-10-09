import { Card } from "@/components/ui/card"

export default function DashboardCard1Dynamic({
  params,
}: {
  params: { id: string }
}) {
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Card 1</h2>
      <Card className="p-4">
        <p>Card 2 Content for ID: {params.id}</p>
      </Card>
    </div>
  )
}