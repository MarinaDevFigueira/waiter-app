import { Card, CardContent, CardHeader } from "@/components/ui/card/card";

export function LoginFormSkeleton() {
  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-3">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="h-6 w-48 bg-muted animate-pulse rounded mx-auto" />
        <div className="h-4 w-64 bg-muted animate-pulse rounded mx-auto" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <div className="h-4 w-24 bg-muted animate-pulse rounded mb-2" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
          <div>
            <div className="h-4 w-20 bg-muted animate-pulse rounded mb-2" />
            <div className="h-10 w-full bg-muted animate-pulse rounded" />
          </div>
          <div className="h-11 w-full bg-muted animate-pulse rounded" />
        </div>
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border" />
          <div className="h-3 w-6 bg-muted animate-pulse rounded" />
          <div className="flex-1 h-px bg-border" />
        </div>
        <div className="h-11 w-full bg-muted animate-pulse rounded" />
      </CardContent>
    </Card>
  );
}
