import React, { useState } from "react";
import { createHabit } from "../api";
import Spinner from "./Spinner";
import { useToast } from "./ToastProvider";

const defaultForm = {
  name: "",
  description: "",
  frequency: "MINUTE",
  intervalValue: 1,
};

export default function AddHabit({ onHabitAdded }) {
  const [form, setForm] = useState(defaultForm);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const setField = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name?.trim()) return;
    setSubmitting(true);

    try {
      const res = await createHabit({
        name: form.name.trim(),
        description: form.description.trim(),
        frequency: form.frequency,
        intervalValue: Number(form.intervalValue) || 1,
      });
      onHabitAdded(res.data);
      setForm(defaultForm);
      toast.success("Habit created");
    } catch (err) {
      toast.error("Failed to create habit");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="panel" style={{ padding: 16, marginBottom: 16 }}>
      <div className="section-title">Add New Habit</div>
      <form onSubmit={handleSubmit} className="grid" style={{ alignItems: "end" }}>
        <div className="col-4">
          <div className="label">Habit name</div>
          <input
            className="input"
            placeholder="e.g., Drink water"
            value={form.name}
            onChange={(e) => setField("name", e.target.value)}
            required
          />
        </div>
        <div className="col-4">
          <div className="label">Description (optional)</div>
          <input
            className="input"
            placeholder="Short note"
            value={form.description}
            onChange={(e) => setField("description", e.target.value)}
          />
        </div>
        <div className="col-2">
          <div className="label">Frequency</div>
          <select
            className="select"
            value={form.frequency}
            onChange={(e) => setField("frequency", e.target.value)}
          >
            <option value="MINUTE">Minute</option>
            <option value="HOUR">Hour</option>
            <option value="DAY">Day</option>
            <option value="WEEK">Week</option>
          </select>
        </div>
        <div className="col-2">
          <div className="label">Every</div>
          <input
            type="number"
            min="1"
            className="input"
            value={form.intervalValue}
            onChange={(e) => setField("intervalValue", e.target.value)}
          />
        </div>
        <div className="col-12" style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn" type="submit" disabled={submitting}>
            {submitting ? <span className="h-stack"><Spinner /> Creating…</span> : "Add Habit"}
          </button>
        </div>
      </form>
    </div>
  );
}
