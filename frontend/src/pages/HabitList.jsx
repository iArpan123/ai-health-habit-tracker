import React, { useEffect, useState } from "react";
import {
  getHabits,
  createHabit,
  updateHabit,
  deleteHabit,
  toggleHabit,
} from "../api/api";
import { useToast } from "../context/ToastContext";
import "./Habits.css";
import useHabitReminder from "../hooks/useHabitReminder";

export default function HabitList() {
  const [habits, setHabits] = useState([]);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [freq, setFreq] = useState("1d");
  const [custom, setCustom] = useState("");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  // Ask browser permission for notifications
  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Load all user habits on mount
  useEffect(() => {
    getHabits()
      .then((res) => {
        console.log("Fetched habits:", res.data);
        setHabits(res.data);
      })
      .catch((err) => console.error("Error fetching habits:", err));
  }, []);

  // Refresh habit list whenever reminder updates
  useHabitReminder(habits, async () => {
    const res = await getHabits();
    setHabits(res.data);
  });

  // Display different badge colors for frequency
  const getBadgeClass = (f) => {
    if (f.includes("m")) return "min";
    if (f.includes("h")) return "hour";
    if (f.includes("w")) return "week";
    if (f.includes("d")) return "day";
    return "custom";
  };

  const effectiveFreq = custom.trim() || freq;

  // Create or update habit in DB
  const handleAddOrUpdate = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.push("Please enter a habit name", "error");
    setLoading(true);

    try {
      if (editing) {
        const updated = { ...editing, name, description: note, frequency: effectiveFreq };
        const res = await updateHabit(editing.id, updated);
        setHabits((prev) => prev.map((h) => (h.id === editing.id ? res.data : h)));
        toast.push("Habit updated ✅", "success");
      } else {
        const res = await createHabit({
          name: name.trim(),
          description: note.trim(),
          frequency: effectiveFreq,
        });
        setHabits((prev) => [...prev, res.data]);
        toast.push("Habit added 🎉", "success");
      }
      resetForm();
    } catch (err) {
      console.error("Add/Update Error:", err);
      toast.push("Action failed", "error");
    } finally {
      setLoading(false);
    }
  };

  // Delete habit from database and UI
  const handleDelete = async (id) => {
    if (window.confirm("Delete this habit?")) {
      try {
        await deleteHabit(id);
        setHabits((prev) => prev.filter((h) => h.id !== id));
        toast.push("Habit deleted 🗑️", "success");
      } catch (err) {
        console.error("Delete Error:", err);
        toast.push("Failed to delete habit", "error");
      }
    }
  };

  // Toggle completion status for a habit
  const handleToggle = async (id) => {
    try {
      const res = await toggleHabit(id);
      setHabits((prev) => prev.map((h) => (h.id === id ? res.data : h)));
      toast.push(res.data.completed ? "Habit completed! 🎯" : "Marked as pending", "success");
    } catch (err) {
      console.error("Toggle Error:", err);
      toast.push("Could not toggle habit", "error");
    }
  };

  // Update UI when service worker triggers habit refresh
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.addEventListener("message", (event) => {
        if (event.data?.type === "REFRESH_HABITS") {
          getHabits().then((res) => setHabits(res.data));
        }
      });
    }
  }, []);

  // Load selected habit into form for editing
  const handleEdit = (habit) => {
    setEditing(habit);
    setName(habit.name);
    setNote(habit.description);
    setFreq(habit.frequency);
  };

  // Reset form fields
  const resetForm = () => {
    setName("");
    setNote("");
    setCustom("");
    setFreq("1d");
    setEditing(null);
  };

  // UI rendering
  return (
    <div className="habit-container fade-in glass-card">
      <h2 className="glow">Your Habits</h2>

      <form onSubmit={handleAddOrUpdate} className="habit-form enhanced">
        <div className="field-group">
          <label className="field-label">🧠 Habit Name</label>
          <input
            type="text"
            value={name}
            placeholder="e.g. Drink Water, Meditate..."
            onChange={(e) => setName(e.target.value)}
            required
            className="glow-input"
          />
        </div>

        <div className="field-group inline">
          <div>
            <label className="field-label">⏳ Frequency</label>
            <select
              value={freq}
              onChange={(e) => setFreq(e.target.value)}
              className="glow-select"
            >
              <option value="1m">Every minute</option>
              <option value="1h">Hourly</option>
              <option value="1d">Daily</option>
              <option value="1w">Weekly</option>
            </select>
          </div>

          {(freq === "1d" || freq === "1w") && (
            <div>
              <label className="field-label">🕒 Time</label>
              <input
                type="time"
                onChange={(e) => setCustom(e.target.value)}
                className="glow-input"
              />
            </div>
          )}

          {freq === "1w" && (
            <div>
              <label className="field-label">📅 Day</label>
              <select
                onChange={(e) =>
                  setCustom((prev) => `${prev || ""}-${e.target.value}`)
                }
                className="glow-select"
              >
                <option value="">Select</option>
                <option value="MONDAY">Mon</option>
                <option value="TUESDAY">Tue</option>
                <option value="WEDNESDAY">Wed</option>
                <option value="THURSDAY">Thu</option>
                <option value="FRIDAY">Fri</option>
                <option value="SATURDAY">Sat</option>
                <option value="SUNDAY">Sun</option>
              </select>
            </div>
          )}
        </div>

        <div className="field-group">
          <label className="field-label">📝 Short Note</label>
          <textarea
            value={note}
            placeholder="Optional — add motivation or reason for this habit"
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            className="glow-input"
          />
        </div>

        <div className="actions">
          <button type="submit" disabled={loading} className="btn-glow">
            {loading ? (
              <span className="btn-spinner" />
            ) : editing ? (
              "Update Habit"
            ) : (
              "Add Habit"
            )}
          </button>
          {editing && (
            <button type="button" className="btn-cancel" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <ul className="habit-list">
        {habits.map((h) => (
          <li
            key={h.id}
            className={`habit-item slide-up ${h.completed ? "completed" : ""}`}
          >
            <div className="item-left">
              <button
                className={`check ${h.completed ? "active" : ""}`}
                onClick={() => handleToggle(h.id)}
                title="Mark as done"
              />
              <div>
                <div className="title">{h.name}</div>
                {h.description && <div className="note">{h.description}</div>}
                <div className={`badge ${getBadgeClass(h.frequency || "1d")}`}>
                  {h.frequency || "1d"}
                </div>
              </div>
            </div>
            <div className="item-actions">
              <span className="streak">🔥 {h.streak || 0}</span>
              <button className="edit" onClick={() => handleEdit(h)}>
                ✏️
              </button>
              <button className="del" onClick={() => handleDelete(h.id)}>
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
