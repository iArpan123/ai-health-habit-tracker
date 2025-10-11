import React, { useEffect, useState, useMemo } from "react";
import { getHabits } from "../api";
import AddHabit from "./AddHabit";
import HabitItem from "./HabitItem";
import Spinner from "./Spinner";

export default function HabitList() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await getHabits();
      setHabits(res.data || []);
    } catch (err) {
      // handled silently; UI shows empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const handleHabitAdded = (newHabit) => setHabits((prev) => [newHabit, ...prev]);
  const handleHabitUpdated = (updated) =>
    setHabits((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  const handleHabitDeleted = (id) => setHabits((prev) => prev.filter((h) => h.id !== id));

  const sorted = useMemo(() => {
    return [...habits].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [habits]);

  return (
    <div className="container">
      <AddHabit onHabitAdded={handleHabitAdded} />

      {loading ? (
        <div className="panel" style={{ padding: 20, display: "flex", alignItems: "center", gap: 12 }}>
          <Spinner /> <span className="subtle">Loading your habits…</span>
        </div>
      ) : sorted.length ? (
        <div className="grid">
          {sorted.map((habit) => (
            <div key={habit.id} className="col-6">
              <HabitItem habit={habit} onHabitUpdated={handleHabitUpdated} onHabitDeleted={handleHabitDeleted} />
            </div>
          ))}
        </div>
      ) : (
        <div className="panel empty">
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No habits yet</div>
          <div className="subtle">Add your first habit above. Tip: keep it tiny to build momentum.</div>
        </div>
      )}
    </div>
  );
}
