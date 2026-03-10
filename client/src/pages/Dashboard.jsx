import { useEffect } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import OverviewPanel from '@/features/tests/OverviewPanel';
import TestCard from '@/features/tests/TestCard';

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <OverviewPanel />

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
              <TestCard key={i} />
            ))}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
