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
  return (
    <Card
      className="h-52 cursor-pointer transition hover:-translate-y-0.5 hover:shadow-md"
      onClick={onEdit}
      role={onEdit ? 'button' : undefined}
      tabIndex={onEdit ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onEdit) return;
        if (e.key === 'Enter' || e.key === ' ') onEdit();
      }}
    >
      <CardHeader className="border-b border-border">
        <CardTitle className="line-clamp-1">{test.name}</CardTitle>

        <CardDescription className="text-xs">
          {test.type} • {String(test.date).slice(0, 10)}
        </CardDescription>

        <CardAction className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
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
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
          >
            Delete
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center">
        <span className="text-sm text-muted-foreground">{test.status}</span>
      </CardContent>
    </Card>
  );
}

export default TestCard;
