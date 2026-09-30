import { Card } from "@/components/ui/card";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <div className="h-7 w-40 animate-pulse rounded-md bg-foreground/10" />
        <div className="h-4 w-56 animate-pulse rounded-md bg-foreground/10" />
      </div>
      <Card className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-16 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-5 w-24 animate-pulse rounded-md bg-foreground/10" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 animate-pulse rounded-md bg-foreground/10" />
          <div className="h-5 w-28 animate-pulse rounded-md bg-foreground/10" />
        </div>
      </Card>
      <Card className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-1.5">
            <div className="h-4 w-20 animate-pulse rounded-md bg-foreground/10" />
            <div className="h-10 w-full animate-pulse rounded-lg bg-foreground/10" />
          </div>
        ))}
      </Card>
    </div>
  );
}
