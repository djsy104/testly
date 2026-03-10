import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/Label';

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

function TestDetails({ initialData, onSubmit, submitting = false }) {
  const [form, setForm] = useState(() => buildInitialForm(initialData));
  const [error, setError] = useState('');

  function setField(name, value) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (!TEST_TYPES.includes(form.type)) {
      setError('Type must be one of: Quiz, Exam, Midterm, Final Exam.');
      return;
    }
    if (!TEST_STATUSES.includes(form.status)) {
      setError('Status must be one of: Upcoming, In Review, Completed.');
      return;
    }
    if (form.score !== '' && Number(form.score) < 0) {
      setError('Score cannot be negative.');
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

    try {
      await onSubmit(payload);
    } catch (err) {
      const msg =
        err?.response?.data?.msg ||
        err?.response?.data?.message ||
        (Array.isArray(err?.response?.data?.errors)
          ? err.response.data.errors.map((e) => e.msg).join(', ')
          : 'Request failed.');
      setError(msg);
    }
  }

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
        <Label htmlFor="score">Score (optional)</Label>
        <Input
          id="score"
          type="number"
          className="h-10"
          value={form.score}
          onChange={(e) => setField('score', e.target.value)}
          min={0}
          step={1}
          placeholder="95"
          disabled={submitting}
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

      {error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      ) : null}

      <Button type="submit" disabled={submitting}>
        {submitting ? 'Saving…' : 'Save'}
      </Button>
    </form>
  );
}

export default TestDetails;
