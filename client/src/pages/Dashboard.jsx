import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import OverviewPanel from '@/features/tests/OverviewPanel';
import TestCard from '@/features/tests/TestCard';
import TestDetails from './TestDetails';
import { useTests } from '@/features/tests/useTests';
import { useState } from 'react';

function Dashboard() {
  const { tests, loading, createTest, updateTest, deleteTest } = useTests();

  const [showCreate, setShowCreate] = useState(false);
  const [editingTest, setEditingTest] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleCreate(payload) {
    setSubmitting(true);
    try {
      await createTest(payload);
      setShowCreate(false);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUpdate(payload) {
    if (!editingTest?._id) return;

    setSubmitting(true);
    try {
      await updateTest(editingTest._id, payload);
      setEditingTest(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>

        <div className="flex items-center gap-3">
          {editingTest ? (
            <Button variant="outline" onClick={() => setEditingTest(null)}>
              Cancel Edit
            </Button>
          ) : null}

          <Button
            onClick={() => {
              // don’t show create form while editing
              setEditingTest(null);
              setShowCreate((prev) => !prev);
            }}
          >
            {showCreate ? 'Cancel' : 'New Test'}
          </Button>
        </div>
      </div>

      {/* Edit Form */}
      {editingTest && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Edit test</h2>
            <Button variant="ghost" onClick={() => setEditingTest(null)}>
              Close
            </Button>
          </div>

          <TestDetails
            key={editingTest._id} // ✅ remount when switching tests
            initialData={editingTest}
            onSubmit={handleUpdate}
            submitting={submitting}
          />
        </div>
      )}

      {/* Create Form */}
      {!editingTest && showCreate && (
        <div className="mb-8 rounded-xl border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Create test</h2>
            <Button variant="ghost" onClick={() => setShowCreate(false)}>
              Close
            </Button>
          </div>

          <TestDetails
            key="create" // ✅ stable remount key for create mode
            onSubmit={handleCreate}
            submitting={submitting}
          />
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading tests...</div>
      ) : tests.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          No tests yet. Click “New Test” to create one.
        </div>
      ) : (
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {tests.map((t) => (
            <TestCard
              key={t._id}
              test={t}
              onEdit={() => {
                setShowCreate(false);
                setEditingTest(t);
              }}
              onDelete={() => deleteTest(t._id)}
            />
          ))}
        </section>
      )}
    </div>
  );
}

export default Dashboard;

// FINISH ANOTHER TIME... mightve gotten a bit too ambitious
// <div className="mx-auto w-full max-w-7xl px-6 py-8">
//   <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
//     <OverviewPanel />

//     <div className="space-y-6">
//       {/* Search row */}
//       <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
//         <div className="flex-1">
//           <Input
//             placeholder="Search tests..."
//             className="h-10 flex-1 bg-muted/40 focus-visible:bg-background"
//           />
//         </div>

//         <Button variant="outline" className="sm:w-auto">
//           Filters
//         </Button>
//       </div>

//       {/* Test cards grid */}
//       <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
//         {Array.from({ length: 8 }).map((_, i) => (
//           <TestCard key={i} />
//         ))}
//       </section>
//     </div>
//   </div>
// </div>
