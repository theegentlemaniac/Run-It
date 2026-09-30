import { Card } from "@/components/ui/card";

export default function CourtsLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="space-y-2">
          <div className="h-7 w-32 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-4 w-56 animate-pulse rounded-md bg-foreground/10" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded-full bg-foreground/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <div className="h-5 w-32 animate-pulse rounded-md bg-foreground/10" />
            <div className="mt-2 h-4 w-40 animate-pulse rounded-md bg-foreground/10" />
            <div className="mt-3 flex gap-2">
              <div className="h-6 w-16 animate-pulse rounded-full bg-foreground/10" />
              <div className="h-6 w-16 animate-pulse rounded-full bg-foreground/10" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
