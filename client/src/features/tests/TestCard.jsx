import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';

function TestCard({ key }) {
  return (
    <>
      <Card
        key={key}
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
    </>
  );
}

export default TestCard;
