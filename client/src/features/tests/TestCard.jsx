import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

function TestCard({ test, onEdit, onDelete }) {
  const isArchived = Boolean(test.isArchived);
  const hasScore = typeof test.score === 'number';
  const showScore = test.status === 'Completed' && hasScore;

  return (
    <Card
      className={[
        'h-52 cursor-pointer transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md active:translate-y-0 active:scale-[0.99]',
        isArchived ? 'opacity-60 grayscale' : '',
      ].join(' ')}
      onClick={onEdit}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onEdit) return;
        if (e.key === 'Enter' || e.key === ' ') onEdit();
      }}
    >
      <CardHeader className="border-b border-border">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col">
            <CardTitle className="line-clamp-1">{test.name}</CardTitle>

            {isArchived && (
              <span className="mt-1 inline-flex w-fit rounded-full border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Archived
              </span>
            )}
          </div>

          <CardAction className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.();
              }}
            >
              Edit
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="transition-all duration-150 hover:-translate-y-0.5 hover:scale-[1.03] active:translate-y-0 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background hover:bg-destructive/10 hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.();
              }}
            >
              Delete
            </Button>
          </CardAction>
        </div>

        <CardDescription className="mt-2 text-xs">
          {test.type} • {String(test.date).slice(0, 10)}
        </CardDescription>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col items-center justify-center gap-2">
        <span className="text-sm text-muted-foreground">{test.status}</span>

        {showScore ? <div className="text-2xl font-semibold">{test.score}%</div> : null}
      </CardContent>
    </Card>
  );
}

export default TestCard;
