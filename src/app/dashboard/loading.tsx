import { Card } from "@/components/ui/card";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-64 animate-pulse rounded-md bg-foreground/10" />
        <div className="h-4 w-80 animate-pulse rounded-md bg-foreground/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <div className="mb-3 h-10 w-10 animate-pulse rounded-xl bg-foreground/10" />
            <div className="h-5 w-24 animate-pulse rounded-md bg-foreground/10" />
            <div className="mt-2 h-4 w-32 animate-pulse rounded-md bg-foreground/10" />
          </Card>
        ))}
      </div>
    </div>
  );
}
