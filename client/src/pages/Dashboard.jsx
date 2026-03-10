import { useEffect } from 'react';
import axios from 'axios';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        {/* LEFT: Stats / Summary */}
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

        <div className="space-y-6">
          {/* Search row */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex-1">
              <Input
                placeholder="Search tests..."
                className="h-10 flex-1 bg-muted/40 focus-visible:bg-background"
              />
            </div>

            <Button variant="outline" className="sm:w-auto">
              Filters
            </Button>
          </div>

          {/* Test cards grid */}
          <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="h-52 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <CardHeader className="border-b border-border">
                  <CardTitle>Test</CardTitle>
                  <CardDescription className="text-xs">Course • Date</CardDescription>
                </CardHeader>

                <CardContent className="flex flex-1 items-center justify-center">
                  <span className="text-lg font-medium text-muted-foreground">Test</span>
                </CardContent>
              </Card>
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
