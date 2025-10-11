import React, { useState } from "react";
import { completeHabit, deleteHabit } from "../api";
import Spinner from "./Spinner";
import ConfirmDialog from "./ConfirmDialog";
import { useToast } from "./ToastProvider";

export default function HabitItem({ habit, onHabitUpdated, onHabitDeleted }) {
  const [busy, setBusy] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const toast = useToast();

  const handleComplete = async () => {
    // optimistic update
    setBusy(true);
    const previous = habit;
    try {
      const res = await completeHabit(habit.id);
      onHabitUpdated(res.data);
      toast.success("Marked as complete");
    } catch (err) {
      // rollback not needed as we did not mutate locally; just show toast
      toast.error("Failed to mark complete");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setConfirmOpen(false);
    setBusy(true);
    try {
      await deleteHabit(habit.id);
      onHabitDeleted(habit.id);
      toast.success("Habit deleted");
    } catch (err) {
      toast.error("Failed to delete");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <div className="card" style={{ position: "relative", overflow: "hidden" }}>
        {/* subtle animated gradient edge */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: "conic-gradient(from 180deg at 50% 50%, rgba(124,92,255,.12), transparent 30%, rgba(74,210,255,.1))",
          maskImage: "radial-gradient(400px 60px at 120% -20%, black, transparent 40%)",
          opacity: .6
        }} />
        <div className="v-stack">
          <div className="h-stack" style={{ justifyContent: "space-between" }}>
            <div style={{ fontWeight: 700, fontSize: 16 }}>{habit.name}</div>
            <div className="subtle">
              {habit.frequency} every {habit.intervalValue}
            </div>
          </div>
          {habit.description ? <div className="subtle">{habit.description}</div> : null}
          <div className="h-stack" style={{ gap: 18, flexWrap: "wrap" }}>
            <div className="subtle">Created: {new Date(habit.createdAt).toLocaleString()}</div>
            <div className="subtle">Completions: <span className="kbd">{habit.completedDates?.length ?? 0}</span></div>
          </div>
          <div className="h-stack" style={{ justifyContent: "flex-end", gap: 8, marginTop: 4 }}>
            <button className="btn-ghost" onClick={handleComplete} disabled={busy}>
              {busy ? <span className="h-stack"><Spinner /> Working…</span> : "Mark Complete"}
            </button>
            <button className="btn btn-danger" onClick={() => setConfirmOpen(true)} disabled={busy}>
              Delete
            </button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete habit?"
        description="This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setConfirmOpen(false)}
      />
    </>
  );
}
