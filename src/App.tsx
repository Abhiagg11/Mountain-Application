import { useEffect, useState } from "react";
import { Calendar, Check, Moon, Pencil, Sun, Users } from "lucide-react";
import { ExpenseSplitter } from "./components/ExpenseSplitter";
import { SpotExplorer } from "./components/SpotExplorer";
import {
  DEFAULT_TRIP_META,
  INITIAL_EXPENSES,
  INITIAL_SPOTS,
  INITIAL_TRAVELLERS,
} from "./data/spots";
import { readStorage, STORAGE_KEYS, writeStorage } from "./lib/storage";
import type { ExpenseItem, MountainSpot, TripMeta } from "./types";

export default function App() {
  const [theme, setTheme] = useState<"light" | "dark">(() =>
    readStorage<"light" | "dark">(STORAGE_KEYS.theme, "light") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    writeStorage(STORAGE_KEYS.theme, theme);
  }, [theme]);

  const [tripMeta, setTripMeta] = useState<TripMeta>(() =>
    readStorage<TripMeta>(STORAGE_KEYS.tripMeta, DEFAULT_TRIP_META)
  );
  const [editingTrip, setEditingTrip] = useState(false);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.tripMeta, tripMeta);
  }, [tripMeta]);

  const [spots, setSpots] = useState<MountainSpot[]>(() =>
    readStorage<MountainSpot[]>(STORAGE_KEYS.spots, INITIAL_SPOTS)
  );
  useEffect(() => {
    writeStorage(STORAGE_KEYS.spots, spots);
  }, [spots]);

  const [travellers, setTravellers] = useState<string[]>(() =>
    readStorage<string[]>(STORAGE_KEYS.travellers, INITIAL_TRAVELLERS)
  );
  useEffect(() => {
    writeStorage(STORAGE_KEYS.travellers, travellers);
  }, [travellers]);

  const [expenses, setExpenses] = useState<ExpenseItem[]>(() =>
    readStorage<ExpenseItem[]>(STORAGE_KEYS.expenses, INITIAL_EXPENSES)
  );
  useEffect(() => {
    writeStorage(STORAGE_KEYS.expenses, expenses);
  }, [expenses]);

  function handleAddSpot(spot: Omit<MountainSpot, "id" | "custom">) {
    setSpots((prev) => [
      {
        ...spot,
        id: `custom-${Date.now()}`,
        custom: true,
      },
      ...prev,
    ]);
  }

  function handleDeleteSpot(id: string) {
    setSpots((prev) => prev.filter((s) => s.id !== id));
  }

  function handleAddTraveller(name: string) {
    setTravellers((prev) =>
      prev.some((t) => t.toLowerCase() === name.toLowerCase())
        ? prev
        : [...prev, name]
    );
  }

  function handleRemoveTraveller(name: string) {
    setTravellers((prev) => prev.filter((t) => t !== name));
  }

  function handleAddExpense(item: Omit<ExpenseItem, "id">) {
    setExpenses((prev) => [
      {
        ...item,
        id: `exp-${Date.now()}`,
      },
      ...prev,
    ]);
  }

  function handleDeleteExpense(id: string) {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div style={styles.shell}>
      <header style={styles.header}>
        <div>
          <div style={styles.eyebrow}>INDIA MOUNTAIN GUIDE</div>
          <h1 style={styles.h1}>Indian Mountain Explorer</h1>
        </div>
        <button
          type="button"
          style={styles.iconBtn}
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          aria-label="Toggle theme"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </header>

      <section style={styles.card}>
        <div style={styles.rowBetween}>
          <div>
            <div style={styles.eyebrow}>TRIP BRIEF</div>
            {editingTrip ? (
              <div style={styles.inlineEdit}>
                <input
                  style={styles.input}
                  value={tripMeta.title}
                  onChange={(e) =>
                    setTripMeta((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Trip title"
                />
                <input
                  style={styles.input}
                  value={tripMeta.window}
                  onChange={(e) =>
                    setTripMeta((prev) => ({ ...prev, window: e.target.value }))
                  }
                  placeholder="Dates or season"
                />
                <button
                  type="button"
                  style={styles.primaryBtn}
                  onClick={() => setEditingTrip(false)}
                >
                  <Check size={16} /> Save
                </button>
              </div>
            ) : (
              <>
                <h2 style={styles.h2}>{tripMeta.title}</h2>
                <div style={styles.metaRow}>
                  <span style={styles.metaChip}>
                    <Calendar size={14} /> {tripMeta.window}
                  </span>
                  <span style={styles.metaChip}>
                    <Users size={14} /> {travellers.length} Travellers
                  </span>
                </div>
              </>
            )}
          </div>
          {!editingTrip && (
            <button
              type="button"
              style={styles.ghostBtn}
              onClick={() => setEditingTrip(true)}
            >
              <Pencil size={15} /> Edit
            </button>
          )}
        </div>
      </section>

      <SpotExplorer
        spots={spots}
        onAddSpot={handleAddSpot}
        onDeleteSpot={handleDeleteSpot}
      />

      <ExpenseSplitter
        travellers={travellers}
        expenses={expenses}
        onAddTraveller={handleAddTraveller}
        onRemoveTraveller={handleRemoveTraveller}
        onAddExpense={handleAddExpense}
        onDeleteExpense={handleDeleteExpense}
      />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  shell: {
    maxWidth: 860,
    margin: "0 auto",
    padding: "20px 16px 64px",
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h1: {
    margin: 0,
    fontSize: 26,
    lineHeight: 1.2,
  },
  h2: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.3,
  },
  card: {
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 16,
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 14,
  },
  rowBetween: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  metaRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 8,
  },
  metaChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    fontSize: 12,
    padding: "4px 10px",
    borderRadius: 999,
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
  },
  inlineEdit: {
    display: "flex",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 6,
  },
  input: {
    flex: 1,
    minWidth: 150,
    padding: "9px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    fontSize: 14,
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 10,
    border: "none",
    background: "var(--accent)",
    color: "#ffffff",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  ghostBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    padding: "6px 10px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    fontSize: 13,
    cursor: "pointer",
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
};
