import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

function OverviewPanel() {
  return (
    <>
      <Card className="h-full">
        <CardHeader className="border-b border-border">
          <CardTitle>Overview</CardTitle>
          <CardDescription>Quick snapshot of your tests</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="text-sm text-muted-foreground">Upcoming tests</div>
            <div className="mt-1 text-3xl font-semibold">3</div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="text-sm text-muted-foreground">Total tests</div>
            <div className="mt-1 text-3xl font-semibold">12</div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <div className="text-sm text-muted-foreground">This week</div>
            <div className="mt-1 text-3xl font-semibold">1</div>
          </div>

          <div className="pt-2 text-sm text-muted-foreground">
            Data like upcoming tests, total tests, etc.
          </div>
        </CardContent>
      </Card>
    </>
  );
}

export default OverviewPanel;
