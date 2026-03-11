import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';
import { toast } from 'react-toastify';

const TEST_TYPES = ['Quiz', 'Exam', 'Midterm', 'Final Exam'];
const TEST_STATUSES = ['Upcoming', 'In Review', 'Completed'];

function buildInitialForm(initialData) {
  return {
    name: initialData?.name ?? '',
    type: initialData?.type ?? 'Quiz',
    status: initialData?.status ?? 'Upcoming',
    date: initialData?.date ? String(initialData.date).slice(0, 10) : '',
    score: initialData?.score ?? '',
    isArchived: !!initialData?.isArchived,
  };
}

// AI helped with stylzing the forms
function TestDetails({ initialData, onSubmit, submitting = false }) {
  const [form, setForm] = useState(() => buildInitialForm(initialData));

  function setField(name, value) {
    setForm((prev) => {
      // If status changes away from Completed, clear score immediately
      if (name === 'status' && value !== 'Completed' && prev.score !== '') {
        return { ...prev, status: value, score: '' };
      }

      return { ...prev, [name]: value };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Client-side checks
    if (!TEST_TYPES.includes(form.type)) {
      toast.error('Type must be one of: Quiz, Exam, Midterm, Final Exam.');
      return;
    }
    if (!TEST_STATUSES.includes(form.status)) {
      toast.error('Status must be one of: Upcoming, In Review, Completed.');
      return;
    }
    if (form.score !== '' && Number(form.score) < 0) {
      toast.error('Score cannot be negative.');
      return;
    }
    if (form.status !== 'Completed' && form.score !== '') {
      toast.error('Score can only be set when status is Completed.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      type: form.type,
      status: form.status,
      date: form.date,
      isArchived: form.isArchived,
      ...(form.score === '' ? {} : { score: Number(form.score) }),
    };

    await onSubmit(payload);
  }

  const scoreEnabled = form.status === 'Completed';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          className="h-10"
          value={form.name}
          onChange={(e) => setField('name', e.target.value)}
          placeholder="Math Quiz 1"
          required
          disabled={submitting}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="type">Type</Label>
        <select
          id="type"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          value={form.type}
          onChange={(e) => setField('type', e.target.value)}
          disabled={submitting}
        >
          {TEST_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm"
          value={form.status}
          onChange={(e) => setField('status', e.target.value)}
          disabled={submitting}
        >
          {TEST_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          className="h-10"
          value={form.date}
          onChange={(e) => setField('date', e.target.value)}
          required
          disabled={submitting}
        />
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="score">Score (optional)</Label>
          {!scoreEnabled ? (
            <span className="text-xs text-muted-foreground">Only for Completed tests</span>
          ) : null}
        </div>

        <Input
          id="score"
          type="number"
          className="h-10"
          value={scoreEnabled ? form.score : ''}
          onChange={(e) => setField('score', e.target.value)}
          min={0}
          step={1}
          placeholder="95"
          disabled={submitting || !scoreEnabled}
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          id="isArchived"
          type="checkbox"
          checked={form.isArchived}
          onChange={(e) => setField('isArchived', e.target.checked)}
          disabled={submitting}
        />
        <Label htmlFor="isArchived">Archived</Label>
      </div>

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save'}
      </Button>
    </form>
  );
}

export default TestDetails;
