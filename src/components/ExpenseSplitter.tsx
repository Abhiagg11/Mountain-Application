import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { Plus, Trash2, Wallet, X } from "lucide-react";
import type { ExpenseItem } from "../types";

interface ExpenseSplitterProps {
  travellers: string[];
  expenses: ExpenseItem[];
  onAddTraveller: (name: string) => void;
  onRemoveTraveller: (name: string) => void;
  onAddExpense: (item: Omit<ExpenseItem, "id">) => void;
  onDeleteExpense: (id: string) => void;
}

function formatInr(amount: number) {
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

export function ExpenseSplitter({
  travellers,
  expenses,
  onAddTraveller,
  onRemoveTraveller,
  onAddExpense,
  onDeleteExpense,
}: ExpenseSplitterProps) {
  const [newTravellerName, setNewTravellerName] = useState("");
  const [paidBy, setPaidBy] = useState<string>(() => travellers[0] ?? "");
  const [description, setDescription] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [expenseDate, setExpenseDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    if (travellers.length > 0 && !travellers.includes(paidBy)) {
      setPaidBy(travellers[0]);
    } else if (travellers.length === 0) {
      setPaidBy("");
    }
  }, [travellers, paidBy]);

  function handleTravellerSubmit(e: FormEvent) {
    e.preventDefault();
    const clean = newTravellerName.trim();
    if (!clean) return;
    onAddTraveller(clean);
    setPaidBy(clean);
    setNewTravellerName("");
  }

  function handleExpenseSubmit(e: FormEvent) {
    e.preventDefault();
    const parsed = Number(amountInput);
    if (!description.trim() || !Number.isFinite(parsed) || parsed <= 0 || !paidBy) {
      return;
    }

    onAddExpense({
      description: description.trim(),
      amountInr: Math.round(parsed * 100) / 100,
      paidBy,
      date: expenseDate || new Date().toISOString().slice(0, 10),
    });

    setDescription("");
    setAmountInput("");
  }

  const splitSummary = useMemo(() => {
    const activePeople = Array.from(
      new Set([
        ...travellers,
        ...expenses.map((e) => e.paidBy).filter(Boolean),
      ])
    );

    const n = activePeople.length;
    const paidPaiseByPerson = new Map<string, number>();
    const sharePaiseByPerson = new Map<string, number>();
    for (const person of activePeople) {
      paidPaiseByPerson.set(person, 0);
      sharePaiseByPerson.set(person, 0);
    }

    let totalPaise = 0;
    expenses.forEach((exp, idx) => {
      const paise = Math.round(Number(exp.amountInr) * 100);
      totalPaise += paise;
      paidPaiseByPerson.set(
        exp.paidBy,
        (paidPaiseByPerson.get(exp.paidBy) ?? 0) + paise
      );

      if (n > 0) {
        const base = Math.floor(paise / n);
        const rem = paise % n;
        activePeople.forEach((person, pIdx) => {
          const extra = (pIdx - (idx % n) + n) % n < rem ? 1 : 0;
          sharePaiseByPerson.set(
            person,
            (sharePaiseByPerson.get(person) ?? 0) + base + extra
          );
        });
      }
    });

    const rows = activePeople.map((person) => {
      const paid = paidPaiseByPerson.get(person) ?? 0;
      const share = sharePaiseByPerson.get(person) ?? 0;
      return {
        person,
        paidInr: paid / 100,
        shareInr: share / 100,
        netInr: (paid - share) / 100,
        netPaise: paid - share,
      };
    });

    const creditors = rows
      .filter((r) => r.netPaise > 0)
      .map((r) => ({ person: r.person, paise: r.netPaise }));
    const debtors = rows
      .filter((r) => r.netPaise < 0)
      .map((r) => ({ person: r.person, paise: -r.netPaise }));

    const transfers: { from: string; to: string; amountInr: number }[] = [];
    let i = 0;
    let j = 0;
    while (i < debtors.length && j < creditors.length) {
      const amt = Math.min(debtors[i].paise, creditors[j].paise);
      if (amt > 0) {
        transfers.push({
          from: debtors[i].person,
          to: creditors[j].person,
          amountInr: amt / 100,
        });
      }
      debtors[i].paise -= amt;
      creditors[j].paise -= amt;
      if (debtors[i].paise === 0) i++;
      if (creditors[j].paise === 0) j++;
    }

    return {
      totalInr: totalPaise / 100,
      count: n,
      rows,
      transfers,
    };
  }, [travellers, expenses]);

  return (
    <section style={styles.card}>
      <div style={styles.sectionHeader}>
        <Wallet size={18} />
        <h2 style={styles.h2}>Custom Travellers & N-Way Expense Split</h2>
      </div>

      <form onSubmit={handleTravellerSubmit} style={styles.inlineForm}>
        <input
          style={styles.input}
          value={newTravellerName}
          onChange={(e) => setNewTravellerName(e.target.value)}
          placeholder="Add traveller name (any count)"
        />
        <button type="submit" style={styles.secondaryBtn}>
          <Plus size={16} /> Add Person
        </button>
      </form>

      <div style={styles.chipWrap}>
        {travellers.map((person) => (
          <span key={person} style={styles.personChip}>
            {person}
            <button
              type="button"
              style={styles.chipRemove}
              onClick={() => onRemoveTraveller(person)}
              aria-label={`Remove ${person}`}
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>

      <form onSubmit={handleExpenseSubmit} style={styles.subCard}>
        <div style={styles.eyebrow}>RECORD SHARED EXPENSE</div>
        <div style={styles.formGrid}>
          <input
            style={styles.input}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What was it for? (e.g. Homestay, Dinner)"
            required
          />
          <input
            style={styles.input}
            type="number"
            min="0.01"
            step="0.01"
            value={amountInput}
            onChange={(e) => setAmountInput(e.target.value)}
            placeholder="Amount in ₹"
            required
          />
          <select
            style={styles.select}
            value={paidBy}
            onChange={(e) => setPaidBy(e.target.value)}
            disabled={travellers.length === 0}
          >
            {travellers.length === 0 ? (
              <option value="">Add a traveller first</option>
            ) : (
              travellers.map((t) => (
                <option key={t} value={t}>
                  Paid by {t}
                </option>
              ))
            )}
          </select>
          <input
            style={styles.input}
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />
        </div>
        <button
          type="submit"
          style={styles.primaryBtn}
          disabled={travellers.length === 0}
        >
          <Plus size={16} /> Add Expense
        </button>
      </form>

      <div style={styles.summaryStrip}>
        <div>
          <div style={styles.mutedText}>Total Spent</div>
          <strong style={styles.statValue}>{formatInr(splitSummary.totalInr)}</strong>
        </div>
        <div>
          <div style={styles.mutedText}>Split Across</div>
          <strong style={styles.statValue}>
            {splitSummary.count} {splitSummary.count === 1 ? "person" : "people"}
          </strong>
        </div>
      </div>

      {expenses.length > 0 && (
        <div style={styles.listStack}>
          {expenses.map((exp) => (
            <div key={exp.id} style={styles.expenseRow}>
              <div>
                <strong>{exp.description}</strong>
                <div style={styles.mutedText}>
                  Paid by {exp.paidBy} · {exp.date}
                </div>
              </div>
              <div style={styles.actionRow}>
                <strong>{formatInr(exp.amountInr)}</strong>
                <button
                  type="button"
                  style={styles.iconDangerBtn}
                  onClick={() => onDeleteExpense(exp.id)}
                  aria-label={`Delete ${exp.description}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={styles.subCard}>
        <div style={styles.eyebrow}>BALANCES & SETTLEMENTS</div>
        <div style={styles.listStack}>
          {splitSummary.rows.map((row) => (
            <div key={row.person} style={styles.balanceRow}>
              <strong>{row.person}</strong>
              <span style={styles.mutedText}>
                Paid {formatInr(row.paidInr)} · Share {formatInr(row.shareInr)}
              </span>
              <strong
                style={{
                  color:
                    row.netInr > 0
                      ? "var(--accent)"
                      : row.netInr < 0
                      ? "var(--danger)"
                      : "var(--muted)",
                }}
              >
                {row.netInr > 0
                  ? `+${formatInr(row.netInr)} to receive`
                  : row.netInr < 0
                  ? `${formatInr(Math.abs(row.netInr))} to pay`
                  : "Settled"}
              </strong>
            </div>
          ))}
        </div>

        <div style={{ marginTop: 12 }}>
          <div style={styles.eyebrow}>WHO OWES WHOM</div>
          {splitSummary.transfers.length === 0 ? (
            <p style={styles.p}>Everyone is settled up.</p>
          ) : (
            splitSummary.transfers.map((tr, idx) => (
              <div key={idx} style={styles.transferLine}>
                <span>
                  <strong>{tr.from}</strong> → <strong>{tr.to}</strong>
                </span>
                <strong>{formatInr(tr.amountInr)}</strong>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

const styles: Record<string, React.CSSProperties> = {
  eyebrow: {
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: "0.08em",
    color: "var(--muted)",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  h2: {
    margin: 0,
    fontSize: 18,
    lineHeight: 1.3,
  },
  p: {
    margin: "4px 0 0",
    fontSize: 14,
    color: "var(--muted)",
    lineHeight: 1.5,
  },
  mutedText: {
    fontSize: 12,
    color: "var(--muted)",
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
  subCard: {
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    padding: 14,
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    color: "var(--accent)",
  },
  actionRow: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
  },
  formGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 10,
  },
  inlineForm: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
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
  select: {
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
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "9px 14px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--surface-alt)",
    fontWeight: 600,
    fontSize: 14,
    cursor: "pointer",
  },
  iconDangerBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    border: "1px solid var(--border)",
    background: "transparent",
    color: "var(--danger)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
  },
  chipWrap: {
    display: "flex",
    flexWrap: "wrap",
    gap: 8,
  },
  personChip: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    padding: "5px 10px",
    borderRadius: 999,
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
    fontSize: 13,
    fontWeight: 500,
  },
  chipRemove: {
    border: "none",
    background: "transparent",
    color: "var(--muted)",
    display: "grid",
    placeItems: "center",
    cursor: "pointer",
    padding: 0,
  },
  summaryStrip: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    background: "var(--surface-alt)",
    border: "1px solid var(--border)",
  },
  statValue: {
    fontSize: 18,
  },
  listStack: {
    display: "flex",
    flexDirection: "column",
    gap: 8,
  },
  expenseRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid var(--border)",
    background: "var(--bg)",
  },
  balanceRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
    padding: "8px 10px",
    borderRadius: 8,
    background: "var(--surface)",
    border: "1px solid var(--border)",
    fontSize: 13,
  },
  transferLine: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 0",
    fontSize: 13,
  },
};
